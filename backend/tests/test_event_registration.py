import pytest
from unittest.mock import Mock


class TestEventRegistration:
    """Tests for event registration endpoints"""

    def test_get_user_events(self, client, mock_supabase):
        """Test getting all events a user is registered for"""
        mock_data = [
            {
                "registration_id": 1,
                "user_id": 1,
                "event_id": 1,
                "events": {
                    "event_id": 1,
                    "start_time": "2024-01-15T10:00:00+00:00",
                    "end_time": "2024-01-15T12:00:00+00:00"
                }
            }
        ]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/users/1/events")

        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == 1
        assert len(data["events"]) == 1
        assert data["events"][0]["event_id"] == 1

    def test_register_for_event_success(self, client, mock_supabase):
        """Test successful event registration"""
        event_data = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T12:00:00+00:00"
        }]

        user_data = [{"user_id": 1}]

        existing_reg_data = []

        reg_response = [{
            "registration_id": 1,
            "user_id": 1,
            "event_id": 1
        }]

        event_mock = Mock()
        event_mock.data = event_data

        user_mock = Mock()
        user_mock.data = user_data

        existing_mock = Mock()
        existing_mock.data = existing_reg_data

        insert_mock = Mock()
        insert_mock.data = reg_response

        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "events":
                mock_table.select.return_value.eq.return_value.execute.return_value = event_mock
            elif table_name == "users":
                mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
            elif table_name == "event_registration":
                mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = existing_mock
                mock_table.insert.return_value.execute.return_value = insert_mock
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/api/v1/users/events/1/register",
            json={"user_id": 1}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == 1
        assert data["event_id"] == 1

    def test_register_for_event_already_registered(self, client, mock_supabase):
        """Test registering when already registered"""
        event_data = [{
            "event_id": 1,
            "start_time": "2024-01-15T10:00:00+00:00",
            "end_time": "2024-01-15T12:00:00+00:00"
        }]

        user_data = [{"user_id": 1}]

        existing_reg_data = [{
            "registration_id": 1,
            "user_id": 1,
            "event_id": 1
        }]

        event_mock = Mock()
        event_mock.data = event_data

        user_mock = Mock()
        user_mock.data = user_data

        existing_mock = Mock()
        existing_mock.data = existing_reg_data

        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "events":
                mock_table.select.return_value.eq.return_value.execute.return_value = event_mock
            elif table_name == "users":
                mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
            elif table_name == "event_registration":
                mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = existing_mock
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/api/v1/users/events/1/register",
            json={"user_id": 1}
        )

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"]

    def test_register_for_event_not_found(self, client, mock_supabase):
        """Test registering for non-existent event"""
        event_mock = Mock()
        event_mock.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = event_mock
        mock_supabase.table.return_value = mock_table

        response = client.post(
            "/api/v1/users/events/999/register",
            json={"user_id": 1}
        )

        assert response.status_code == 404
        assert "Event not found" in response.json()["detail"]

    def test_unregister_from_event(self, client, mock_supabase):
        """Test unregistering from an event"""
        reg_data = [{
            "registration_id": 1,
            "user_id": 1,
            "event_id": 1
        }]

        select_mock = Mock()
        select_mock.data = reg_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = select_mock
        mock_table.delete.return_value.eq.return_value.eq.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/users/events/1/register/1")

        assert response.status_code == 204

    def test_unregister_from_event_not_registered(self, client, mock_supabase):
        """Test unregistering when not registered"""
        select_mock = Mock()
        select_mock.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = select_mock
        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/users/events/1/register/1")

        assert response.status_code == 404
        assert "Registration not found" in response.json()["detail"]

    def test_get_event_registrations(self, client, mock_supabase):
        """Test getting all registrations for an event"""
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
            },
            {
                "registration_id": 2,
                "user_id": 2,
                "event_id": 1,
                "users": {"user_id": 2, "first_name": "Jane"}
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

        response = client.get("/api/v1/users/events/1/registrations")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["user_id"] == 1
        assert data[1]["user_id"] == 2
