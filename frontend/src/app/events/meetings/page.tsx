'use client'

import React, { useState } from 'react'
import { Calendar, Clock, Users, Video, Plus, ExternalLink } from 'lucide-react'

const HARDCODED_MEET_LINK = 'https://meet.google.com/bpq-cyty-bra?pli=1'

// Dummy meetings data - purely visual, no backend
const DUMMY_MEETINGS = [
  {
    meeting_id: 1,
    title: 'Community Town Hall',
    description: 'Monthly community gathering to discuss updates and initiatives',
    meeting_type: 'normal' as const,
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 90000000).toISOString(),
    max_participants: 100,
    status: 'scheduled' as const,
    can_join: true,
    google_meet_url: HARDCODED_MEET_LINK
  },
  {
    meeting_id: 2,
    title: 'Volunteer Training Session',
    description: 'Learn about volunteer opportunities and how to get involved',
    meeting_type: 'live' as const,
    start_time: new Date(Date.now() + 172800000).toISOString(),
    end_time: new Date(Date.now() + 176400000).toISOString(),
    max_participants: 50,
    status: 'scheduled' as const,
    can_join: true,
    google_meet_url: HARDCODED_MEET_LINK
  },
  {
    meeting_id: 3,
    title: 'Weekly Check-in',
    description: 'Casual meetup to connect with the community',
    meeting_type: 'normal' as const,
    start_time: new Date(Date.now() + 259200000).toISOString(),
    end_time: new Date(Date.now() + 262800000).toISOString(),
    max_participants: 75,
    status: 'scheduled' as const,
    can_join: true,
    google_meet_url: HARDCODED_MEET_LINK
  }
]

interface Meeting {
  meeting_id: number
  title: string
  description?: string
  meeting_type: 'live' | 'normal'
  start_time: string
  end_time: string
  max_participants?: number
  status: 'scheduled' | 'live' | 'ended' | 'cancelled'
  can_join: boolean
  google_meet_url: string
}

interface CreateMeetingForm {
  title: string
  description: string
  meeting_type: 'live' | 'normal'
  start_time: string
  duration_minutes: number
  max_participants: number
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(DUMMY_MEETINGS)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<CreateMeetingForm>({
    title: '',
    description: '',
    meeting_type: 'normal',
    start_time: '',
    duration_minutes: 60,
    max_participants: 50
  })

  const createMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    
    const startTime = new Date(createForm.start_time)
    const endTime = new Date(startTime.getTime() + createForm.duration_minutes * 60000)
    
    const newMeeting: Meeting = {
      meeting_id: meetings.length + 1,
      title: createForm.title,
      description: createForm.description,
      meeting_type: createForm.meeting_type,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      max_participants: createForm.max_participants,
      status: 'scheduled',
      can_join: true,
      google_meet_url: HARDCODED_MEET_LINK
    }
    
    setMeetings([...meetings, newMeeting])
    setShowCreateForm(false)
    setCreateForm({
      title: '',
      description: '',
      meeting_type: 'normal',
      start_time: '',
      duration_minutes: 60,
      max_participants: 50
    })
  }

  const joinMeeting = (meeting: Meeting) => {
    window.open(HARDCODED_MEET_LINK, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#b4bbf8]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Meetings</h1>
              <p className="text-lg text-gray-700">
                Join live presentations or participate in community discussions
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#4455f0] text-white px-6 py-3 rounded-lg hover:bg-[#3344df] flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Create Meeting
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Meeting</h2>
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
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> All meetings use the same Google Meet room for demo purposes
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#4455f0] text-white py-3 px-4 rounded-lg hover:bg-[#3344df] font-semibold transition-all"
                  >
                    Create Meeting
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {meetings.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-[#b4bbf8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-[#4455f0]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No meetings available</h3>
              <p className="text-gray-600">Create your first meeting to get started</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div key={meeting.meeting_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all border-l-4 border-[#4455f0]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        meeting.meeting_type === 'live' 
                          ? 'bg-[#f7a1c0]/20 text-[#f7a1c0] border border-[#f7a1c0]/40' 
                          : 'bg-[#4455f0]/20 text-[#4455f0] border border-[#4455f0]/40'
                      }`}>
                        {meeting.meeting_type === 'live' ? 'Live Meeting' : 'Normal Meeting'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        meeting.status === 'live' 
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : meeting.status === 'scheduled'
                          ? 'bg-[#b4bbf8]/30 text-[#4455f0] border border-[#b4bbf8]'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    {meeting.description && (
                      <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                    )}
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
                      {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {meeting.max_participants && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Max {meeting.max_participants} participants</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-[#4455f0] font-medium">
                    <div className="w-6 h-6 bg-[#4455f0]/10 rounded-full flex items-center justify-center">
                      <Video className="h-3.5 w-3.5" />
                    </div>
                    <span>Google Meet</span>
                  </div>
                </div>

                {meeting.can_join && (
                  <button
                    onClick={() => joinMeeting(meeting)}
                    className="w-full bg-[#4455f0] text-white py-3 px-4 rounded-lg hover:bg-[#3344df] flex items-center justify-center gap-2 font-semibold shadow-md transition-all"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Join Meeting
                  </button>
                )}

                {!meeting.can_join && (
                  <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg text-center font-medium">
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
