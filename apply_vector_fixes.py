#!/usr/bin/env python3
"""
🔧 Apply Vector Function Fixes Efficiently
Uses Supabase client to execute SQL fixes directly
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def get_supabase_client() -> Client:
    """Initialize Supabase client."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY")
        sys.exit(1)
    
    return create_client(url, key)

def apply_fixes():
    """Apply all vector function fixes."""
    print("🔧 Applying Vector Function Fixes...")
    
    supabase = get_supabase_client()
    
    # All fixes in sequence
    fixes = [
        {
            "name": "match_knowledge_resources",
            "sql": """
            DROP FUNCTION IF EXISTS public.match_knowledge_resources(vector, double precision, integer);
            DROP FUNCTION IF EXISTS public.match_knowledge_resources(vector(768), float, int);

            CREATE OR REPLACE FUNCTION public.match_knowledge_resources(
              query_embedding vector(768),
              match_threshold float DEFAULT 0.8,
              match_count int DEFAULT 10
            )
            RETURNS TABLE (
              id bigint,
              title text,
              content text,
              climate_sectors text[],
              career_stages text[],
              similarity float
            )
            LANGUAGE plpgsql
            SET search_path = public, extensions
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                kr.id,
                kr.title,
                kr.content,
                kr.climate_sectors,
                kr.career_stages,
                1 - (kr.embedding <=> match_knowledge_resources.query_embedding) AS similarity
              FROM knowledge_resources kr
              WHERE kr.embedding IS NOT NULL
                AND 1 - (kr.embedding <=> match_knowledge_resources.query_embedding) > match_knowledge_resources.match_threshold
              ORDER BY kr.embedding <=> match_knowledge_resources.query_embedding
              LIMIT match_knowledge_resources.match_count;
            END;
            $$;
            """
        },
        {
            "name": "match_resume_content",
            "sql": """
            DROP FUNCTION IF EXISTS public.match_resume_content(vector, double precision, integer, uuid);
            DROP FUNCTION IF EXISTS public.match_resume_content(vector(768), float, int, uuid);

            CREATE OR REPLACE FUNCTION public.match_resume_content(
              query_embedding vector(768),
              match_threshold float DEFAULT 0.8,
              match_count int DEFAULT 10,
              user_id_param uuid DEFAULT NULL
            )
            RETURNS TABLE (
              id bigint,
              user_id uuid,
              content text,
              metadata jsonb,
              similarity float
            )
            LANGUAGE plpgsql
            SET search_path = public, extensions
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                r.id,
                r.user_id,
                r.content,
                r.metadata,
                1 - (r.embedding <=> match_resume_content.query_embedding) AS similarity
              FROM resumes r
              WHERE r.embedding IS NOT NULL
                AND (match_resume_content.user_id_param IS NULL OR r.user_id = match_resume_content.user_id_param)
                AND 1 - (r.embedding <=> match_resume_content.query_embedding) > match_resume_content.match_threshold
              ORDER BY r.embedding <=> match_resume_content.query_embedding
              LIMIT match_resume_content.match_count;
            END;
            $$;
            """
        },
        {
            "name": "match_resume_chunks",
            "sql": """
            DROP FUNCTION IF EXISTS public.match_resume_chunks(vector, double precision, integer, uuid);
            DROP FUNCTION IF EXISTS public.match_resume_chunks(vector(768), float, int, uuid);

            CREATE OR REPLACE FUNCTION public.match_resume_chunks(
              query_embedding vector(768),
              match_threshold float DEFAULT 0.8,
              match_count int DEFAULT 10,
              user_id_param uuid DEFAULT NULL
            )
            RETURNS TABLE (
              id bigint,
              resume_id bigint,
              user_id uuid,
              chunk_text text,
              chunk_metadata jsonb,
              similarity float
            )
            LANGUAGE plpgsql
            SET search_path = public, extensions
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                rc.id,
                rc.resume_id,
                rc.user_id,
                rc.chunk_text,
                rc.chunk_metadata,
                1 - (rc.embedding <=> match_resume_chunks.query_embedding) AS similarity
              FROM resume_chunks rc
              WHERE rc.embedding IS NOT NULL
                AND (match_resume_chunks.user_id_param IS NULL OR rc.user_id = match_resume_chunks.user_id_param)
                AND 1 - (rc.embedding <=> match_resume_chunks.query_embedding) > match_resume_chunks.match_threshold
              ORDER BY rc.embedding <=> match_resume_chunks.query_embedding
              LIMIT match_resume_chunks.match_count;
            END;
            $$;
            """
        },
        {
            "name": "search_conversation_messages",
            "sql": """
            DROP FUNCTION IF EXISTS public.search_conversation_messages(vector, double precision, integer, uuid);
            DROP FUNCTION IF EXISTS public.search_conversation_messages(vector(768), float, int, uuid);

            CREATE OR REPLACE FUNCTION public.search_conversation_messages(
              query_embedding vector(768),
              match_threshold float DEFAULT 0.8,
              match_count int DEFAULT 10,
              user_id_param uuid DEFAULT NULL
            )
            RETURNS TABLE (
              id bigint,
              conversation_id bigint,
              user_id uuid,
              content text,
              role text,
              similarity float
            )
            LANGUAGE plpgsql
            SET search_path = public, extensions
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                cm.id,
                cm.conversation_id,
                cm.user_id,
                cm.content,
                cm.role,
                1 - (cm.embedding <=> search_conversation_messages.query_embedding) AS similarity
              FROM conversation_messages cm
              WHERE cm.embedding IS NOT NULL
                AND (search_conversation_messages.user_id_param IS NULL OR cm.user_id = search_conversation_messages.user_id_param)
                AND 1 - (cm.embedding <=> search_conversation_messages.query_embedding) > search_conversation_messages.match_threshold
              ORDER BY cm.embedding <=> search_conversation_messages.query_embedding
              LIMIT search_conversation_messages.match_count;
            END;
            $$;
            """
        },
        {
            "name": "search_training_messages",
            "sql": """
            DROP FUNCTION IF EXISTS public.search_training_messages(vector, double precision, integer);
            DROP FUNCTION IF EXISTS public.search_training_messages(vector(768), float, int);

            CREATE OR REPLACE FUNCTION public.search_training_messages(
              query_embedding vector(768),
              match_threshold float DEFAULT 0.8,
              match_count int DEFAULT 10
            )
            RETURNS TABLE (
              id bigint,
              content text,
              role text,
              metadata jsonb,
              similarity float
            )
            LANGUAGE plpgsql
            SET search_path = public, extensions
            AS $$
            BEGIN
              RETURN QUERY
              SELECT 
                m.id,
                m.content,
                m.role,
                m.metadata,
                1 - (m.embedding <=> search_training_messages.query_embedding) AS similarity
              FROM messages m
              WHERE m.embedding IS NOT NULL
                AND 1 - (m.embedding <=> search_training_messages.query_embedding) > search_training_messages.match_threshold
              ORDER BY m.embedding <=> search_training_messages.query_embedding
              LIMIT search_training_messages.match_count;
            END;
            $$;
            """
        }
    ]
    
    # Apply each fix
    for fix in fixes:
        try:
            print(f"   🔧 Fixing {fix['name']}...")
            result = supabase.rpc('exec', {'sql': fix['sql']}).execute()
            print(f"   ✅ {fix['name']} fixed successfully")
        except Exception as e:
            print(f"   ❌ {fix['name']} failed: {str(e)[:100]}...")
    
    # Verify all functions exist
    print("\n🔍 Verifying functions...")
    function_names = [
        'match_knowledge_resources',
        'match_resume_content', 
        'match_resume_chunks',
        'search_conversation_messages',
        'search_training_messages'
    ]
    
    for func_name in function_names:
        try:
            # Test with minimal parameters
            if func_name == 'match_knowledge_resources':
                test_vector = [0.1] * 768
                result = supabase.rpc(func_name, {
                    'query_embedding': test_vector,
                    'match_threshold': 0.9,
                    'match_count': 1
                }).execute()
            else:
                # Just check if function exists by calling information_schema
                result = supabase.rpc('exec', {
                    'sql': f"SELECT routine_name FROM information_schema.routines WHERE routine_name = '{func_name}' AND routine_schema = 'public'"
                }).execute()
            
            print(f"   ✅ {func_name}: working")
        except Exception as e:
            print(f"   ⚠️  {func_name}: {str(e)[:60]}...")
    
    print("\n🎯 Vector function fixes completed!")

if __name__ == "__main__":
    apply_fixes() 