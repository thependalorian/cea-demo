#!/usr/bin/env python3
"""
setup_pydantic_agent.py

This script copies the pydantic_agent directory from the project root to the pydantic-cea directory,
ensuring the enhanced agent has access to the required models.
"""

import os
import sys
import shutil
from pathlib import Path

def setup_pydantic_agent():
    """Copy pydantic_agent directory from project root to pydantic-cea directory"""
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    
    source_dir = project_root / "pydantic_agent"
    target_dir = script_dir / "pydantic_agent"
    
    if not source_dir.exists():
        print(f"Error: Source directory {source_dir} does not exist")
        sys.exit(1)
    
    # Remove target directory if it exists
    if target_dir.exists():
        print(f"Removing existing {target_dir}")
        try:
            # Check if it's a symlink
            if target_dir.is_symlink():
                os.unlink(target_dir)
                print("Removed symbolic link")
            else:
                shutil.rmtree(target_dir)
                print("Removed directory")
        except Exception as e:
            print(f"Error removing target: {e}")
            sys.exit(1)
    
    # Copy the directory
    print(f"Copying {source_dir} to {target_dir}")
    try:
        shutil.copytree(source_dir, target_dir)
    except Exception as e:
        print(f"Error copying directory: {e}")
        sys.exit(1)
    
    # Verify the copy worked
    if target_dir.exists():
        file_count = len(list(target_dir.glob("**/*")))
        print(f"Successfully copied pydantic_agent with {file_count} files")
    else:
        print("Error: Copy operation failed")
        sys.exit(1)

if __name__ == "__main__":
    setup_pydantic_agent() 