import React from 'react'
import Link from 'next/link'
import { Calendar, Users, Video, Clock } from 'lucide-react'

export default function Events() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Events & Meetings</h1>
          <p className="mt-2 text-gray-600">
            Join live presentations, community discussions, and educational events
          </p>
        </div>

        {/* Event Types Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Meetings Card */}
          <Link href="/events/meetings" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    Meetings
                  </h3>
                  <p className="text-sm text-gray-500">Live & Normal</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Join live presentations where volunteers and admins can present, or participate in normal meetings where everyone can talk.
              </p>
            </div>
          </Link>

          {/* Events Card */}
          <Link href="/events/calendar" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                    Events Calendar
                  </h3>
                  <p className="text-sm text-gray-500">Upcoming Events</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                View and register for upcoming community events, workshops, and special activities.
              </p>
            </div>
          </Link>

          {/* Community Card */}
          <Link href="/events/community" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                    Community
                  </h3>
                  <p className="text-sm text-gray-500">Discussions</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Engage in community discussions, share ideas, and connect with other members.
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Live Meetings</p>
                <p className="text-sm text-gray-500">Presentations & Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Normal Meetings</p>
                <p className="text-sm text-gray-500">Open discussions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Video className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Role-based Access</p>
                <p className="text-sm text-gray-500">Host, Presenter, Participant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

