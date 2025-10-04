"use client";

import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import dynamic from 'next/dynamic';
import { getUserModules } from '../lib/api/modules';

const DataManagement = dynamic(
  () => import('./DataManagement').then((mod) => mod.DataManagement),
  { ssr: false }
);
import { 
  Users, 
  Calendar, 
  TrendingUp,
  Award,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  UserPlus,
  Video,
  FileText,
  Globe,
  DollarSign,
  Database
} from "lucide-react";

interface OrganizerDashboardProps {
  userData: any;
  onLogout: () => void;
}

export function OrganizerDashboard({ userData, onLogout }: OrganizerDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showEventsManager, setShowEventsManager] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const [modules, setModules] = useState<any[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [showModulesManager, setShowModulesManager] = useState(false);

  // Mock data
  const organizerData = {
    name: userData.name || "Dr. Jennifer Lee",
    email: userData.email,
    role: "Program Director",
    stats: {
      totalStudents: 342,
      activeVolunteers: 87,
      programsRunning: 6,
      eventsThisMonth: 12,
      totalRevenue: 45780,
      engagementRate: 89,
    },
    recentActivity: [
      { id: 1, type: "student", action: "New student enrollment", name: "Maya Rodriguez", time: "5m ago" },
      { id: 2, type: "event", action: "Workshop completed", name: "Career Planning 101", time: "1h ago" },
      { id: 3, type: "volunteer", action: "New volunteer registered", name: "Alex Chen", time: "2h ago" },
      { id: 4, type: "donation", action: "Donation received", name: "$500 from Anonymous", time: "3h ago" },
    ],
    programs: [
      { id: 1, name: "STEM Innovation Lab", students: 85, growth: 12, status: "active" },
      { id: 2, name: "Entrepreneurship Track", students: 62, growth: 8, status: "active" },
      { id: 3, name: "Creative Arts Studio", students: 48, growth: -2, status: "active" },
      { id: 4, name: "Leadership Academy", students: 71, growth: 15, status: "active" },
      { id: 5, name: "Ujima Mentorship", students: 56, growth: 5, status: "active" },
      { id: 6, name: "After School Programs", students: 20, growth: 3, status: "planning" },
    ],
    upcomingEvents: [
      { id: 1, name: "Hackathon Finals", date: "Oct 15", participants: 45, type: "competition" },
      { id: 2, name: "Mentor Training", date: "Oct 18", participants: 20, type: "training" },
      { id: 3, name: "Community Showcase", date: "Oct 25", participants: 150, type: "showcase" },
    ],
  };

  // Show data management page
  if (showDataManagement) {
    const DM: any = DataManagement;
    return <DM onBack={() => setShowDataManagement(false)} />;
  }

  useEffect(() => {
    fetchEvents();
    fetchModules();
  }, []);

  async function fetchModules() {
    setLoadingModules(true);
    try {
      // Fetch all user modules by getting all users first
      const usersRes = await fetch("/api/v1/users");
      if (!usersRes.ok) throw new Error("Failed to load users");
      const users = await usersRes.json();

      // Fetch modules for each user
      const allModules: any[] = [];
      for (const user of users) {
        try {
          const data = await getUserModules(user.user_id);
          allModules.push(...data.modules);
        } catch (err) {
          console.error(`Failed to load modules for user ${user.user_id}:`, err);
        }
      }

      setModules(allModules);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingModules(false);
    }
  }

  async function fetchEvents() {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/v1/events");
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  }

  async function fetchEventDetails(eventId: number) {
    try {
      const res = await fetch(`/api/v1/events/${eventId}`);
      if (!res.ok) throw new Error("Failed to load event");
      const data = await res.json();
      setSelectedEvent(data);
      setShowEventsManager(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load event details");
    }
  }

  async function createEvent() {
    if (!newEventStart || !newEventEnd) {
      alert("Please provide start and end times");
      return;
    }

    try {
      const res = await fetch(`/api/v1/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_time: new Date(newEventStart).toISOString(), end_time: new Date(newEventEnd).toISOString() }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to create event");
      }
      const created = await res.json();
      setEvents((s) => [created, ...s]);
      setNewEventStart("");
      setNewEventEnd("");
      alert("Event created");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create event");
    }
  }

  async function updateEvent(eventId: number, payload: any) {
    try {
      const res = await fetch(`/api/v1/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update event");
      const updated = await res.json();
      setEvents((s) => s.map((e) => (e.event_id === updated.event_id ? updated : e)));
      alert("Event updated");
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    }
  }

  async function deleteEvent(eventId: number) {
    if (!confirm("Delete this event?")) return;
    try {
      const res = await fetch(`/api/v1/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents((s) => s.filter((e) => e.event_id !== eventId));
      alert("Event deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  }

  async function deleteModule(moduleId: number) {
    if (!confirm("Delete this module?")) return;
    try {
      const res = await fetch(`/api/v1/modules/${moduleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete module");
      setModules((s) => s.filter((m) => m.module_id !== moduleId));
      alert("Module deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete module");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl">IGA Organizer Dashboard</h1>
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
          <Card className="bg-blue-primary text-white p-8">
            <h2 className="text-3xl mb-2">Welcome, {organizerData.name}! 👋</h2>
            <p className="text-white-accent mb-6">Here's what's happening across IGA programs</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <Users className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{organizerData.stats.totalStudents}</p>
                <p className="text-sm text-blue-100">Total Students</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <UserPlus className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{organizerData.stats.activeVolunteers}</p>
                <p className="text-sm text-blue-100">Active Volunteers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Award className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{organizerData.stats.programsRunning}</p>
                <p className="text-sm text-blue-100">Programs Running</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Calendar className="w-6 h-6 mb-2" />
                <p className="text-2xl mb-1">{organizerData.stats.eventsThisMonth}</p>
                <p className="text-sm text-blue-100">Events This Month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Button 
            onClick={() => setShowDataManagement(true)}
            className="bg-blue-primary h-auto py-4 flex-col gap-2"
          >
            <Database className="w-6 h-6" />
            <span>Data Management</span>
          </Button>
          <Button className="bg-lavender h-auto py-4 flex-col gap-2">
            <UserPlus className="w-6 h-6" />
            <span>Add Student</span>
          </Button>
          <Button className="bg-blue-primary h-auto py-4 flex-col gap-2">
            <Calendar className="w-6 h-6" />
            <span>Create Event</span>
          </Button>
          <Button className="bg-pink h-auto py-4 flex-col gap-2">
            <Video className="w-6 h-6" />
            <span>Start Live Stream</span>
          </Button>
          <Button className="bg-blue-primary h-auto py-4 flex-col gap-2">
            <FileText className="w-6 h-6" />
            <span>View Reports</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Programs Overview */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Program Performance</h3>
                  <div className="space-y-3">
                    {organizerData.programs.map((program) => (
                      <div key={program.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h4>{program.name}</h4>
                            <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                              {program.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{program.students} students</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {program.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                          )}
                          <span className={`text-sm ${program.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {program.growth > 0 ? '+' : ''}{program.growth}% this month
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {organizerData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'student' ? 'bg-purple-100 text-purple-600' :
                          activity.type === 'volunteer' ? 'bg-pink-100 text-pink-600' :
                          activity.type === 'event' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {activity.type === 'student' && <Users className="w-5 h-5" />}
                          {activity.type === 'volunteer' && <UserPlus className="w-5 h-5" />}
                          {activity.type === 'event' && <Calendar className="w-5 h-5" />}
                          {activity.type === 'donation' && <DollarSign className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm mb-1">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.name}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Events Manager */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Events Manager</h3>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setShowEventsManager(!showEventsManager)} size="sm">{showEventsManager ? 'Hide' : 'Manage'}</Button>
                    </div>
                  </div>

                  {showEventsManager ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm">Start time</label>
                        <input type="datetime-local" value={newEventStart} onChange={(e) => setNewEventStart(e.target.value)} className="w-full border rounded p-2" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm">End time</label>
                        <input type="datetime-local" value={newEventEnd} onChange={(e) => setNewEventEnd(e.target.value)} className="w-full border rounded p-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={createEvent} className="bg-blue-primary">Create Event</Button>
                        <Button variant="ghost" onClick={() => { setNewEventStart(''); setNewEventEnd(''); }}>Reset</Button>
                      </div>

                      <div>
                        <h4 className="text-lg mb-2">Existing Events</h4>
                        {loadingEvents ? (
                          <p>Loading...</p>
                        ) : (
                          <div className="space-y-2">
                            {events.map((ev) => (
                              <div key={ev.event_id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium">Event {ev.event_id}</p>
                                  <p className="text-xs text-gray-600">{ev.start_time} → {ev.end_time}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={() => fetchEventDetails(ev.event_id)}>Details</Button>
                                  <Button size="sm" variant="ghost" onClick={() => updateEvent(ev.event_id, {})}>Edit</Button>
                                  <Button size="sm" variant="destructive" onClick={() => deleteEvent(ev.event_id)}>Delete</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Events summary and quick actions live here.</p>
                  )}
                </Card>

                {/* Modules Manager */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Modules Manager</h3>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => setShowModulesManager(!showModulesManager)} size="sm">{showModulesManager ? 'Hide' : 'Manage'}</Button>
                    </div>
                  </div>

                  {showModulesManager ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg mb-2">All User Modules</h4>
                        {loadingModules ? (
                          <p>Loading...</p>
                        ) : modules.length === 0 ? (
                          <p className="text-sm text-gray-600">No modules found</p>
                        ) : (
                          <div className="space-y-2">
                            {modules.map((mod) => (
                              <div key={mod.module_id} className="flex items-center justify-between p-3 border rounded">
                                <div>
                                  <p className="font-medium">Module #{mod.module_id}</p>
                                  <p className="text-xs text-gray-600">User: {mod.user_id}</p>
                                  <p className="text-xs text-gray-600">Progress: {mod.progress}%</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="destructive" onClick={() => deleteModule(mod.module_id)}>Delete</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">View and manage all user modules here.</p>
                  )}
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Metrics */}
                <Card className="p-6">
                  <h3 className="text-lg mb-4">Key Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="text-sm">{organizerData.stats.engagementRate}%</span>
                      </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-primary rounded-full"
                          style={{ width: `${organizerData.stats.engagementRate}%` }}
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-2xl">${organizerData.stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 mt-1">This month</p>
                    </div>
                  </div>
                </Card>

                {/* Upcoming Events */}
                <Card className="p-6">
                  <h3 className="text-lg mb-4">Upcoming Events</h3>
                  <div className="space-y-3">
                    {organizerData.upcomingEvents.map((event) => (
                      <div key={event.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                        <p className="text-sm mb-1">{event.name}</p>
                        <p className="text-xs text-gray-600">{event.date}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <p className="text-xs text-gray-600">{event.participants} participants</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Manage Events
                  </Button>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 bg-white">
                  <h3 className="text-lg mb-4">Global Reach</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl">24</span>
                  </div>
                  <p className="text-sm text-gray-600">Countries represented</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Program Management</h3>
              <p className="text-gray-600">Detailed program management would be displayed here...</p>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="text-xl mb-4">User Management</h3>
              <p className="text-gray-600">Student and volunteer management would be displayed here...</p>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-xl mb-4">Analytics & Reports</h3>
              <p className="text-gray-600">Detailed analytics and reports would be displayed here...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
