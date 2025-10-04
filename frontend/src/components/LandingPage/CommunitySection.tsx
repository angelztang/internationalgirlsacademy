import { Card } from "../../lib/ui/card";
import { Users, Globe, BookOpen, Award } from "lucide-react";
import { LiveStream } from "./LiveChat";

export function CommunitySection() {
  // In a real app, this would come from an API or real-time database
  const isEventLive = true; // Set to false when no event is live
  
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl mb-4">Our Community & Programs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            International Girls Academy (IGA) is a global community dedicated to empowering students through education, mentorship, and support.
          </p>
        </div>

        {/* Live Stream Section - Shows when event is live */}
        {isEventLive && (
          <div className="mb-16">
            <LiveStream 
              isLive={true}
              eventType="pitch"
              eventTitle="IGA Entrepreneurship Pitch Competition"
              viewerCount={247}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="mb-2">10,000+</h3>
            <p className="text-sm text-gray-600">Students Worldwide</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="mb-2">50+</h3>
            <p className="text-sm text-gray-600">Countries Represented</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="mb-2">100+</h3>
            <p className="text-sm text-gray-600">Courses & Workshops</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="mb-2">500+</h3>
            <p className="text-sm text-gray-600">Active Mentors</p>
          </Card>
        </div>

        {/* Programs */}
        <div className="space-y-6">
          <h3 className="text-3xl text-center mb-8">Our Programs</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <h4 className="text-2xl mb-3">Ujima Program</h4>
              <p className="text-purple-100 mb-4">
                Our flagship mentorship program connecting students with experienced professionals for one-on-one guidance and support.
              </p>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Weekly mentorship sessions</li>
                <li>• Career guidance and planning</li>
                <li>• Personal development workshops</li>
                <li>• Community support network</li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-pink-500 to-rose-700 text-white">
              <h4 className="text-2xl mb-3">After School Programs</h4>
              <p className="text-pink-100 mb-4">
                Engaging activities and learning opportunities that extend beyond the classroom to build skills and confidence.
              </p>
              <ul className="space-y-2 text-sm text-pink-100">
                <li>• STEM clubs and coding</li>
                <li>• Arts and creative expression</li>
                <li>• Leadership development</li>
                <li>• Community service projects</li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
              <h4 className="text-2xl mb-3">Entrepreneurship Track</h4>
              <p className="text-blue-100 mb-4">
                Learn to turn your ideas into reality with business skills, mentorship, and resources to launch your own ventures.
              </p>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Business planning workshops</li>
                <li>• Pitch competitions</li>
                <li>• Startup mentorship</li>
                <li>• Funding opportunities</li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
              <h4 className="text-2xl mb-3">Alumni Network</h4>
              <p className="text-indigo-100 mb-4">
                Stay connected, give back, and continue growing with our global network of IGA graduates making an impact.
              </p>
              <ul className="space-y-2 text-sm text-indigo-100">
                <li>• Networking events</li>
                <li>• Mentorship opportunities</li>
                <li>• Career resources</li>
                <li>• Continued learning</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Transparency Section */}
        <Card className="mt-12 p-8 bg-white">
          <h3 className="text-2xl mb-4 text-center">Transparency & Trust</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="mb-2">Open Reporting</h4>
              <p className="text-sm text-gray-600">
                All financial reports and impact metrics are publicly available
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h4 className="mb-2">Direct Impact</h4>
              <p className="text-sm text-gray-600">
                85% of donations go directly to student programs and support
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📊</div>
              <h4 className="mb-2">Real-Time Updates</h4>
              <p className="text-sm text-gray-600">
                Track your contribution&apos;s impact with live dashboards
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
