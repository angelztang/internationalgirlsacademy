'use client'

import React, { useEffect, useState } from 'react'
import { ZoomMtg } from '@zoom/meetingsdk'

// Initialize Zoom SDK
ZoomMtg.setZoomJSLib('https://source.zoom.us/3.7.0/lib', '/av')
ZoomMtg.preLoadWasm()
ZoomMtg.prepareWebSDK()

interface ZoomMeetingProps {
  meetingId: number
  userName: string
  userType: string
  meetingType: 'live' | 'normal'
  onMeetingEnd?: () => void
}

interface JoinMeetingData {
  meeting_id: number
  zoom_meeting_id: string
  zoom_meeting_url?: string
  meeting_password?: string
  user_role: 'host' | 'presenter' | 'participant'
  signature: string
  sdk_key: string
}

export default function ZoomMeeting({
  meetingId,
  userName,
  userType,
  meetingType,
  onMeetingEnd
}: ZoomMeetingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinData, setJoinData] = useState<JoinMeetingData | null>(null)

  useEffect(() => {
    joinMeeting()
  }, [meetingId, userName, userType, meetingType])

  const joinMeeting = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get meeting join data from backend
      const response = await fetch(`http://localhost:8000/api/v1/meetings/${meetingId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting_id: meetingId,
          user_name: userName,
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to join meeting')
      }

      const data: JoinMeetingData = await response.json()
      setJoinData(data)

      // Initialize Zoom SDK
      ZoomMtg.init({
        leaveUrl: window.location.origin + '/events/meetings',
        success: () => {
          console.log('Zoom SDK initialized successfully')
          startMeeting(data)
        },
        error: (err: any) => {
          console.error('Zoom init error:', err)
          setError('Failed to initialize Zoom meeting')
          setIsLoading(false)
        }
      })

    } catch (err: any) {
      console.error('Join meeting error:', err)
      setError(err.message || 'Failed to join meeting')
      setIsLoading(false)
    }
  }

  const startMeeting = (data: JoinMeetingData) => {
    try {
      // Determine role based on user type and meeting type
      let role = 0 // participant
      if (data.user_role === 'host') {
        role = 1
      } else if (data.user_role === 'presenter' && meetingType === 'live') {
        role = 1 // presenters can also control in live meetings
      }

      ZoomMtg.join({
        sdkKey: data.sdk_key,
        signature: data.signature,
        meetingNumber: data.zoom_meeting_id,
        passWord: data.meeting_password || '',
        userName: userName,
        userEmail: 'user@example.com',
        success: () => {
          console.log('Successfully joined Zoom meeting')
          setIsLoading(false)
        },
        error: (err: any) => {
          console.error('Zoom join error:', err)
          setError('Failed to join meeting room')
          setIsLoading(false)
        }
      })

      // Set up meeting event listeners
      ZoomMtg.inMeetingServiceListener('onUserJoin', (data: any) => {
        console.log('User joined:', data)
      })

      ZoomMtg.inMeetingServiceListener('onUserLeft', (data: any) => {
        console.log('User left:', data)
      })

      ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data: any) => {
        console.log('Meeting status:', data)
        if (data.meetingStatus === 3) { // Meeting ended
          onMeetingEnd?.()
        }
      })

    } catch (err: any) {
      console.error('Start meeting error:', err)
      setError('Failed to start meeting')
      setIsLoading(false)
    }
  }

  const leaveMeeting = () => {
    try {
      ZoomMtg.leaveMeeting({
        success: () => {
          console.log('Left meeting successfully')
          onMeetingEnd?.()
        },
        error: (err: any) => {
          console.error('Leave meeting error:', err)
          onMeetingEnd?.()
        }
      })
    } catch (err) {
      console.error('Leave meeting error:', err)
      onMeetingEnd?.()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Joining meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold mb-2">Meeting Error</h3>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.href = '/events/meetings'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Meetings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Meeting Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">
            {meetingType === 'live' ? 'Live Meeting' : 'Normal Meeting'}
          </h2>
          <p className="text-sm text-gray-300">
            Role: {joinData?.user_role} | Meeting ID: {joinData?.zoom_meeting_id}
          </p>
        </div>
        <button
          onClick={leaveMeeting}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Leave Meeting
        </button>
      </div>

      {/* Zoom Meeting Container */}
      <div id="zmmtg-root" className="h-screen">
        {/* Zoom SDK will render the meeting interface here */}
      </div>

      {/* Meeting Controls (for presenters/hosts) */}
      {(joinData?.user_role === 'host' || joinData?.user_role === 'presenter') && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-semibold">Controls:</span>
              <span className="ml-2">
                {meetingType === 'live' 
                  ? 'You can present and control the meeting' 
                  : 'You can moderate the discussion'
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
