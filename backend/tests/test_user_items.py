import pytest
from unittest.mock import Mock


class TestUserItems:
    """Tests for user items endpoints"""

    def test_get_user_inventory(self, client, mock_supabase):
        """Test getting user's inventory"""
        mock_data = [
            {
                "user_id": 1,
                "item_id": 1,
                "quantity": 2,
                "acquired_at": "2024-01-15T10:00:00+00:00",
                "equipped": True,
                "items": {"item_id": 1, "name": "Sword", "cost": 100}
            }
        ]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/users/1/items")

        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["quantity"] == 2

    def test_purchase_item_success(self, client, mock_supabase):
        """Test successful item purchase"""
        # Mock item lookup
        item_data = [{"item_id": 1, "name": "Sword", "cost": 100}]
        item_mock = Mock()
        item_mock.data = item_data

        # Mock user lookup
        user_data = [{"experience_points": 500}]
        user_mock = Mock()
        user_mock.data = user_data

        # Mock existing items check (user doesn't have it yet)
        existing_mock = Mock()
        existing_mock.data = []

        # Setup table mock to return different results based on table name
        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "items":
                mock_table.select.return_value.eq.return_value.execute.return_value = item_mock
            elif table_name == "users":
                mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
                mock_table.update.return_value.eq.return_value.execute.return_value = Mock()
            elif table_name == "user_items":
                mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = existing_mock
                mock_table.insert.return_value.execute.return_value = Mock()
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/api/v1/users/1/items/purchase",
            json={"item_id": 1, "quantity": 2}
        )

        assert response.status_code == 200
        data = response.json()
        assert "Successfully purchased" in data["message"]
        assert data["total_cost"] == 200
        assert data["remaining_experience_points"] == 300

    def test_purchase_item_insufficient_points(self, client, mock_supabase):
        """Test purchase with insufficient experience points"""
        # Mock item lookup
        item_data = [{"item_id": 1, "name": "Sword", "cost": 100}]
        item_mock = Mock()
        item_mock.data = item_data

        # Mock user with insufficient points
        user_data = [{"experience_points": 50}]
        user_mock = Mock()
        user_mock.data = user_data

        def table_side_effect(table_name):
            mock_table = Mock()
            if table_name == "items":
                mock_table.select.return_value.eq.return_value.execute.return_value = item_mock
            elif table_name == "users":
                mock_table.select.return_value.eq.return_value.execute.return_value = user_mock
            return mock_table

        mock_supabase.table.side_effect = table_side_effect

        response = client.post(
            "/api/v1/users/1/items/purchase",
            json={"item_id": 1, "quantity": 2}
        )

        assert response.status_code == 400
        assert "Insufficient experience points" in response.json()["detail"]

    def test_equip_item(self, client, mock_supabase):
        """Test equipping an item"""
        # Mock user has the item
        user_item_data = [{"user_id": 1, "item_id": 1, "equipped": False}]
        user_item_mock = Mock()
        user_item_mock.data = user_item_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = user_item_mock
        mock_table.update.return_value.eq.return_value.eq.return_value.execute.return_value = Mock()

        mock_supabase.table.return_value = mock_table

        response = client.put(
            "/api/v1/users/1/items/1/equip",
            json={"equipped": True}
        )

        assert response.status_code == 200
        assert "equipped successfully" in response.json()["message"]

    def test_equip_item_not_owned(self, client, mock_supabase):
        """Test equipping an item user doesn't own"""
        user_item_mock = Mock()
        user_item_mock.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.eq.return_value.execute.return_value = user_item_mock

        mock_supabase.table.return_value = mock_table

        response = client.put(
            "/api/v1/users/1/items/1/equip",
            json={"equipped": True}
        )

        assert response.status_code == 404
        assert "does not own this item" in response.json()["detail"]
