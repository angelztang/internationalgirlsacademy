import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock

from app.main import app
from app.core.database import get_supabase


@pytest.fixture
def mock_supabase():
    """Mock Supabase client"""
    mock_client = Mock()
    mock_table = Mock()
    mock_client.table.return_value = mock_table
    return mock_client


@pytest.fixture
def client(mock_supabase):
    """Test client with mocked Supabase dependency"""
    app.dependency_overrides[get_supabase] = lambda: mock_supabase
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_availability_data():
    """Sample availability data for testing"""
    return [
        {
            "availability_id": 1,
            "user_id": 2,
            "time_start": "2024-01-15T10:00:00+00:00",
            "time_end": "2024-01-15T12:00:00+00:00",
            "users": {
                "user_id": 2,
                "first_name": "Jane",
                "last_name": "Doe",
                "user_type": "mentor",
                "experience_points": 100.0,
                "gender": "female",
            },
        },
        {
            "availability_id": 2,
            "user_id": 3,
            "time_start": "2024-01-15T14:00:00+00:00",
            "time_end": "2024-01-15T14:30:00+00:00",
            "users": {
                "user_id": 3,
                "first_name": "John",
                "last_name": "Smith",
                "user_type": "mentee",
                "experience_points": 50.0,
                "gender": "male",
            },
        },
    ]
