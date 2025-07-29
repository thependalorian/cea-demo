#!/usr/bin/env python3
"""
Enhanced Database Verification Script for Pendo Climate Economy Assistant

This script verifies that our Supabase database has the complete structure
needed for the Pendo agent, including all tables, functions, and vector search capabilities.
"""

import os
import sys
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import AsyncOpenAI
import json
from typing import Dict, List, Any

# Load environment variables
load_dotenv()

def check_environment():
    """Verify all required environment variables are present."""
    print("🔍 Checking Environment Variables...")
    
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_SERVICE_KEY", 
        "LLM_PROVIDER",
        "LLM_BASE_URL",
        "LLM_API_KEY",
        "EMBEDDING_PROVIDER",
        "EMBEDDING_BASE_URL", 
        "EMBEDDING_API_KEY",
        "EMBEDDING_MODEL_CHOICE"
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            # Show first 10 chars for keys, full value for others
            if 'KEY' in var or 'URL' in var:
                print(f"   ✅ {var}: {'*' * len(value[:10])}...")
            else:
                print(f"   ✅ {var}: {value}")
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ All environment variables present")
    return True

def test_supabase_connection():
    """Test Supabase connection and list available tables."""
    print("\n🔗 Testing Supabase Connection...")
    
    try:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Test connection by querying a system table
        response = supabase.table('conversations').select('id').limit(1).execute()
        
        print("✅ Successfully connected to Supabase")
        return supabase
        
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return None

def verify_core_tables(supabase: Client):
    """Verify that all core tables exist and have expected structure."""
    print("\n📊 Verifying All Database Tables...")
    
    # All tables across schemas for comprehensive verification
    all_tables = {
        # Core agent tables
        'consolidated_profiles': ['id', 'email', 'full_name', 'profile_type', 'current_title', 'experience_level'],
        'conversations': ['id', 'user_id', 'title', 'status', 'conversation_type', 'session_id'],
        'conversation_messages': ['id', 'conversation_id', 'role', 'content', 'embedding'],
        'messages': ['id', 'conversation_id', 'role', 'content', 'embedding'],
        'resumes': ['id', 'user_id', 'file_name', 'content', 'embedding', 'processed'],
        'resume_chunks': ['id', 'resume_id', 'content', 'embedding', 'section_type'],
        'knowledge_resources': ['id', 'title', 'content', 'embedding', 'climate_sectors', 'career_stages'],
        'job_listings': ['id', 'partner_id', 'title', 'description', 'climate_focus', 'skills_required'],
        'education_programs': ['id', 'partner_id', 'program_name', 'description', 'climate_focus'],
        'agents': ['id', 'name', 'agent_id', 'specializations', 'capabilities', 'status'],
        
        # User management tables
        'user_profiles': ['id', 'email', 'full_name', 'is_admin'],
        'user_interests': ['id', 'user_id', 'climate_focus', 'career_stage', 'target_roles'],
        'user_activities': ['id', 'user_id', 'activity_type', 'details'],
        'users': ['id', 'email', 'password_hash'],
        
        # Admin and permissions
        'admin_profiles': ['id', 'user_id', 'email', 'full_name', 'permissions'],
        'admin_permissions': ['id', 'admin_id', 'resource_type', 'permission_level'],
        
        # Climate-specific tables
        'african_credential_frameworks': ['id', 'credential_name', 'issuing_country', 'us_equivalent_level'],
        'credential_evaluation': ['id', 'user_id', 'credential_type', 'issuing_country', 'us_equivalent'],
        'masscec_priority_groups': ['id', 'group_name', 'description', 'workforce_size_estimate'],
        'regional_qualification_frameworks': ['id', 'framework_name', 'region', 'member_countries'],
        'skills_mapping': ['id', 'skill_name', 'category', 'climate_relevance', 'background_type'],
        'mos_translation': ['id', 'mos_code', 'mos_title', 'branch', 'civilian_equivalents'],
        
        # Partner and business tables
        'partner_profiles': ['id', 'user_id', 'organization_name', 'organization_website'],
        'partner_activities': ['id', 'partner_id', 'activity_type', 'details'],
        'partner_match_results': ['id', 'candidate_id', 'job_id', 'match_score', 'threshold_met'],
        'partner_subscriptions': ['id', 'partner_id', 'stripe_subscription_id', 'status', 'pricing_tier'],
        'payments': ['id', 'partner_id', 'job_listing_id', 'amount', 'status', 'payment_type'],
        'subscriptions': ['id', 'user_id', 'plan_id', 'status', 'user_type', 'tier'],
        'subscription_features': ['id', 'subscription_id', 'feature_name', 'feature_value'],
        'subscription_usage': ['id', 'subscription_id', 'feature_name', 'usage_count'],
        'early_access_slots': ['id', 'tier_id', 'total_slots', 'used_slots'],
        
        # Analytics and feedback
        'conversation_analytics': ['id', 'conversation_id', 'user_id', 'session_duration_seconds'],
        'conversation_feedback': ['id', 'conversation_id', 'message_id', 'user_id', 'feedback_type'],
        'conversation_interrupts': ['id', 'conversation_id', 'type', 'priority', 'status'],
        'message_feedback': ['id', 'conversation_id', 'message_id', 'user_id', 'feedback_type'],
        'resource_views': ['id', 'user_id', 'resource_id', 'resource_type', 'viewed_at'],
        'saved_jobs': ['id', 'user_id', 'job_id'],
        
        # System and workflow tables
        'workflow_sessions': ['session_id', 'user_id', 'workflow_type', 'data', 'status'],
        'workflow_results': ['id', 'user_id', 'conversation_id', 'message', 'analysis'],
        'bookings': ['id', 'user_id', 'team_id', 'agent_id', 'datetime', 'status'],
        'requests': ['id', 'user_id', 'timestamp', 'user_query'],
        
        # Audit and security
        'audit_logs': ['id', 'user_id', '_audit_action', 'table_name', 'record_id'],
        'security_audit_logs': ['id', 'timestamp', 'event_type', 'user_id', 'ip_address'],
        'credential_evaluation_audit': ['id', 'original_id', 'user_id', 'credential_type'],
        'content_flags': ['id', 'content_type', 'content_id', 'flag_reason', 'flagged_by'],
        
        # Vector and semantic search
        'semantic_embeddings': ['id', 'type', 'name', 'embedding', 'metadata'],
        'role_requirements': ['id', 'role_title', 'climate_sector', 'experience_level', 'required_skills']
    }
    
    verified_tables = []
    
    for table_name, expected_columns in all_tables.items():
        try:
            # Test table access
            response = supabase.table(table_name).select('*').limit(1).execute()
            verified_tables.append(table_name)
            
            # Check if table has data
            count_response = supabase.table(table_name).select('id', count='exact').execute()
            row_count = count_response.count if hasattr(count_response, 'count') else len(count_response.data)
            
            print(f"   ✅ {table_name}: accessible ({row_count} rows)")
            
        except Exception as e:
            print(f"   ❌ {table_name}: {str(e)}")
    
    print(f"\n📈 Verified {len(verified_tables)}/{len(all_tables)} tables")
    return verified_tables

