import pytest
import json
from fastapi.testclient import TestClient


class TestUserRegistration:
    """Test cases for user registration endpoint"""

    def test_register_user_success(self, client: TestClient):
        """Test successful user registration"""
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword123",
            "user_type": "student",
            "gender": "male"
        }
        
        response = client.post("/api/v1/users/register", json=user_data)
        
        assert response.status_code == 201
        data = response.json()
        
        # Check response structure
        assert "id" in data
        assert data["first_name"] == "John"
        assert data["last_name"] == "Doe"
        assert data["email"] == "john.doe@example.com"
        assert data["user_type"] == "student"
        assert data["gender"] == "male"
        assert data["experience_points"] == 0
        
        # Ensure password is not in response
        assert "password" not in data

    def test_register_user_duplicate_email(self, client: TestClient):
        """Test registration with duplicate email"""
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "duplicate@example.com",
            "password": "password123",
            "user_type": "student"
        }
        
        # Register first user
        response1 = client.post("/api/v1/users/register", json=user_data)
        assert response1.status_code == 201
        
        # Try to register with same email
        user_data2 = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "duplicate@example.com",  # Same email
            "password": "differentpassword",
            "user_type": "instructor"
        }
        
        response2 = client.post("/api/v1/users/register", json=user_data2)
        assert response2.status_code == 400
        assert "User with this email already exists" in response2.json()["detail"]

    def test_register_user_missing_required_fields(self, client: TestClient):
        """Test registration with missing required fields"""
        incomplete_data = {
            "first_name": "John",
            "email": "incomplete@example.com"
            # Missing last_name, password, user_type
        }
        
        response = client.post("/api/v1/users/register", json=incomplete_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_invalid_email_format(self, client: TestClient):
        """Test registration with invalid email format"""
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "invalid-email-format",  # Invalid email
            "password": "password123",
            "user_type": "student"
        }
        
        response = client.post("/api/v1/users/register", json=user_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_empty_password(self, client: TestClient):
        """Test registration with empty password"""
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "",  # Empty password
            "user_type": "student"
        }
        
        response = client.post("/api/v1/users/register", json=user_data)
        assert response.status_code == 422  # Validation error

    def test_register_user_optional_gender(self, client: TestClient):
        """Test registration without optional gender field"""
        user_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane@example.com",
            "password": "password123",
            "user_type": "instructor"
            # No gender field (should be optional)
        }
        
        response = client.post("/api/v1/users/register", json=user_data)
        assert response.status_code == 201
        
        data = response.json()
        assert data["gender"] is None

    def test_register_multiple_users_different_emails(self, client: TestClient):
        """Test registering multiple users with different emails"""
        users = [
            {
                "first_name": "Alice",
                "last_name": "Johnson",
                "email": "alice@example.com",
                "password": "password1",
                "user_type": "student"
            },
            {
                "first_name": "Bob",
                "last_name": "Wilson",
                "email": "bob@example.com",
                "password": "password2",
                "user_type": "instructor"
            },
            {
                "first_name": "Carol",
                "last_name": "Brown",
                "email": "carol@example.com",
                "password": "password3",
                "user_type": "admin"
            }
        ]
        
        user_ids = []
        for user_data in users:
            response = client.post("/api/v1/users/register", json=user_data)
            assert response.status_code == 201
            
            data = response.json()
            user_ids.append(data["id"])
            assert data["email"] == user_data["email"]
        
        # Ensure all users have unique IDs
        assert len(set(user_ids)) == len(users)

    def test_register_user_different_user_types(self, client: TestClient):
        """Test registration with different user types"""
        user_types = ["student", "instructor", "admin"]
        
        for i, user_type in enumerate(user_types):
            user_data = {
                "first_name": f"User{i}",
                "last_name": "Test",
                "email": f"user{i}@example.com",
                "password": "password123",
                "user_type": user_type
            }
            
            response = client.post("/api/v1/users/register", json=user_data)
            assert response.status_code == 201
            
            data = response.json()
            assert data["user_type"] == user_type

    def test_register_user_password_security(self, client: TestClient):
        """Test that passwords are properly hashed"""
        user_data = {
            "first_name": "Security",
            "last_name": "Test",
            "email": "security@example.com",
            "password": "plaintextpassword",
            "user_type": "student"
        }
        
        response = client.post("/api/v1/users/register", json=user_data)
        assert response.status_code == 201
        
        # Password should not appear in response
        response_text = response.text
        assert "plaintextpassword" not in response_text
        
        # Response should not contain the plain password
        data = response.json()
        assert "password" not in data


class TestHealthCheck:
    """Test cases for health check endpoint"""

    def test_health_check(self, client: TestClient):
        """Test health check endpoint"""
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestRootEndpoint:
    """Test cases for root endpoint"""

    def test_root_endpoint(self, client: TestClient):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "version" in data
