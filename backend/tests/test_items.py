import pytest
from unittest.mock import Mock


class TestItems:
    """Tests for items endpoints"""

    def test_get_all_items(self, client, mock_supabase):
        """Test getting all items"""
        mock_data = [
            {"item_id": 1, "name": "Sword", "cost": 100},
            {"item_id": 2, "name": "Shield", "cost": 150}
        ]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/items")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["name"] == "Sword"

    def test_get_item_by_id(self, client, mock_supabase):
        """Test getting a specific item"""
        mock_data = [{"item_id": 1, "name": "Sword", "cost": 100}]

        mock_select = Mock()
        mock_select.data = mock_data

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/items/1")

        assert response.status_code == 200
        data = response.json()
        assert data["item_id"] == 1
        assert data["name"] == "Sword"

    def test_get_item_not_found(self, client, mock_supabase):
        """Test getting non-existent item"""
        mock_select = Mock()
        mock_select.data = []

        mock_table = Mock()
        mock_table.select.return_value.eq.return_value.execute.return_value = mock_select
        mock_supabase.table.return_value = mock_table

        response = client.get("/api/v1/items/999")

        assert response.status_code == 404
        assert "Item not found" in response.json()["detail"]

    def test_create_item(self, client, mock_supabase):
        """Test creating a new item"""
        mock_data = [{"item_id": 3, "name": "Potion", "cost": 50}]

        mock_insert = Mock()
        mock_insert.data = mock_data

        mock_table = Mock()
        mock_table.insert.return_value.execute.return_value = mock_insert
        mock_supabase.table.return_value = mock_table

        response = client.post(
            "/api/v1/items",
            json={"item_id": 3, "name": "Potion", "cost": 50}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Potion"
        assert data["cost"] == 50
