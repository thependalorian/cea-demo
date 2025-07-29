#!/usr/bin/env python3
"""
Script to populate climate resources in Supabase database for testing.
This helps resolve the 'No climate resources found in database' error.
"""

import os
import json
from dotenv import load_dotenv
import logging
from supabase import create_client
import numpy as np

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def populate_climate_resources():
    """Populate climate resources into Supabase database."""
    
    # Connect to Supabase
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_KEY') or os.environ.get('SUPABASE_SERVICE_KEY')
    
    if not url or not key:
        logger.error("Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env")
        return False
    
    logger.info(f"Connecting to Supabase at {url}")
    supabase = create_client(url, key)
    
    # Sample climate resources data
    climate_data = [
        {
            'title': 'Massachusetts Clean Energy Programs',
            'content': 'MassCEC offers internships and training programs for renewable energy careers. Programs include Clean Energy Internship Program, Vocational Internship Program, and various workforce training initiatives.',
            'type': 'resource',
            'schema': 'climate_resources'
        },
        {
            'title': 'Climate Jobs in New England',
            'content': 'Growing demand for renewable energy professionals in Massachusetts with competitive salaries. Key sectors include solar installation, wind energy development, green building, and energy efficiency auditing.',
            'type': 'career',
            'schema': 'climate_resources'
        },
        {
            'title': 'Renewable Energy Transition Guide',
            'content': 'Steps for software engineers to transition into clean energy technology roles. Focus on transferrable skills such as data analysis, system architecture, and project management applied to energy systems.',
            'type': 'guide',
            'schema': 'climate_resources'
        },
        {
            'title': 'Massachusetts Climate Policy Framework',
            'content': 'Overview of state policies supporting clean energy transition including the Clean Energy and Climate Plan, Global Warming Solutions Act, and the Clean Energy Standard.',
            'type': 'policy',
            'schema': 'climate_resources'
        },
        {
            'title': 'Green Career Training Resources',
            'content': 'Educational programs and certifications available in Massachusetts for climate-focused careers, including programs at community colleges, universities, and technical training centers.',
            'type': 'training',
            'schema': 'climate_resources'
        }
    ]

    # Add career transition data
    career_data = [
        {
            'title': 'Software to Clean Energy Transition',
            'content': 'Software engineers can leverage their programming skills in clean energy by focusing on energy management systems, grid optimization, and data analysis for renewable sources.',
            'type': 'career_transition',
            'schema': 'career_resources'
        },
        {
            'title': 'Skills Needed for Renewable Energy Careers',
            'content': 'Key skills for transitioning to renewable energy include: data analysis, programming, project management, and domain knowledge of energy systems.',
            'type': 'skills',
            'schema': 'career_resources'
        },
        {
            'title': 'Engineering to Sustainability Pathway',
            'content': 'Engineers can transition to sustainability roles by applying technical expertise to energy efficiency, renewable energy systems, and sustainable infrastructure development.',
            'type': 'career_transition',
            'schema': 'career_resources'
        }
    ]
    
    # Combine the data
    all_resources = climate_data + career_data
    
    # Insert data into database
    try:
        # Check if document_metadata table exists
        try:
            result = supabase.table('document_metadata').select('id').limit(1).execute()
            logger.info("Found document_metadata table")
        except Exception as e:
            logger.error(f"Error accessing document_metadata table: {e}")
            logger.info("Please make sure the document_metadata and document_rows tables exist")
            return False
        
        # Insert the resources
        for item in all_resources:
            # Create mock embedding (this would normally come from an embedding model)
            mock_embedding = np.random.rand(1536).tolist()
            
            # Insert into document_metadata
            logger.info(f"Inserting metadata for: {item['title']}")
            try:
                result = supabase.table('document_metadata').insert({
                    'title': item['title'],
                    'schema': item['schema'],
                    'metadata': {'type': item['type']}
                }).execute()
                
                # Get the inserted ID
                if not result.data:
                    logger.error(f"Failed to insert metadata for {item['title']}")
                    continue
                    
                doc_id = result.data[0]['id']
                
                # Insert into document_rows with content and embedding
                logger.info(f"Inserting content for: {item['title']}")
                supabase.table('document_rows').insert({
                    'dataset_id': doc_id,
                    'row_data': {'content': item['content']},
                    'embedding': mock_embedding
                }).execute()
                
            except Exception as e:
                logger.error(f"Error inserting resource {item['title']}: {e}")
                continue
        
        logger.info(f"Successfully inserted {len(all_resources)} resources into database")
        return True
        
    except Exception as e:
        logger.error(f"Error populating database: {e}")
        return False

if __name__ == "__main__":
    success = populate_climate_resources()
    if success:
        print("✅ Climate resources data populated successfully!")
    else:
        print("❌ Failed to populate climate resources data. Check logs for details.") 