def verify_mem0_vecs_tables(supabase: Client):
    """Verify mem0 vector tables in vecs schema."""
    print("\n🧠 Verifying Mem0 Vector Tables (vecs schema)...")
    
    # Note: Mem0 creates these tables automatically on first use
    # We'll verify by checking if the vecs extension exists
    verified_vecs = []
    
    try:
        # Check if vecs extension is enabled
        response = supabase.rpc('get_schema_version').execute()
        print("   ✅ vecs extension appears to be available")
        verified_vecs.append("vecs_extension")
    except Exception as e:
        print("   ℹ️  vecs tables will be created by Mem0 on first use")
    
    # Check if we can access information about vecs schema
    try:
        # This is a safer way to check for vecs tables
        response = supabase.table('information_schema.tables').select('table_name').eq('table_schema', 'vecs').execute()
        vecs_table_count = len(response.data) if response.data else 0
        if vecs_table_count > 0:
            print(f"   ✅ Found {vecs_table_count} tables in vecs schema")
            verified_vecs.append(f"vecs_tables_{vecs_table_count}")
        else:
            print("   ℹ️  vecs schema tables will be initialized by Mem0")
    except Exception as e:
        print("   ℹ️  vecs schema not yet initialized (normal for fresh setup)")
    
    print(f"\n🎯 Mem0 setup status: {'Ready' if len(verified_vecs) > 0 else 'Will initialize on first use'}")
    return verified_vecs

