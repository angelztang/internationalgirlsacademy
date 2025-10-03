"use client";

import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Users,
  Award,
  Video,
  MessageCircle,
  LogOut,
  Bell,
  Settings,
  TrendingUp,
  Target,
  Clock,
  Star,
} from "lucide-react";

interface StudentDashboardProps {
  userData: any;
  onLogout: () => void;
}

export default function StudentDashboard({
  // userData,
  onLogout,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data - in production, this would come from an API or props
  const userData = {
    id: "u12345",
    name: "Jason Luu",
    email: "jason.luu@example.com",
    selectedProgram: "AI & Machine Learning",
    phone: "+1 (555) 123-4567",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Student",
    joinedAt: "2024-09-01",
    preferences: {
      notifications: true,
      theme: "dark",
    },
    bio: "First-generation student passionate about software engineering, AI, and building impactful apps.",
  };

  // Mock data - in production, this would come from an API
  const studentData = {
    name: userData.name || "Sarah Martinez",
    email: userData.email,
    program: userData.selectedProgram || "STEM Innovation Lab",
    enrollmentDate: "September 2024",
    progress: 65,
    completedModules: 8,
    totalModules: 12,
    upcomingEvents: [
      {
        id: 1,
        title: "Hackathon Kickoff",
        date: "Oct 15, 2025",
        time: "2:00 PM",
      },
      {
        id: 2,
        title: "Mentor Session with Dr. Kim",
        date: "Oct 18, 2025",
        time: "4:30 PM",
      },
      {
        id: 3,
        title: "Leadership Workshop",
        date: "Oct 22, 2025",
        time: "3:00 PM",
      },
    ],
    currentCourses: [
      {
        id: 1,
        name: "Python Programming",
        progress: 75,
        nextLesson: "Data Structures",
      },
      {
        id: 2,
        name: "Web Development Basics",
        progress: 40,
        nextLesson: "CSS Flexbox",
      },
      {
        id: 3,
        name: "Design Thinking",
        progress: 90,
        nextLesson: "Final Project",
      },
    ],
    mentor: {
      name: "Dr. Emily Kim",
      role: "Software Engineer at Google",
      nextSession: "Oct 18, 2025 at 4:30 PM",
    },
    achievements: [
      { id: 1, title: "First Module Complete", icon: "🎯", date: "Sep 15" },
      { id: 2, title: "Perfect Attendance", icon: "⭐", date: "Sep 30" },
      { id: 3, title: "Community Helper", icon: "🤝", date: "Oct 5" },
    ],
    stats: {
      hoursLearned: 42,
      sessionsAttended: 15,
      projectsCompleted: 3,
      communityPosts: 28,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl">IGA Student Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={onLogout} className="gap-2">
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
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl mb-2">
                  Welcome back, {studentData.name.split(" ")[0]}! 👋
                </h2>
                <p className="text-purple-100 mb-4">
                  You're making great progress in {studentData.program}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>
                      {studentData.completedModules}/{studentData.totalModules}{" "}
                      modules completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{studentData.stats.hoursLearned} hours learned</span>
                  </div>
                </div>
              </div>
              <Avatar className="w-20 h-20 border-4 border-white/20">
                <AvatarFallback className="bg-white/20 text-white text-2xl">
                  {studentData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{studentData.progress}%</span>
              </div>
              <Progress
                value={studentData.progress}
                className="h-3 bg-white/20"
              />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="mentor">Mentorship</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
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
                      <Clock className="w-5 h-5 text-purple-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {studentData.stats.hoursLearned}
                    </p>
                    <p className="text-xs text-gray-600">Hours Learned</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Video className="w-5 h-5 text-pink-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {studentData.stats.sessionsAttended}
                    </p>
                    <p className="text-xs text-gray-600">Sessions</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {studentData.stats.projectsCompleted}
                    </p>
                    <p className="text-xs text-gray-600">Projects Done</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-2xl mb-1">
                      {studentData.stats.communityPosts}
                    </p>
                    <p className="text-xs text-gray-600">Posts</p>
                  </Card>
                </div>

                {/* Current Courses */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Continue Learning</h3>
                  <div className="space-y-4">
                    {studentData.currentCourses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="mb-1">{course.name}</h4>
                            <p className="text-sm text-gray-600">
                              Next: {course.nextLesson}
                            </p>
                          </div>
                          <Badge variant="secondary">{course.progress}%</Badge>
                        </div>
                        <Progress value={course.progress} className="mb-3" />
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-500 to-pink-500"
                        >
                          Continue
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Recent Achievements</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {studentData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
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
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg">Upcoming Events</h3>
                  </div>
                  <div className="space-y-3">
                    {studentData.upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="pb-3 border-b border-gray-200 last:border-0 last:pb-0"
                      >
                        <p className="text-sm mb-1">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.date}</p>
                        <p className="text-xs text-purple-600">{event.time}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Events
                  </Button>
                </Card>

                {/* Mentor Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg">Your Mentor</h3>
                  </div>
                  <div className="mb-4">
                    <Avatar className="w-16 h-16 mb-3 mx-auto">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {studentData.mentor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h4 className="text-center mb-1">
                      {studentData.mentor.name}
                    </h4>
                    <p className="text-xs text-gray-600 text-center">
                      {studentData.mentor.role}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-600 mb-1">Next Session:</p>
                    <p className="text-sm">{studentData.mentor.nextSession}</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Mentor
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card className="p-6">
              <h3 className="text-xl mb-4">My Courses</h3>
              <p className="text-gray-600">
                Course content would be displayed here...
              </p>
            </Card>
          </TabsContent>

          {/* Mentor Tab */}
          <TabsContent value="mentor">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Mentorship</h3>
              <p className="text-gray-600">
                Mentorship details would be displayed here...
              </p>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Community</h3>
              <p className="text-gray-600">
                Community feed would be displayed here...
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
