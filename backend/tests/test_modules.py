import pytest
from unittest.mock import Mock


class TestModules:
    """Tests for modules endpoints"""

    def test_get_user_modules(self, client, mock_supabase):
        """Test getting all modules for a user"""
        mock_data = [
            {"module_id": 1, "user_id": 1, "module_progress": 50.0},
            {"module_id": 2, "user_id": 1, "module_progress": 75.5}
        ]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/modules/user/1")

        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == 1
        assert len(data["modules"]) == 2
        assert data["modules"][0]["module_progress"] == 50.0

    def test_get_module_by_id(self, client, mock_supabase):
        """Test getting a specific module"""
        mock_data = [{"module_id": 1, "user_id": 1, "module_progress": 50.0}]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/modules/1")

        assert response.status_code == 200
        data = response.json()
        assert data["module_id"] == 1
        assert data["module_progress"] == 50.0

    def test_get_module_not_found(self, client, mock_supabase):
        """Test getting non-existent module"""
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/modules/999")

        assert response.status_code == 404
        assert "Module not found" in response.json()["detail"]

    def test_create_module(self, client, mock_supabase):
        """Test creating a new module"""
        user_data = [{"user_id": 1}]
        user_mock = Mock()
        user_mock.data = user_data

        module_data = [{"module_id": 1, "user_id": 1, "module_progress": 0.0}]
        module_mock = Mock()
        module_mock.data = module_data

        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "users":
                mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
            elif table_name == "modules":
                mock_table.insert.return_value.execute.return_value = module_mock
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/api/v1/modules",
            json={"user_id": 1, "module_progress": 0.0}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == 1
        assert data["module_progress"] == 0.0

    def test_create_module_user_not_found(self, client, mock_supabase):
        """Test creating module for non-existent user"""
        user_mock = Mock()
        user_mock.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
        mock_supabase.table.return_value = mock_table

        response = client.post(
            "/api/v1/modules",
            json={"user_id": 999, "module_progress": 0.0}
        )

        assert response.status_code == 404
        assert "User not found" in response.json()["detail"]

    def test_update_module_progress(self, client, mock_supabase):
        """Test updating module progress"""
        module_check_data = [{"module_id": 1, "user_id": 1, "module_progress": 50.0}]
        check_mock = Mock()
        check_mock.data = module_check_data

        updated_data = [{"module_id": 1, "user_id": 1, "module_progress": 75.0}]
        update_mock = Mock()
        update_mock.data = updated_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = check_mock
        mock_table.update.return_value.eq.return_value.execute.return_value = update_mock

        mock_supabase.table.return_value = mock_table

        response = client.put(
            "/api/v1/modules/1",
            json={"module_progress": 75.0}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["module_progress"] == 75.0

    def test_update_module_progress_invalid_range(self, client, mock_supabase):
        """Test updating with invalid progress value"""
        module_data = [{"module_id": 1, "user_id": 1, "module_progress": 50.0}]
        mock_select = Mock()
        mock_select.data = module_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.put(
            "/api/v1/modules/1",
            json={"module_progress": 150.0}
        )

        assert response.status_code == 400
        assert "must be between 0 and 100" in response.json()["detail"]

    def test_delete_module(self, client, mock_supabase):
        """Test deleting a module"""
        module_data = [{"module_id": 1, "user_id": 1, "module_progress": 50.0}]
        mock_select = Mock()
        mock_select.data = module_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_table.delete.return_value.eq.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/modules/1")

        assert response.status_code == 204

    def test_delete_module_not_found(self, client, mock_supabase):
        """Test deleting non-existent module"""
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.delete("/api/v1/modules/999")

        assert response.status_code == 404
        assert "Module not found" in response.json()["detail"]
