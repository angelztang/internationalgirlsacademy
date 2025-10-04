"use client";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Users,
  Calendar,
  MessageCircle,
  Award,
  TrendingUp,
  Heart,
  Clock,
  Star,
  Video,
  Mail,
  LogOut,
  Bell,
  Settings,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface VolunteerDashboardProps {
  userData?: any;
  onLogout?: () => void;
}

export default function VolunteerDashboard({
  userData,
  onLogout,
}: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth state
    authLogout();

    // Call optional prop logout handler
    if (onLogout) onLogout();

    // Redirect to login
    router.push("/login");
  };

  // Mock data
  const volunteerData = {
    name: userData.name || "Alex Johnson",
    email: userData.email,
    role: "Mentor & Workshop Leader",
    joinedDate: "August 2024",
    currentMentees: [
      {
        id: 1,
        name: "Sarah M.",
        program: "STEM Lab",
        progress: 65,
        nextSession: "Oct 15",
      },
      {
        id: 2,
        name: "Maya P.",
        program: "Entrepreneurship",
        progress: 80,
        nextSession: "Oct 17",
      },
      {
        id: 3,
        name: "Lisa K.",
        program: "Arts Studio",
        progress: 45,
        nextSession: "Oct 20",
      },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Workshop: Career Planning",
        date: "Oct 16, 2025",
        attendees: 12,
      },
      {
        id: 2,
        title: "Mentor Check-in Session",
        date: "Oct 19, 2025",
        attendees: 8,
      },
      {
        id: 3,
        title: "Community Panel Discussion",
        date: "Oct 25, 2025",
        attendees: 25,
      },
    ],
    stats: {
      totalMentees: 3,
      hoursVolunteered: 48,
      sessionsCompleted: 22,
      impactScore: 92,
    },
    recentMessages: [
      {
        id: 1,
        from: "Sarah M.",
        message: "Thank you for the great session!",
        time: "2h ago",
        unread: true,
      },
      {
        id: 2,
        from: "Maya P.",
        message: "Can we reschedule our meeting?",
        time: "5h ago",
        unread: true,
      },
      {
        id: 3,
        from: "IGA Team",
        message: "New workshop opportunity available",
        time: "1d ago",
        unread: false,
      },
    ],
    achievements: [
      { id: 1, title: "Mentor of the Month", icon: "🏆", date: "Sep 2025" },
      { id: 2, title: "50 Hours Milestone", icon: "⭐", date: "Oct 2025" },
      { id: 3, title: "Community Builder", icon: "🤝", date: "Aug 2025" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#f7a1c0] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl">IGA Volunteer Portal</h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-[#f7a1c0] to-[#4455f0] text-white p-8 shadow-xl border-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl mb-2">
                  Welcome, {volunteerData.name.split(" ")[0]}! 💝
                </h2>
                <p className="text-pink-100 mb-4">
                  Thank you for making a difference as a {volunteerData.role}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {volunteerData.stats.totalMentees} active mentees
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {volunteerData.stats.hoursVolunteered} hours volunteered
                    </span>
                  </div>
                </div>
              </div>
              <Avatar className="w-20 h-20 border-4 border-white/20">
                <AvatarFallback className="bg-pink text-white text-2xl">
                  {volunteerData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Impact Score</span>
                  <span>{volunteerData.stats.impactScore}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${volunteerData.stats.impactScore}%` }}
                  />
                </div>
              </div>
              <Badge className="bg-yellow-400 text-yellow-900 border-0">
                <Star className="w-3 h-3 mr-1" />
                Top Mentor
              </Badge>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentees">My Mentees</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-pink-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {volunteerData.stats.totalMentees}
                    </p>
                    <p className="text-xs text-gray-600">Mentees</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {volunteerData.stats.hoursVolunteered}
                    </p>
                    <p className="text-xs text-gray-600">Hours</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {volunteerData.stats.sessionsCompleted}
                    </p>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Heart className="w-5 h-5 text-red-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {volunteerData.stats.impactScore}
                    </p>
                    <p className="text-xs text-gray-600">Impact</p>
                  </Card>
                </div>

                {/* My Volunteer Pathway - Direct access to volunteer PathwayMap */}
                <div className="mt-6">
                  <Link href="/PathwayMap?path=volunteer">
                  <Card className="p-6 bg-gradient-to-r from-[#f7a1c0] to-[#b4bbf8] text-white cursor-pointer hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                          <BookOpen className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="text-xl mb-1">My Volunteer Pathway</h3>
                          <p className="text-sm text-pink-100">
                            Continue your volunteering journey and learn how to mentor
                          </p>
                        </div>
                      </div>
                      <Button className="bg-white text-pink hover:bg-white/90">
                        Continue →
                      </Button>
                    </div>
                  </Card>
                  </Link>
                </div>

                {/* Mentees Overview */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Your Mentees</h3>
                  <div className="space-y-4">
                    {volunteerData.currentMentees.map((mentee) => (
                      <div
                        key={mentee.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-lavender text-white">
                                {mentee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="mb-1">{mentee.name}</h4>
                              <p className="text-sm text-gray-600">
                                {mentee.program}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {mentee.progress}% complete
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Next session: {mentee.nextSession}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-pink">
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Your Achievements</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {volunteerData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="text-center p-4 bg-white rounded-lg"
                      >
                        <div className="text-4xl mb-2">{achievement.icon}</div>
                        <p className="text-sm mb-1">{achievement.title}</p>
                        <p className="text-xs text-gray-600">
                          {achievement.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Events */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    <h3 className="text-lg">Upcoming Events</h3>
                  </div>
                  <div className="space-y-3">
                    {volunteerData.upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <p className="text-sm mb-1">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <p className="text-xs text-gray-600">
                            {event.attendees} attendees
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Events
                  </Button>
                </Card>

                {/* Recent Messages */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg">Recent Messages</h3>
                  </div>
                  <div className="space-y-3">
                    {volunteerData.recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`pb-3 border-b border-gray-200 last:border-0 last:pb-0 ${
                          message.unread
                            ? "bg-purple-50 -mx-3 px-3 py-2 rounded"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm">{message.from}</p>
                          {message.unread && (
                            <Badge className="bg-pink-500 text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-500">{message.time}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Messages
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Mentees Tab */}
          <TabsContent value="mentees">
            <Card className="p-6">
              <h3 className="text-xl mb-4">My Mentees</h3>
              <p className="text-gray-600">
                Detailed mentee information would be displayed here...
              </p>
            </Card>
          </TabsContent>

          {/* Workshops Tab */}
          <TabsContent value="workshops">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Workshops & Events</h3>
              <p className="text-gray-600">
                Workshop management would be displayed here...
              </p>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Messages</h3>
              <p className="text-gray-600">
                Message inbox would be displayed here...
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
