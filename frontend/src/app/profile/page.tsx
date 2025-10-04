"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Award,
  Edit,
  Save,
  X,
  Lock,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    bio: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load user profile
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          gender: data.gender || "",
          bio: data.bio || ""
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          gender: formData.gender || null,
          bio: formData.bio || null
        })
        .eq('user_id', user!.id);

      if (error) throw error;

      // Update user context
      updateUser({
        name: `${formData.firstName} ${formData.lastName}`
      });

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setErrors({ general: error.message || "Failed to update profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!passwordData.newPassword) newErrors.newPassword = "New password is required";
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setIsChangingPassword(false);
      alert("Password changed successfully!");
    } catch (error: any) {
      console.error('Error changing password:', error);
      setErrors({ password: error.message || "Failed to change password" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  const userTypeColors: Record<string, string> = {
    student: "bg-blue-100 text-blue-700",
    volunteer: "bg-pink-100 text-pink-700",
    admin: "bg-purple-100 text-purple-700"
  };

  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className={`text-2xl ${userTypeColors[user.userType] || 'bg-gray-200'}`}>
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Badge className={userTypeColors[user.userType]}>
                  {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{formData.email}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>{user.experiencePoints || 0} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </Card>

        {/* Profile Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            {isEditing ? (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                      {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                      {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender (Optional)</Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="e.g., Female, Male, Non-binary"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  {errors.general && (
                    <p className="text-sm text-red-500">{errors.general}</p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                        loadUserProfile();
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <div className="space-y-3 text-gray-700">
                  {formData.bio ? (
                    <p>{formData.bio}</p>
                  ) : (
                    <p className="text-gray-400 italic">No bio added yet. Click "Edit Profile" to add one.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Change Password */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Security</h2>
                {!isChangingPassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                    />
                    {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Update Password"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Keep your account secure with a strong password.</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience Points</span>
                  <span className="font-semibold">{user.experiencePoints || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <Badge className={`${userTypeColors[user.userType]} text-xs`}>
                    {user.userType}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
