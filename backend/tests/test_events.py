import pytest
from unittest.mock import Mock
from datetime import datetime, timedelta


class TestEvents:
    """Tests for events endpoints"""

    def test_get_all_events(self, client, mock_supabase):
        """Test getting all events"""
        mock_data = [
            {
                "event_id": 1,
                "start_time": "2024-01-15T10:00:00+00:00",
                "end_time": "2024-01-15T12:00:00+00:00"
            },
            {
                "event_id": 2,
                "start_time": "2024-01-16T14:00:00+00:00",
                "end_time": "2024-01-16T16:00:00+00:00"
            }
        ]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/events")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["event_id"] == 1

    def test_get_event_with_registrations(self, client, mock_supabase):
        """Test getting a specific event with registrations"""
        event_data = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T12:00:00+00:00"
        }]

        reg_data = [
            {
                "registration_id": 1,
                "user_id": 1,
                "event_id": 1,
                "users": {"user_id": 1, "first_name": "John"}
            }
        ]

        event_mock = Mock()
        event_mock.data = event_data

        reg_mock = Mock()
        reg_mock.data = reg_data

        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "events":
                mock_table.select.return_value.eq.return_value.execute.return_value = event_mock
            elif table_name == "event_registration":
                mock_table.select.return_value.eq.return_value.execute.return_value = reg_mock
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.get("/api/v1/events/1")

        assert response.status_code == 200
        data = response.json()
        assert data["event_id"] == 1
        assert data["total_registrations"] == 1
        assert len(data["registrations"]) == 1

    def test_get_event_not_found(self, client, mock_supabase):
        """Test getting non-existent event"""
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/events/999")

        assert response.status_code == 404
        assert "Event not found" in response.json()["detail"]

    def test_create_event(self, client, mock_supabase):
        """Test creating a new event"""
        start_time = datetime.now()
        end_time = start_time + timedelta(hours=2)

        mock_data = [{
            "event_id": 1,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat()
        }]

        mock_insert = Mock()
        mock_insert.data = mock_data

        mock_table = Mock()
        mock_table.insert.return_value.execute.return_value = mock_insert
        mock_supabase.table.return_value = mock_table

        response = client.post(
            "/api/v1/events",
            json={
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            }
        )

        assert response.status_code == 201
        data = response.json()
        assert data["event_id"] == 1

    def test_create_event_invalid_times(self, client, mock_supabase):
        """Test creating event with end time before start time"""
        start_time = datetime.now()
        end_time = start_time - timedelta(hours=1)  # End before start

        response = client.post(
            "/api/v1/events",
            json={
                "start_time": start_time.isoformat(),
                "end_time": end_time.isoformat()
            }
        )

        assert response.status_code == 400
        assert "after start time" in response.json()["detail"]

    def test_update_event(self, client, mock_supabase):
        """Test updating an event"""
        current_event = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T12:00:00+00:00"
        }]

        updated_event = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T14:00:00+00:00"
        }]

        select_mock = Mock()
        select_mock.data = current_event

        update_mock = Mock()
        update_mock.data = updated_event

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = select_mock
        mock_table.update.return_value.eq.return_value.execute.return_value = update_mock

        mock_supabase.table.return_value = mock_table

        response = client.put(
            "/api/v1/events/1",
            json={"end_time": "2024-01-15T14:00:00+00:00"}
        )

        assert response.status_code == 200

    def test_delete_event(self, client, mock_supabase):
        """Test deleting an event"""
        event_data = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T12:00:00+00:00"
        }]

        select_mock = Mock()
        select_mock.data = event_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = select_mock
        mock_table.delete.return_value.eq.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/events/1")

        assert response.status_code == 204

    def test_delete_event_not_found(self, client, mock_supabase):
        """Test deleting non-existent event"""
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/events/999")

        assert response.status_code == 404
        assert "Event not found" in response.json()["detail"]
