"use client";

import { useState, useEffect } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Calendar, Clock, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { 
  getUserAvailability, 
  createAvailability, 
  updateAvailability, 
  deleteAvailability,
  type AvailabilitySlot 
} from "@/lib/api/availability";

interface AvailabilityManagerProps {
  userId: string;
}

interface AvailabilityFormData {
  date: string;
  startTime: string;
  endTime: string;
}

export default function AvailabilityManager({ userId }: AvailabilityManagerProps) {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [formData, setFormData] = useState<AvailabilityFormData>({
    date: "",
    startTime: "",
    endTime: ""
  });

  // Load user's availability when component mounts
  useEffect(() => {
    if (userId) {
      loadAvailability();
    }
  }, [userId]);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const slots = await getUserAvailability(userId);
      setAvailabilitySlots(slots);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: string, time: string): string => {
    return `${date}T${time}:00`;
  };

  const handleAddAvailability = async () => {
    try {
      setError(null);
      
      if (!formData.date || !formData.startTime || !formData.endTime) {
        setError("Please fill in all fields");
        return;
      }

      const timeStart = formatDateTime(formData.date, formData.startTime);
      const timeEnd = formatDateTime(formData.date, formData.endTime);

      if (new Date(timeEnd) <= new Date(timeStart)) {
        setError("End time must be after start time");
        return;
      }

      await createAvailability(userId, {
        time_start: timeStart,
        time_end: timeEnd
      });

      // Reload availability and reset form
      await loadAvailability();
      setShowAddForm(false);
      setFormData({ date: "", startTime: "", endTime: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add availability");
    }
  };

  const handleUpdateAvailability = async (slotId: number) => {
    try {
      setError(null);
      
      if (!formData.date || !formData.startTime || !formData.endTime) {
        setError("Please fill in all fields");
        return;
      }

      const timeStart = formatDateTime(formData.date, formData.startTime);
      const timeEnd = formatDateTime(formData.date, formData.endTime);

      if (new Date(timeEnd) <= new Date(timeStart)) {
        setError("End time must be after start time");
        return;
      }

      await updateAvailability(slotId, {
        time_start: timeStart,
        time_end: timeEnd
      });

      // Reload availability and reset form
      await loadAvailability();
      setEditingSlot(null);
      setFormData({ date: "", startTime: "", endTime: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update availability");
    }
  };

  const handleDeleteAvailability = async (slotId: number) => {
    try {
      setError(null);
      await deleteAvailability(slotId);
      await loadAvailability();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete availability");
    }
  };

  const startEdit = (slot: AvailabilitySlot) => {
    const startDate = new Date(slot.time_start);
    const endDate = new Date(slot.time_end);
    
    setFormData({
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5)
    });
    setEditingSlot(slot.availability_id);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingSlot(null);
    setFormData({ date: "", startTime: "", endTime: "" });
    setError(null);
  };

  const formatDisplayDateTime = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading availability...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">My Availability</h3>
          <Badge variant="secondary">{availabilitySlots.length} slots</Badge>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setEditingSlot(null);
            setFormData({ date: "", startTime: "", endTime: "" });
            setError(null);
          }}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Time Slot
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {(showAddForm || editingSlot !== null) && (
        <Card className="p-4 mb-6 bg-gray-50">
          <h4 className="font-medium mb-4">
            {editingSlot !== null ? "Edit Time Slot" : "Add New Time Slot"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={editingSlot !== null ? 
                () => handleUpdateAvailability(editingSlot) : 
                handleAddAvailability
              }
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingSlot !== null ? "Update" : "Add"} Slot
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                cancelEdit();
              }}
              size="sm"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Availability Slots List */}
      {availabilitySlots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No availability slots set</p>
          <p className="text-sm">Add your available times to help mentors schedule meetings with you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {availabilitySlots
            .sort((a, b) => new Date(a.time_start).getTime() - new Date(b.time_start).getTime())
            .map((slot) => (
              <div
                key={slot.availability_id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">
                      {formatDisplayDateTime(slot.time_start)} - {formatDisplayDateTime(slot.time_end)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Duration: {Math.round((new Date(slot.time_end).getTime() - new Date(slot.time_start).getTime()) / (1000 * 60))} minutes
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(slot)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAvailability(slot.availability_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </Card>
  );
}
