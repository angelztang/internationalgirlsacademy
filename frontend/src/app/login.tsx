"use client";

import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { LogIn, Mail, Lock, Users, GraduationCap, Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LoginProps {
  onBack: () => void;
  onLogin: (userType: 'student' | 'volunteer' | 'admin', userData: any) => void;
  onSwitchToSignup?: () => void;
}

export default function LoginPage({ onBack, onLogin, onSwitchToSignup }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'volunteer' | 'admin'>('student');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    console.log('[login] mounted');
    const onBefore = () => console.log('[login] beforeunload');
    window.addEventListener('beforeunload', onBefore);
    return () => {
      console.log('[login] unmounted');
      window.removeEventListener('beforeunload', onBefore);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Login with Supabase Auth directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

      // Get user profile from our database to check user_type
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("User profile not found");
      }

      // Check if user_type matches selected tab
      if (profile.user_type !== activeTab) {
        setErrors({ password: `Please login as ${profile.user_type}` });
        setIsLoading(false);
        return;
      }

      const userData = {
        email: data.user.email || email,
        userType: profile.user_type,
        name: `${profile.first_name} ${profile.last_name}`,
        loginTime: new Date().toISOString(),
        userId: data.user.id, // UUID from Supabase Auth
        accessToken: data.session?.access_token,
        profile: profile
      };

      onLogin(activeTab, userData);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ password: error.message || "Invalid email or password" });
      setIsLoading(false);
    }
  };

  const tabConfig = {
    student: {
      icon: GraduationCap,
      color: 'bg-blue-primary text-white',
      bgColor: 'bg-lavender',
      description: 'Access your learning journey, programs, and mentors'
    },
    volunteer: {
      icon: Heart,
      color: 'bg-pink text-white',
      bgColor: 'bg-pink',
      description: 'Connect with students and manage your mentorship'
    },
    admin: {
      icon: Users,
      color: 'bg-blue-primary text-white',
      bgColor: 'bg-white',
      description: 'Manage programs, events, and community'
    }
  };

  const currentConfig = tabConfig[activeTab];
  const IconComponent = currentConfig.icon;

  const renderLoginForm = () => {
    return (
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
              }}
              placeholder="you@example.com"
              className="pl-10"
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-purple-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
              }}
              placeholder="Enter your password"
              className="pl-10"
            />
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <Button
            type="submit"
            className={`w-full ${currentConfig.color}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Log In
              </span>
            )}
          </Button>
        </div>

        {/* Demo Credentials Notice */}
        <div className={`${currentConfig.bgColor} p-4 rounded-lg mt-4`}>
          <p className="text-xs text-gray-700">
            <strong>Demo Mode:</strong> Use any email/password to explore the {activeTab} dashboard
          </p>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="overflow-hidden">
          {/* Header */}
          <div className={`${currentConfig.color} p-8 text-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8" />
            </div>
            <h1 className="text-3xl mb-2">Welcome Back!</h1>
            <p className="text-sm text-white/90">{currentConfig.description}</p>
          </div>

          {/* Login Tabs */}
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                {renderLoginForm()}
              </TabsContent>

              <TabsContent value="volunteer">
                {renderLoginForm()}
              </TabsContent>

              <TabsContent value="admin">
                {renderLoginForm()}
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            🔒 Your data is secure and encrypted
          </p>
          {(activeTab === 'student' || activeTab === 'volunteer') && onSwitchToSignup && (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-purple-600 hover:underline"
              >
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
