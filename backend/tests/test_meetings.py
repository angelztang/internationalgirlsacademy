import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime


class TestScheduleMeeting:
    """Tests for schedule_meeting endpoint"""

    def test_schedule_meeting_success(self, client, mock_supabase, sample_availability_data):
        """Test successful meeting scheduling"""
        # Setup mock responses
        mock_select = Mock()
        mock_select.data = sample_availability_data

        mock_table = Mock()
        mock_table.select.return_value.neq.return_value.execute.return_value = mock_select
        mock_table.delete.return_value.eq.return_value.execute.return_value = Mock()
        mock_table.insert.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        # Make request
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": 1, "duration_minutes": 30}
        )

        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert "matched_user" in data
        assert "scheduled_slot" in data
        assert data["matched_user"]["id"] == 2
        assert data["matched_user"]["first_name"] == "Jane"
        assert data["message"] == "Meeting scheduled successfully for 30 minutes"

    def test_schedule_meeting_no_available_users(self, client, mock_supabase):
        """Test when no users have availability"""
        # Setup empty mock response
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.neq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        # Make request
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": 1, "duration_minutes": 30}
        )

        # Assertions
        assert response.status_code == 404
        assert "No available users found" in response.json()["detail"]

    def test_schedule_meeting_slot_too_short(self, client, mock_supabase, sample_availability_data):
        """Test when available slots are too short for requested duration"""
        # Setup mock with only short slots
        short_slot_data = [sample_availability_data[1]]  # 30-minute slot

        mock_select = Mock()
        mock_select.data = short_slot_data

        mock_table = Mock()
        mock_table.select.return_value.neq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        # Request 60 minutes (more than available)
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": 1, "duration_minutes": 60}
        )

        # Assertions
        assert response.status_code == 404
        assert "can accommodate 60 minutes" in response.json()["detail"]

    def test_schedule_meeting_splits_availability(self, client, mock_supabase, sample_availability_data):
        """Test that availability is split when meeting doesn't use entire slot"""
        # Setup mocks
        mock_select = Mock()
        mock_select.data = sample_availability_data

        mock_delete = Mock()
        mock_insert = Mock()

        mock_table = Mock()
        mock_table.select.return_value.neq.return_value.execute.return_value = mock_select
        mock_table.delete.return_value.eq.return_value.execute.return_value = mock_delete
        mock_table.insert.return_value.execute.return_value = mock_insert

        mock_supabase.table.return_value = mock_table

        # Request 30 minutes from 2-hour slot
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": 1, "duration_minutes": 30}
        )

        # Verify delete was called on original slot
        mock_table.delete.assert_called_once()
        mock_table.delete.return_value.eq.assert_called_once_with("id", 1)

        # Verify insert was called to create remaining slot
        mock_table.insert.assert_called_once()
        insert_args = mock_table.insert.call_args[0][0]
        assert insert_args["user_id"] == 2
        assert "time_start" in insert_args
        assert "time_end" in insert_args

    def test_schedule_meeting_exact_slot_match(self, client, mock_supabase, sample_availability_data):
        """Test when meeting duration exactly matches availability slot"""
        # Setup mock with exact match
        exact_slot_data = [sample_availability_data[1]]  # 30-minute slot

        mock_select = Mock()
        mock_select.data = exact_slot_data

        mock_delete = Mock()
        mock_table = Mock()
        mock_table.select.return_value.neq.return_value.execute.return_value = mock_select
        mock_table.delete.return_value.eq.return_value.execute.return_value = mock_delete
        mock_table.insert.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        # Request exactly 30 minutes
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": 1, "duration_minutes": 30}
        )

        # Should delete slot but NOT insert new one
        assert response.status_code == 200
        mock_table.delete.assert_called_once()
        # Insert should not be called since no remaining time
        mock_table.insert.assert_not_called()

    def test_schedule_meeting_invalid_request(self, client, mock_supabase):
        """Test with invalid request data"""
        response = client.post(
            "/api/v1/meetings/schedule",
            json={"user_id": "invalid", "duration_minutes": -10}
        )

        assert response.status_code == 422  # Validation error
