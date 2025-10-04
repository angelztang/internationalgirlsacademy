"""
Simple integration tests for the user registration API
Using the simple_user_api.py (all-in-one version) for easier testing
"""

import pytest
import requests
import time
import subprocess
import os
from pathlib import Path

# Configuration
API_BASE_URL = "http://localhost:8002"  # Different port to avoid conflicts
BACKEND_DIR = Path(__file__).parent.parent


class TestUserRegistrationIntegration:
    """Integration tests for user registration API"""

    @pytest.fixture(scope="class", autouse=True)
    def start_server(self):
        """Start the API server for testing"""
        # Change to backend directory
        os.chdir(BACKEND_DIR)
        
        # Start server in background
        self.server_process = subprocess.Popen([
            str(BACKEND_DIR / ".venv" / "bin" / "python"),
            "-c",
            f"""
import uvicorn
import sys
sys.path.insert(0, '{BACKEND_DIR / 'src'}')
from simple_user_api import app
uvicorn.run(app, host='127.0.0.1', port=8002, log_level='error')
"""
        ])
        
        # Wait for server to start
        time.sleep(2)
        
        # Check if server is running
        try:
            response = requests.get(f"{API_BASE_URL}/health", timeout=5)
            if response.status_code != 200:
                pytest.skip("Server failed to start")
        except requests.exceptions.RequestException:
            pytest.skip("Server not reachable")
        
        yield
        
        # Cleanup
        if hasattr(self, 'server_process'):
            self.server_process.terminate()
            self.server_process.wait()

    def test_health_check(self):
        """Test health check endpoint"""
        response = requests.get(f"{API_BASE_URL}/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_register_user_success(self):
        """Test successful user registration"""
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe.test@example.com",
            "password": "securepass123",
            "user_type": "student",
            "gender": "male"
        }
        
        response = requests.post(f"{API_BASE_URL}/users/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Check response structure
        assert "id" in data
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["email"] == "john.doe.test@example.com"
        assert data["user_type"] == "student"
        assert data["gender"] == "male"
        assert data["experience_points"] == 0
        
        # Ensure password is not in response
        assert "password" not in data

    def test_register_user_duplicate_email(self):
        """Test registration with duplicate email"""
        user_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "duplicate.test@example.com",
            "password": "password123",
            "user_type": "student"
        }
        
        # Register first user
        response1 = requests.post(f"{API_BASE_URL}/users/register", json=user_data)
        assert response1.status_code == 201
        
        # Try to register with same email
        response2 = requests.post(f"{API_BASE_URL}/users/register", json=user_data)
        assert response2.status_code == 400
        assert "already exists" in response2.json()["detail"].lower()

    def test_register_user_validation_error(self):
        """Test registration with missing required fields"""
        incomplete_data = {
            "first_name": "John",
            "email": "incomplete.test@example.com"
            # Missing required fields
        }
        
        response = requests.post(f"{API_BASE_URL}/users/register", json=incomplete_data)
        assert response.status_code == 422  # Validation error

    def test_register_multiple_users(self):
        """Test registering multiple users"""
        users = [
            {
                "first_name": "Alice",
                "last_name": "Johnson", 
                "email": "alice.test@example.com",
                "password": "password1",
                "user_type": "student"
            },
            {
                "first_name": "Bob",
                "last_name": "Wilson",
                "email": "bob.test@example.com", 
                "password": "password2",
                "user_type": "instructor"
            }
        ]
        
        for user_data in users:
            response = requests.post(f"{API_BASE_URL}/users/register", json=user_data)
            assert response.status_code == 201
            
            data = response.json()
            assert data["email"] == user_data["email"]
            assert data["user_type"] == user_data["user_type"]

    def test_user_count_increases(self):
        """Test that user count increases after registration"""
        # Get initial count
        response1 = requests.get(f"{API_BASE_URL}/users/count")
        assert response1.status_code == 200
        initial_count = response1.json()["total_users"]
        
        # Register a new user
        user_data = {
            "first_name": "Counter",
            "last_name": "Test",
            "email": "counter.test@example.com",
            "password": "password123",
            "user_type": "student"
        }
        
        response2 = requests.post(f"{API_BASE_URL}/users/register", json=user_data)
        assert response2.status_code == 201
        
        # Check count increased
        response3 = requests.get(f"{API_BASE_URL}/users/count")
        assert response3.status_code == 200
        final_count = response3.json()["total_users"]
        
        assert final_count == initial_count + 1
