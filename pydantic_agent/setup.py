#!/usr/bin/env python3
from setuptools import setup, find_packages

setup(
    name="pydantic_agent",
    version="0.1.0",
    description="Pydantic models for Climate Economy Assistant",
    author="Climate Economy Assistant Team",
    author_email="info@climateeconomyassistant.org",
    packages=find_packages(),
    install_requires=[
        "pydantic>=2.0.0",
        "pydantic-extra-types>=2.0.0",
        "email-validator>=2.0.0",
        "supabase>=1.0.0",
    ],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.9",
) 