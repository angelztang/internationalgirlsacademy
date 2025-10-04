"use client";

import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { UserPlus, Mail, Lock, User, GraduationCap, Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SignupProps {
  onBack: () => void;
  onSignupSuccess: (userType: 'student' | 'volunteer' | 'admin', userData: any) => void;
  onSwitchToLogin?: () => void;
}

// Move SignupForm component outside to prevent re-creation on every render
function SignupForm({
  formData,
  errors,
  isLoading,
  currentConfig,
  onInputChange,
  onSubmit
}: {
  formData: any;
  errors: Record<string, string>;
  isLoading: boolean;
  currentConfig: any;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              placeholder="John"
              className="pl-10"
            />
          </div>
          {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              placeholder="Doe"
              className="pl-10"
            />
          </div>
          {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            placeholder="At least 6 characters"
            className="pl-10"
          />
        </div>
        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => onInputChange('confirmPassword', e.target.value)}
            placeholder="Re-enter password"
            className="pl-10"
          />
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
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
              Creating account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Sign Up
            </span>
          )}
        </Button>
      </div>

      {/* Info Notice */}
      <div className={`${currentConfig.bgColor} p-4 rounded-lg mt-4`}>
        <p className="text-xs text-gray-700">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
}

export default function SignupPage({ onBack, onSignupSuccess, onSwitchToLogin }: SignupProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'volunteer'>('student');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Register with Supabase Auth directly
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            user_type: activeTab,
            gender: formData.gender || null
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Registration failed");

      // Insert user profile into our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          user_id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: activeTab,
          gender: formData.gender || null,
          password: null, // Managed by Supabase Auth
          experience_points: 0
        });

      if (profileError) throw profileError;

      // Successfully registered
      const userData = {
        email: data.user.email || formData.email,
        userType: activeTab,
        name: `${formData.firstName} ${formData.lastName}`,
        loginTime: new Date().toISOString(),
        userId: data.user.id, // UUID from Supabase Auth
        accessToken: data.session?.access_token,
        profile: {
          user_id: data.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: activeTab,
          gender: formData.gender,
          experience_points: 0
        }
      };

      onSignupSuccess(activeTab, userData);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Signup error:', error);
      setErrors({
        email: error.message || "Registration failed. Please try again."
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const tabConfig = {
    student: {
      icon: GraduationCap,
      color: 'bg-blue-primary text-white',
      bgColor: 'bg-lavender',
      description: 'Join as a student to access learning programs and mentorship'
    },
    volunteer: {
      icon: Heart,
      color: 'bg-pink text-white',
      bgColor: 'bg-pink',
      description: 'Become a volunteer to mentor and support students'
    }
  };

  const currentConfig = tabConfig[activeTab];
  const IconComponent = currentConfig.icon;

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
            <h1 className="text-3xl mb-2">Create Account</h1>
            <p className="text-sm text-white/90">{currentConfig.description}</p>
          </div>

          {/* Signup Tabs */}
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <SignupForm
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  currentConfig={currentConfig}
                  onInputChange={handleInputChange}
                  onSubmit={handleSignup}
                />
              </TabsContent>

              <TabsContent value="volunteer">
                <SignupForm
                  formData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  currentConfig={currentConfig}
                  onInputChange={handleInputChange}
                  onSubmit={handleSignup}
                />
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            🔒 Your data is secure and encrypted
          </p>
          {onSwitchToLogin && (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-purple-600 hover:underline"
              >
                Log in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
