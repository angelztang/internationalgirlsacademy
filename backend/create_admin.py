#!/usr/bin/env python3
"""
Script to create the first admin user.
Run this once to set up your initial admin account.

Usage:
    uv run python create_admin.py
"""

import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def create_admin():
    print("🔧 Create Admin User")
    print("=" * 50)
    print()

    # Get user input
    email = input("Admin email: ").strip()
    password = input("Admin password (min 6 characters): ").strip()
    first_name = input("First name: ").strip()
    last_name = input("Last name: ").strip()

    if not email or not password or not first_name or not last_name:
        print("❌ All fields are required")
        return

    if len(password) < 6:
        print("❌ Password must be at least 6 characters")
        return

    print()
    print(f"Creating admin user: {first_name} {last_name} ({email})")
    confirm = input("Continue? (y/N): ").strip().lower()

    if confirm != 'y':
        print("Cancelled.")
        return

    try:
        # Register user with Supabase Auth
        print("Creating user in Supabase Auth...")
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "first_name": first_name,
                    "last_name": last_name,
                    "user_type": "admin"
                }
            }
        })

        if not auth_response.user:
            print("❌ Failed to create user in Supabase Auth")
            return

        user_id = auth_response.user.id
        print(f"✓ User created in Supabase Auth (ID: {user_id})")

        # Insert user profile into users table
        print("Creating user profile in database...")
        user_data = {
            "user_id": user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "user_type": "admin",
            "gender": None,
            "experience_points": 0
        }

        supabase.table("users").insert(user_data).execute()
        print("✓ User profile created")

        print()
        print("✅ Admin user created successfully!")
        print(f"   Email: {email}")
        print(f"   Name: {first_name} {last_name}")
        print(f"   Role: admin")
        print()
        print("You can now login at http://localhost:3000/login")

    except Exception as e:
        print(f"❌ Error: {e}")
        if "User already registered" in str(e):
            print("This email is already registered. Try a different email.")

if __name__ == "__main__":
    create_admin()
