#!/usr/bin/env python3
"""
Simple test runner for the user registration API
This script starts the server and runs basic tests
"""

import requests
import json
import time
import subprocess
import os
from pathlib import Path

def start_server():
    """Start the simple API server"""
    backend_dir = Path(__file__).parent
    
    print("🚀 Starting API server...")
    process = subprocess.Popen([
        str(backend_dir / ".venv" / "bin" / "python"),
        str(backend_dir / "simple_user_api.py")
    ], 
    stdout=subprocess.PIPE, 
    stderr=subprocess.PIPE
    )
    
    # Wait a bit for server to start
    time.sleep(3)
    return process

def test_api():
    """Run API tests"""
    BASE_URL = "http://localhost:8000"
    
    print("🧪 Running API Tests...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("   ✅ Health check passed")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("   ❌ Could not connect to server")
        return False
    
    # Test 2: User Registration
    print("2️⃣ Testing User Registration...")
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": f"test.user.{int(time.time())}@example.com",  # Unique email
        "password": "testpassword123",
        "user_type": "student",
        "gender": "other"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register", json=user_data)
        if response.status_code == 201:
            data = response.json()
            print("   ✅ User registration passed")
            print(f"   📝 Created user: {data['first_name']} {data['last_name']} ({data['email']})")
            print(f"   🆔 User ID: {data['id']}")
            return data
        else:
            print(f"   ❌ User registration failed: {response.status_code}")
            print(f"   📄 Response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ User registration error: {e}")
        return False

def test_duplicate_registration(user_data):
    """Test duplicate email registration"""
    print("3️⃣ Testing Duplicate Email Prevention...")
    BASE_URL = "http://localhost:8000"
    
    try:
        response = requests.post(f"{BASE_URL}/users/register", json=user_data)
        if response.status_code == 400:
            print("   ✅ Duplicate prevention works")
            print(f"   📄 Error message: {response.json()['detail']}")
        else:
            print(f"   ❌ Should have prevented duplicate: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Duplicate test error: {e}")

def test_user_count():
    """Test user count endpoint"""
    print("4️⃣ Testing User Count...")
    BASE_URL = "http://localhost:8000"
    
    try:
        response = requests.get(f"{BASE_URL}/users/count")
        if response.status_code == 200:
            count = response.json()["total_users"]
            print(f"   ✅ User count works: {count} users registered")
        else:
            print(f"   ❌ User count failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ User count error: {e}")

def main():
    """Main test runner"""
    print("🎯 User Registration API Test Suite")
    print("=" * 50)
    
    # Start server
    server_process = None
    try:
        server_process = start_server()
        
        # Run tests
        user_data = test_api()
        if user_data:
            test_duplicate_registration(user_data)
        test_user_count()
        
        print("\n🎉 Test suite completed!")
        
    except KeyboardInterrupt:
        print("\n⏹️ Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
    finally:
        # Cleanup
        if server_process:
            print("\n🛑 Stopping server...")
            server_process.terminate()
            server_process.wait()

if __name__ == "__main__":
    main()