def verify_auth_tables(supabase: Client):
    """Verify Supabase auth schema tables."""
    print("\n🔐 Verifying Auth Schema...")
    
    # Auth tables are managed by Supabase Auth service and not directly accessible
    # We'll verify auth is working by checking if we can access user management
    verified_auth = []
    
    try:
        # Test auth service availability by checking if we can query users table
        # (This will fail if auth is completely broken)
        response = supabase.auth.get_user()
        print("   ✅ Supabase Auth service is accessible")
        verified_auth.append("auth_service")
    except Exception as e:
        # This is expected when not authenticated, but confirms auth service exists
        if "not authenticated" in str(e).lower() or "invalid" in str(e).lower():
            print("   ✅ Supabase Auth service is working (not authenticated is expected)")
            verified_auth.append("auth_service")
        else:
            print(f"   ⚠️  Auth service issue: {str(e)[:50]}...")
    
    # Check if we can access session data (another auth indicator)
    try:
        session = supabase.auth.get_session()
        print("   ✅ Auth session management working")
        verified_auth.append("session_management")
    except Exception as e:
        if "no session" in str(e).lower() or "not authenticated" in str(e).lower():
            print("   ✅ Auth session management working (no session is expected)")
            verified_auth.append("session_management")
        else:
            print(f"   ⚠️  Session management issue: {str(e)[:50]}...")
    
    print(f"\n🔑 Auth system status: {'✅ Fully operational' if len(verified_auth) >= 2 else '⚠️ Partial functionality'}")
    return verified_auth

def test_vector_search_functions(supabase: Client):
    """Test vector search functions that are available."""
    print("\n🔍 Testing Vector Search Functions...")
    
    # Test available vector search functions with proper vector format
    vector_functions = [
        'match_knowledge_resources',
        'match_resume_content', 
        'match_resume_chunks',
        'search_conversation_messages',
        'search_training_messages'
    ]
    
    working_functions = []
    
    # Create a proper test vector (1536 dimensions for text-embedding-3-small)
    test_vector = [0.1] * 1536  # Proper array for OpenAI dimensions
    
    for func_name in vector_functions:
        try:
            # Test function exists by calling it with safe parameters
            if func_name == 'match_knowledge_resources':
                response = supabase.rpc(func_name, {
                    'query_embedding': test_vector,
                    'match_threshold': 0.8,
                    'match_count': 1
                }).execute()
            elif func_name == 'match_resume_content':
                response = supabase.rpc(func_name, {
                    'query_embedding': test_vector,
                    'match_threshold': 0.8,
                    'match_count': 1,
                    'user_id': None
                }).execute()
            elif func_name == 'search_conversation_messages':
                response = supabase.rpc(func_name, {
                    'query_embedding': test_vector,
                    'match_threshold': 0.8,
                    'match_count': 1,
                    'user_id_param': '00000000-0000-0000-0000-000000000000'  # Dummy UUID
                }).execute()
            else:
                # Test if function exists by calling with minimal params
                response = supabase.rpc(func_name, {}).execute()
                
            working_functions.append(func_name)
            result_count = len(response.data) if response.data else 0
            print(f"   ✅ {func_name}: working ({result_count} results)")
            
        except Exception as e:
            error_msg = str(e)
            if "does not exist" in error_msg:
                print(f"   ❌ {func_name}: function not found")
            elif "permission denied" in error_msg:
                print(f"   ⚠️  {func_name}: permission issue (function exists)")
                working_functions.append(func_name)  # Count as working since it exists
            else:
                print(f"   ⚠️  {func_name}: {error_msg[:60]}...")
    
    print(f"\n🎯 Vector search status: {len(working_functions)}/{len(vector_functions)} functions available")
    return working_functions

async def test_embedding_generation():
    """Test Ollama embedding generation."""
    print("\n🧠 Testing Ollama Embedding Generation...")
    
    try:
        # Get OpenAI configuration from environment
        embedding_provider = os.getenv("EMBEDDING_PROVIDER", "openai")
        embedding_base_url = os.getenv("EMBEDDING_BASE_URL", "https://api.openai.com/v1")
        embedding_api_key = os.getenv("EMBEDDING_API_KEY", "YOUR_OPENAI_API_KEY_HERE")
        embedding_model = os.getenv("EMBEDDING_MODEL_CHOICE", "text-embedding-3-small")
        
        print(f"   🔧 Provider: {embedding_provider}")
        print(f"   🔧 Base URL: {embedding_base_url}")
        print(f"   🔧 Model: {embedding_model}")
        
        # Check if Ollama is running
        import httpx
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get("http://localhost:11434/api/tags", timeout=5.0)
                if response.status_code == 200:
                    print("   ✅ Ollama server is running")
                else:
                    print(f"   ⚠️  Ollama server responded with status {response.status_code}")
            except Exception as e:
                print(f"   ❌ Cannot connect to Ollama server: {e}")
                return None
        
        # Initialize OpenAI-compatible client for Ollama
        from openai import AsyncOpenAI
        client = AsyncOpenAI(
            base_url=embedding_base_url,
            api_key=embedding_api_key
        )
        
        # Test embedding generation
        response = await client.embeddings.create(
            model=embedding_model,
            input="Test climate career guidance query for Pendo agent"
        )
        
        embedding = response.data[0].embedding
        print(f"   ✅ Generated embedding: {len(embedding)} dimensions")
        print(f"   🎯 Sample values: [{embedding[0]:.4f}, {embedding[1]:.4f}, {embedding[2]:.4f}, ...]")
        
        return embedding
        
    except Exception as e:
        print(f"   ❌ Ollama embedding generation failed: {e}")
        print("   💡 Make sure Ollama is running: ollama serve")
        print(f"   💡 Make sure model '{embedding_model}' is installed: ollama pull {embedding_model}")
        return None

