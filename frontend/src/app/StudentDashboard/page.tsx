"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useAuth } from "@/context/AuthContext";
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
import { getUserModules } from "@/lib/api/modules";

interface StudentDashboardProps {
  userData: {
    name?: string;
    email?: string;
    id?: string;
  };
  onLogout: () => void;
}

interface MatchResult {
  id: string;
  name: string;
  time: string | null;
}

interface ScheduleMeetingResponse {
  match?: MatchResult;
  error?: string;
}

export default function StudentDashboard({
  // userData,
  onLogout,
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [timeSlotsByDate, setTimeSlotsByDate] = useState<Record<string, string[]>>({});
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id; // Get UUID from auth context
  const [userModules, setUserModules] = useState<any[]>([]);
  const [moduleProgress, setModuleProgress] = useState(0);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch user modules
  useEffect(() => {
    if (!userId) return; // Wait for auth to load

    const loadModules = async () => {
      try {
        const data = await getUserModules(userId);
        setUserModules(data.modules);

        // Calculate average progress from all modules
        if (data.modules.length > 0) {
          const avgProgress = data.modules.reduce((sum: number, m: any) => sum
   + m.module_progress, 0) / data.modules.length;
          setModuleProgress(Math.round(avgProgress));
        }
      } catch (error) {
        console.error("Failed to load modules:", error);
      }
    };

    loadModules();
  }, [userId]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    router.push("/login");
  };

  interface ScheduleMeetingResponse {
    match?: { id: string; name: string; time: string };
    error?: string;
  }

  async function scheduleAllMeetings(
    userId: string,
    location: string,
    timeSlotsByDate: Record<string, { start_time: string; end_time: string }[]>
  ): Promise<ScheduleMeetingResponse> {
    let lastError: string | undefined = undefined;
    let lastMatch: MatchResult | undefined = undefined;

    for (const [date, slots] of Object.entries(timeSlotsByDate)) {
      for (const slot of slots) {
        const startDateTime = `${date}T${slot.start_time}`;
        const endDateTime = `${date}T${slot.end_time}`;

        const [startH, startM] = slot.start_time.split(":").map(Number);
        const [endH, endM] = slot.end_time.split(":").map(Number);
        const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

        console.log(`⏱ Scheduling: ${startDateTime} → ${endDateTime}`);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/meetings/schedule`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              location,
              start_time: startDateTime,
              end_time: endDateTime,
              duration_minutes: durationMinutes,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Failed to schedule:", error);
          lastError = error?.error || "Failed to schedule meeting";
        } else {
          const match = await response.json();
          console.log("Meeting scheduled:", match);
          lastMatch = match.match || match;
        }
      }
    }

    if (lastError) {
      return { error: lastError };
    }
    if (lastMatch) {
      return { match: { ...lastMatch, time: lastMatch?.time ?? "" } };
    }
    return { error: "No match found" };
  }

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
    <div className="min-h-screen bg-white">
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
          <Card className="bg-blue-primary text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-3xl mb-2">
                  Welcome back, {studentData.name.split(" ")[0]}! 👋
                </h2>
                <p className="text-white-accent mb-4">
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
                <AvatarFallback className="bg-blue-primary text-white text-2xl">
                  {studentData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{moduleProgress || studentData.progress}%</span>
              </div>
              <Progress
                value={moduleProgress || studentData.progress}
                className="h-3 bg-white/20"
              />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mentor">Mentorship</TabsTrigger>
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
                        <Button size="sm" className="bg-blue-primary">
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
                <Card className="p-6 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg">Your Mentor</h3>
                  </div>
                  <div className="mb-4">
                    <Avatar className="w-16 h-16 mb-3 mx-auto">
                      <AvatarFallback className="bg-blue-primary text-white">
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
                  <Button className="w-full bg-blue-primary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Mentor
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Mentor Tab */}
          <TabsContent value="mentor">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Mentorship</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Select a date for mentoring sessions
                  </p>

                  {/* Date selector */}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border rounded p-2 mb-3"
                  />

                  {/* Time range inputs */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Add available time range for {selectedDate || "..."}
                    </label>

                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex-1 border rounded p-2"
                        placeholder="Start time"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-1 border rounded p-2"
                        placeholder="End time"
                      />

                      <Button
                        onClick={() => {
                          if (!selectedDate || !startTime || !endTime) {
                            alert(
                              "Please select a date, start time, and end time."
                            );
                            return;
                          }

                          setTimeSlotsByDate((prev) => {
                            const next = { ...prev };
                            next[selectedDate] = [
                              ...(next[selectedDate] || []),
                              { start_time: startTime, end_time: endTime },
                            ];
                            return next;
                          });

                          setStartTime("");
                          setEndTime("");
                        }}
                        className="bg-blue-primary"
                      >
                        Add time range
                      </Button>
                    </div>
                  </div>

                  {/* Show added availability */}
                  <div className="mt-4">
                    <h4 className="text-sm mb-2">Your availability</h4>
                    {Object.keys(timeSlotsByDate).length === 0 ? (
                      <p className="text-xs text-gray-500">
                        No times added yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(timeSlotsByDate).map(
                          ([date, slots]) => (
                            <div key={date} className="p-2 border rounded">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium">
                                  {date}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const next = { ...timeSlotsByDate };
                                    delete next[date];
                                    setTimeSlotsByDate(next);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {slots.map((slot, i) => (
                                  <div
                                    key={i}
                                    className="px-3 py-1 bg-white border rounded text-sm"
                                  >
                                    {slot.start_time} – {slot.end_time}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pair me button */}
                  <div className="mt-4">
                    <Button
                      className="bg-pink"
                      onClick={async () => {
                        if (!userId) return alert("User not authenticated");
                        if (!Object.keys(timeSlotsByDate).length)
                          return alert("Please select a date and time range");

                        const result = await scheduleAllMeetings(
                          userId,
                          "Anywhere",
                          timeSlotsByDate
                        );

                        if (result.error) {
                          setMatchedUser({
                            id: "none",
                            name: result.error,
                            matchedAt: null,
                          });
                        } else if (result.match) {
                          setMatchedUser({
                            id: result.match.id,
                            name: result.match.name,
                            matchedAt: result.match.time,
                          });
                        } else {
                          setMatchedUser({
                            id: "none",
                            name: "No match found",
                            matchedAt: null,
                          });
                        }
                      }}
                    >
                      Pair me!
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-2">Matched mentor</h4>
                  {matchedUser ? (
                    matchedUser.id === "none" ? (
                      <Card className="p-4">
                        No matches found for those times — try other slots.
                      </Card>
                    ) : (
                      <Card className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-primary text-white">
                              {matchedUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {matchedUser.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              Matched at {matchedUser.matchedAt} on{" "}
                              {selectedDate}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button className="bg-blue-primary">
                            Message Mentor
                          </Button>
                        </div>
                      </Card>
                    )
                  ) : (
                    <p className="text-xs text-gray-500">
                      Pairing results will show here.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
