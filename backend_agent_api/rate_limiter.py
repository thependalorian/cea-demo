"""
Rate limiter middleware for FastAPI applications.

This module provides a rate limiting middleware that can be used to limit the number of requests
per minute from a specific client. It uses an in-memory store to track request counts and supports
both per-user limits (for authenticated requests) and per-IP limits (for unauthenticated requests).

Environment variables:
- RATE_LIMIT_PER_MINUTE: Maximum number of requests allowed per minute (default: 60)
- RATE_LIMIT_BURST: Maximum number of requests allowed in a burst (default: 10)
"""

import time
import os
from typing import Dict, Tuple, Optional
from fastapi import Request, Response, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimiter:
    """Simple in-memory rate limiter."""

    def __init__(self, rate_limit: int = 60, burst_limit: int = 10):
        """
        Initialize the rate limiter.
        
        Args:
            rate_limit: Maximum number of requests allowed per minute
            burst_limit: Maximum number of burst requests allowed
        """
        self.rate_limit = rate_limit
        self.burst_limit = burst_limit
        self.requests: Dict[str, Tuple[int, float]] = {}  # {key: (count, timestamp)}
        self.cleanup_counter = 0
    
    def _get_client_key(self, request: Request) -> str:
        """
        Get a unique identifier for the client.
        
        Tries to use user_id from request state if available (for authenticated requests),
        otherwise falls back to client IP address.
        
        Args:
            request: FastAPI request object
            
        Returns:
            A string identifier for the client
        """
        # Try to get user_id from request state (set by auth middleware)
        user_id = getattr(request.state, "user_id", None)
        if user_id:
            return f"user:{user_id}"
            
        # Fall back to IP address
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Get the first IP in the chain (client's real IP)
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"
            
        return f"ip:{client_ip}"
    
    def is_rate_limited(self, request: Request) -> Tuple[bool, Optional[int]]:
        """
        Check if a request should be rate limited.
        
        Args:
            request: FastAPI request object
            
        Returns:
            A tuple of (is_limited, retry_after_seconds)
        """
        key = self._get_client_key(request)
        current_time = time.time()
        
        # Occasional cleanup of old entries (every 100 requests)
        self.cleanup_counter += 1
        if self.cleanup_counter >= 100:
            self._cleanup_old_entries(current_time)
            self.cleanup_counter = 0
        
        # Check if client exists in tracking dict
        if key in self.requests:
            count, timestamp = self.requests[key]
            
            # If it's been more than a minute since the first request in this window,
            # reset the counter
            if current_time - timestamp >= 60:
                self.requests[key] = (1, current_time)
                return False, None
                
            # If we're under the limit, increment and allow
            if count < self.rate_limit:
                self.requests[key] = (count + 1, timestamp)
                return False, None
                
            # If we're at or over limit, check if burst allowed
            if count < self.rate_limit + self.burst_limit:
                self.requests[key] = (count + 1, timestamp)
                return False, None
                
            # Over limit and burst, calculate retry-after time
            retry_after = int(60 - (current_time - timestamp))
            return True, max(1, retry_after)
        
        # First request from this client
        self.requests[key] = (1, current_time)
        return False, None
    
    def _cleanup_old_entries(self, current_time: float) -> None:
        """
        Remove entries older than 2 minutes to prevent memory leaks.
        
        Args:
            current_time: Current timestamp
        """
        keys_to_remove = []
        for key, (_, timestamp) in self.requests.items():
            if current_time - timestamp > 120:  # 2 minutes
                keys_to_remove.append(key)
                
        for key in keys_to_remove:
            self.requests.pop(key, None)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for rate limiting."""
    
    def __init__(self, app, rate_limiter: RateLimiter = None):
        super().__init__(app)
        
        # Get limits from environment variables
        rate_limit = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
        burst_limit = int(os.getenv("RATE_LIMIT_BURST", "10"))
        
        # Create rate limiter if not provided
        self.rate_limiter = rate_limiter or RateLimiter(rate_limit, burst_limit)
    
    async def dispatch(self, request: Request, call_next):
        """
        Process incoming requests through the rate limiter.
        
        Args:
            request: FastAPI request
            call_next: Next middleware/endpoint handler
            
        Returns:
            Response object
        """
        # Skip rate limiting for health check endpoint
        if request.url.path == "/health":
            return await call_next(request)
            
        # Check if rate limited
        is_limited, retry_after = self.rate_limiter.is_rate_limited(request)
        
        if is_limited:
            headers = {}
            if retry_after:
                headers["Retry-After"] = str(retry_after)
                
            return JSONResponse(
                status_code=429,
                content={"error": "Too many requests", "retry_after": retry_after},
                headers=headers
            )
        
        # Continue processing the request
        return await call_next(request)


def get_rate_limiter():
    """Dependency to get the rate limiter instance for direct use in endpoints."""
    # This can be enhanced to use a global instance from app state
    rate_limit = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    burst_limit = int(os.getenv("RATE_LIMIT_BURST", "10"))
    return RateLimiter(rate_limit, burst_limit)


# Direct rate limiting dependency for individual routes
async def rate_limit_dependency(
    request: Request,
    rate_limiter: RateLimiter = Depends(get_rate_limiter)
):
    """
    Dependency for applying rate limiting to specific routes.
    
    Usage:
        @app.get("/endpoint", dependencies=[Depends(rate_limit_dependency)])
        def endpoint():
            ...
    """
    is_limited, retry_after = rate_limiter.is_rate_limited(request)
    
    if is_limited:
        headers = {}
        if retry_after:
            headers["Retry-After"] = str(retry_after)
            
        raise HTTPException(
            status_code=429, 
            detail={"error": "Too many requests", "retry_after": retry_after},
            headers=headers
        ) 