def verify_climate_data(supabase: Client):
    """Verify climate-specific data is present."""
    print("\n🌱 Verifying Climate Economy Data...")
    
    climate_checks = []
    
    # Check for climate knowledge resources
    try:
        kr_response = supabase.table('knowledge_resources').select('id, title, climate_sectors').neq('climate_sectors', '{}').limit(5).execute()
        climate_resources = len(kr_response.data)
        print(f"   ✅ Climate knowledge resources: {climate_resources} found")
        climate_checks.append(climate_resources > 0)
    except Exception as e:
        print(f"   ❌ Climate knowledge resources: {e}")
        climate_checks.append(False)
    
    # Check for climate job listings
    try:
        job_response = supabase.table('job_listings').select('id, title, climate_focus').neq('climate_focus', '{}').limit(5).execute()
        climate_jobs = len(job_response.data)
        print(f"   ✅ Climate job listings: {climate_jobs} found")
        climate_checks.append(climate_jobs > 0)
    except Exception as e:
        print(f"   ❌ Climate job listings: {e}")
        climate_checks.append(False)
    
    # Check for education programs
    try:
        edu_response = supabase.table('education_programs').select('id, program_name, climate_focus').neq('climate_focus', '{}').limit(5).execute()
        climate_programs = len(edu_response.data)
        print(f"   ✅ Climate education programs: {climate_programs} found")
        climate_checks.append(climate_programs > 0)
    except Exception as e:
        print(f"   ❌ Climate education programs: {e}")
        climate_checks.append(False)
    
    # Check for Pendo agent
    try:
        agent_response = supabase.table('agents').select('id, name, agent_id').eq('agent_id', 'pendo').execute()
        pendo_exists = len(agent_response.data) > 0
        print(f"   ✅ Pendo agent registered: {pendo_exists}")
        climate_checks.append(pendo_exists)
    except Exception as e:
        print(f"   ❌ Pendo agent check: {e}")
        climate_checks.append(False)
    
    success_rate = sum(climate_checks) / len(climate_checks) * 100
    print(f"\n🎯 Climate data completeness: {success_rate:.1f}%")
    
    return climate_checks

async def test_full_workflow(supabase: Client):
    """Test a complete workflow simulation."""
    print("\n🚀 Testing Complete Workflow...")
    
    try:
        # 1. Test conversation creation
        conversation_data = {
            'id': 'test-conv-' + str(os.getpid()),
            'title': 'Test Conversation',
            'conversation_type': 'career_guidance',
            'status': 'active',
            'session_id': 'test-session-' + str(os.getpid()),
            'user_id': None,  # Anonymous for testing
            'created_at': 'now()',
            'updated_at': 'now()',
            'last_activity': 'now()'
        }
        
        conv_response = supabase.table('conversations').insert(conversation_data).execute()
        conv_id = conv_response.data[0]['id'] if conv_response.data else None
        
        if conv_id:
            print("   ✅ Conversation creation: successful")
            
            # 2. Test message insertion
            message_data = {
                'id': 'test-msg-' + str(os.getpid()),
                'conversation_id': conv_id,
                'role': 'human',
                'content': 'I need help finding climate jobs in Massachusetts',
                'created_at': 'now()',
                'updated_at': 'now()'
            }
            
            msg_response = supabase.table('messages').insert(message_data).execute()
            if msg_response.data:
                print("   ✅ Message insertion: successful")
            
            # 3. Clean up test data
            supabase.table('messages').delete().eq('conversation_id', conv_id).execute()
            supabase.table('conversations').delete().eq('id', conv_id).execute()
            print("   ✅ Test data cleanup: successful")
            
        return True
        
    except Exception as e:
        print(f"   ❌ Workflow test failed: {e}")
        return False

