'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, Users, Video, Plus, Play, UserCheck, Mic, MicOff } from 'lucide-react'
import dynamicImport from 'next/dynamic'

// Import ZoomMeeting dynamically to prevent SSR issues
const ZoomMeeting = dynamicImport(
  () => import('@/components/meetings/ZoomMeeting'),
  { ssr: false }
)

interface Meeting {
  meeting_id: number
  title: string
  description?: string
  meeting_type: 'live' | 'normal'
  start_time: string
  end_time: string
  max_participants?: number
  meeting_password?: string
  zoom_meeting_id?: string
  zoom_meeting_url?: string
  created_by: string
  created_at: string
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  can_join: boolean
  user_role: 'host' | 'presenter' | 'participant'
}

interface CreateMeetingForm {
  title: string
  description: string
  meeting_type: 'live' | 'normal'
  start_time: string
  duration_minutes: number
  max_participants: number
  meeting_password: string
}

export default function MeetingsPage() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null)
  const [createForm, setCreateForm] = useState<CreateMeetingForm>({
    title: '',
    description: '',
    meeting_type: 'normal',
    start_time: '',
    duration_minutes: 60,
    max_participants: 50,
    meeting_password: ''
  })

  useEffect(() => {
    if (user) {
      fetchMeetings()
    }
  }, [user])

  const fetchMeetings = async () => {
    if (!user) return

    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) return

      const response = await fetch(`http://localhost:8000/api/v1/meetings?user_id=${user.id}&user_type=${profile.user_type}`)
      if (response.ok) {
        const meetingsData = await response.json()
        setMeetings(meetingsData)
      }
    } catch (error) {
      console.error('Error fetching meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const createMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) return

      const response = await fetch('http://localhost:8000/api/v1/meetings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...createForm,
          user_id: user.id,
          user_type: profile.user_type
        })
      })

      if (response.ok) {
        setShowCreateForm(false)
        setCreateForm({
          title: '',
          description: '',
          meeting_type: 'normal',
          start_time: '',
          duration_minutes: 60,
          max_participants: 50,
          meeting_password: ''
        })
        fetchMeetings()
      } else {
        const error = await response.json()
        alert(error.detail || 'Failed to create meeting')
      }
    } catch (error) {
      console.error('Error creating meeting:', error)
      alert('Failed to create meeting')
    }
  }

  const joinMeeting = async (meeting: Meeting) => {
    if (!user) return

    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) return

      // Set the current meeting to join
      setCurrentMeeting(meeting)
    } catch (error) {
      console.error('Error joining meeting:', error)
      alert('Failed to join meeting')
    }
  }

  const handleMeetingEnd = () => {
    setCurrentMeeting(null)
    fetchMeetings() // Refresh meetings list
  }

  const canCreateMeetings = user && ['volunteer', 'admin'].includes(user.userType)

  // If user is in a meeting, show the Zoom meeting component
  if (currentMeeting && user) {
    return (
      <ZoomMeeting
        meetingId={currentMeeting.meeting_id}
        userName={`${user.name}`}
        userType={user.userType}
        meetingType={currentMeeting.meeting_type}
        onMeetingEnd={handleMeetingEnd}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading meetings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
              <p className="mt-2 text-gray-600">
                Join live presentations or participate in community discussions
              </p>
            </div>
            {canCreateMeetings && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Create Meeting
              </button>
            )}
          </div>
        </div>

        {/* Create Meeting Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Meeting</h2>
              <form onSubmit={createMeeting} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={createForm.title}
                    onChange={(e) => setCreateForm({...createForm, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meeting Type</label>
                  <select
                    value={createForm.meeting_type}
                    onChange={(e) => setCreateForm({...createForm, meeting_type: e.target.value as 'live' | 'normal'})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="normal">Normal Meeting (Everyone can talk)</option>
                    <option value="live">Live Meeting (Presenters + Students)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="datetime-local"
                    value={createForm.start_time}
                    onChange={(e) => setCreateForm({...createForm, start_time: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={createForm.duration_minutes}
                    onChange={(e) => setCreateForm({...createForm, duration_minutes: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="15"
                    max="480"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                  <input
                    type="number"
                    value={createForm.max_participants}
                    onChange={(e) => setCreateForm({...createForm, max_participants: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="2"
                    max="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password (optional)</label>
                  <input
                    type="text"
                    value={createForm.meeting_password}
                    onChange={(e) => setCreateForm({...createForm, meeting_password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Create Meeting
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Meetings List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings available</h3>
              <p className="text-gray-500">
                {canCreateMeetings 
                  ? "Create your first meeting to get started" 
                  : "Check back later for upcoming meetings"
                }
              </p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.meeting_id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.meeting_type === 'live' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {meeting.meeting_type === 'live' ? 'Live Meeting' : 'Normal Meeting'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.status === 'live' 
                          ? 'bg-green-100 text-green-800'
                          : meeting.status === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    {meeting.user_role === 'host' && <UserCheck className="h-4 w-4" />}
                    {meeting.user_role === 'presenter' && <Mic className="h-4 w-4" />}
                    {meeting.user_role === 'participant' && <MicOff className="h-4 w-4" />}
                    <span className="capitalize">{meeting.user_role}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(meeting.start_time).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(meeting.start_time).toLocaleTimeString()} - {new Date(meeting.end_time).toLocaleTimeString()}
                    </span>
                  </div>
                  {meeting.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Max {meeting.max_participants} participants</span>
                    </div>
                  )}
                </div>

                {meeting.can_join && (
                  <button
                    onClick={() => joinMeeting(meeting)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Join Meeting
                  </button>
                )}

                {!meeting.can_join && (
                  <div className="w-full bg-gray-100 text-gray-500 py-2 px-4 rounded-md text-center">
                    Meeting {meeting.status}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}