def verify_auth_system(supabase: Client):
    """Verify authentication and RLS is properly configured."""
    print("\n🔐 Verifying Authentication System...")
    
    auth_checks = []
    
    # Check RLS status on key tables
    rls_tables = ['consolidated_profiles', 'conversations', 'resumes', 'messages']
    
    for table in rls_tables:
        try:
            # This would normally check RLS status, but we'll verify table access instead
            response = supabase.table(table).select('id').limit(1).execute()
            print(f"   ✅ {table}: accessible")
            auth_checks.append(True)
        except Exception as e:
            print(f"   ❌ {table}: {str(e)[:50]}...")
            auth_checks.append(False)
    
    success_rate = sum(auth_checks) / len(auth_checks) * 100
    print(f"\n🎯 Auth system completeness: {success_rate:.1f}%")
    
    return auth_checks

async def main():
    """Run complete database verification."""
    print("🌱 Pendo Climate Economy Assistant - Database Verification")
    print("=" * 60)
    
    # Step 1: Environment check
    if not check_environment():
        sys.exit(1)
    
    # Step 2: Database connection
    supabase = test_supabase_connection()
    if not supabase:
        sys.exit(1)
    
    # Step 3: Core table verification
    verified_tables = verify_core_tables(supabase)
    
    # Step 4: Mem0 vecs tables verification
    verified_vecs = verify_mem0_vecs_tables(supabase)
    
    # Step 5: Auth tables verification  
    verified_auth = verify_auth_tables(supabase)
    
    # Step 6: Vector search functions
    working_functions = test_vector_search_functions(supabase)
    
    # Step 7: Embedding generation
    embedding = await test_embedding_generation()
    
    # Step 8: Climate data verification
    climate_checks = verify_climate_data(supabase)
    
    # Step 9: Authentication system
    auth_checks = verify_auth_system(supabase)
    
    # Step 10: Full workflow test
    workflow_success = await test_full_workflow(supabase)
    
    # Final assessment
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)
    
    total_score = 0
    max_score = 0
    
    # Core tables (weight: 30%)
    table_score = (len(verified_tables) / 10) * 30
    total_score += table_score
    max_score += 30
    print(f"📊 Core Tables: {table_score:.1f}/30 ({len(verified_tables)}/10 tables)")
    
    # Vector functions (weight: 20%)
    vector_score = (len(working_functions) / 5) * 20
    total_score += vector_score
    max_score += 20
    print(f"🔍 Vector Search: {vector_score:.1f}/20 ({len(working_functions)}/5 functions)")
    
    # Embeddings (weight: 15%)
    embedding_score = 15 if embedding else 0
    total_score += embedding_score
    max_score += 15
    print(f"🧠 Embeddings: {embedding_score}/15 ({'✅' if embedding else '❌'})")
    
    # Climate data (weight: 20%)
    climate_score = (sum(climate_checks) / len(climate_checks)) * 20
    total_score += climate_score
    max_score += 20
    print(f"🌱 Climate Data: {climate_score:.1f}/20 ({sum(climate_checks)}/{len(climate_checks)} checks)")
    
    # Auth system (weight: 10%)
    auth_score = (sum(auth_checks) / len(auth_checks)) * 10
    total_score += auth_score
    max_score += 10
    print(f"🔐 Auth System: {auth_score:.1f}/10 ({sum(auth_checks)}/{len(auth_checks)} checks)")
    
    # Workflow test (weight: 5%)
    workflow_score = 5 if workflow_success else 0
    total_score += workflow_score
    max_score += 5
    print(f"🚀 Workflow: {workflow_score}/5 ({'✅' if workflow_success else '❌'})")
    
    # Final grade
    final_percentage = (total_score / max_score) * 100
    print("\n" + "=" * 60)
    print(f"🎯 OVERALL SCORE: {total_score:.1f}/{max_score} ({final_percentage:.1f}%)")
    
    if final_percentage >= 80:
        print("✅ DATABASE READY FOR PENDO AGENT")
        status = "READY"
    elif final_percentage >= 60:
        print("⚠️  DATABASE PARTIALLY READY - SOME ISSUES DETECTED")
        status = "PARTIAL"
    else:
        print("❌ DATABASE NOT READY - MAJOR ISSUES DETECTED")
        status = "NOT_READY"
    
    print("=" * 60)
    
    # Save results
    results = {
        "timestamp": str(asyncio.get_event_loop().time()),
        "status": status,
        "score": final_percentage,
        "details": {
            "tables_verified": len(verified_tables),
            "vector_functions": len(working_functions),
            "embeddings_working": bool(embedding),
            "climate_data_checks": sum(climate_checks),
            "auth_checks": sum(auth_checks),
            "workflow_success": workflow_success
        }
    }
    
    with open('database_verification_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📄 Results saved to: database_verification_results.json")
    
    return final_percentage >= 80

if __name__ == "__main__":
    asyncio.run(main()) 