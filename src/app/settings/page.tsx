"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  Shield,
  Palette,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Trash2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useFontSize } from "@/contexts/FontSizeContext";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/userService";
import { doc, collection, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const { user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [accountUpdateMessage, setAccountUpdateMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [pendingSetting, setPendingSetting] = useState<{
    type: string;
    value: string;
    handler: (value: string) => void;
  } | null>(null);

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || "",
    username: user?.username || "",
    displayName: user?.name || "",
  });

  const defaultSettings = {
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    lessonReminders: true,
    achievementAlerts: false,
    weeklyReports: true,

    // Privacy settings
    profileVisibility: "public",
    showProgress: true,
    allowDataCollection: false,
    shareAchievements: true,

    // Language settings
    interfaceLanguage: "english",
    learningLanguage: "uyghur",
    showTransliteration: true,
    showDefinitions: true,

    // Audio settings
    soundEnabled: true,
    pronunciationAudio: true,
    backgroundMusic: false,
    volume: 70,

    // Study settings
    dailyGoal: 30,
    autoAdvance: true,
    reviewMode: "spaced",
    difficulty: "adaptive",
  };

  const [settings, setSettings] = useState(defaultSettings);

  const handleSettingChange = (
    key: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setPendingSetting({
      type: "theme",
      value: newTheme,
      handler: (value: string) => setTheme(value as "light" | "dark" | "auto"),
    });
    setShowWarning(true);
  };

  const handleFontSizeChange = (newFontSize: string) => {
    setPendingSetting({
      type: "font size",
      value: newFontSize,
      handler: (value: string) =>
        setFontSize(value as "small" | "medium" | "large"),
    });
    setShowWarning(true);
  };

  const confirmSettingChange = () => {
    if (pendingSetting) {
      pendingSetting.handler(pendingSetting.value);
    }
    setShowWarning(false);
    setPendingSetting(null);
  };

  const cancelSettingChange = () => {
    setShowWarning(false);
    setPendingSetting(null);
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    setTheme("auto");
    setFontSize("medium");
    setShowResetWarning(false);
  };

  // Update account settings when user changes
  useEffect(() => {
    if (user) {
      setAccountSettings({
        email: user.email || "",
        username: user.username || "",
        displayName: user.name || "",
      });
    }
  }, [user]);

  const handleAccountSettingChange = (field: string, value: string) => {
    setAccountSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateAccount = async () => {
    if (!user || user.isGuest) {
      setAccountUpdateMessage({
        type: "error",
        message: "Guest users cannot update account settings.",
      });
      return;
    }

    // Check if Firebase is available (disabled in iOS builds)
    if (!db) {
      setAccountUpdateMessage({
        type: "error",
        message:
          "Account updates are not available in this version. Please use the web version for full functionality.",
      });
      return;
    }

    setIsUpdatingAccount(true);
    setAccountUpdateMessage(null);

    try {
      // Validate inputs
      if (!accountSettings.displayName.trim()) {
        throw new Error("Display name is required.");
      }

      if (!accountSettings.username.trim()) {
        throw new Error("Username is required.");
      }

      // Check if username is already taken by another user
      if (accountSettings.username !== user.username) {
        const usernameExists = await userService.usernameExists(
          accountSettings.username
        );
        if (usernameExists) {
          throw new Error(
            "This username is already taken. Please choose a different username."
          );
        }
      }

      // Update user profile - we need to update the user document directly
      // since updateUserProfile only handles profile fields, not user fields
      const userRef = doc(collection(db, "users"), user.id);
      await updateDoc(userRef, {
        name: accountSettings.displayName,
        username: accountSettings.username,
      });

      setAccountUpdateMessage({
        type: "success",
        message: "Account settings updated successfully!",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setAccountUpdateMessage(null);
      }, 3000);
    } catch (error) {
      setAccountUpdateMessage({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to update account settings.",
      });
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || user.isGuest) {
      setAccountUpdateMessage({
        type: "error",
        message: "Guest users cannot delete accounts.",
      });
      return;
    }

    // Check if Firebase is available (disabled in iOS builds)
    if (!db) {
      setAccountUpdateMessage({
        type: "error",
        message:
          "Account deletion is not available in this version. Please use the web version for full functionality.",
      });
      setShowDeleteWarning(false);
      return;
    }

    try {
      // This would typically involve more complex logic with Firebase Auth
      // For now, we'll just show a message
      setAccountUpdateMessage({
        type: "error",
        message:
          "Account deletion is not yet implemented. Please contact support.",
      });
      setShowDeleteWarning(false);
    } catch {
      setAccountUpdateMessage({
        type: "error",
        message: "Failed to delete account. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your learning experience and account preferences
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowResetWarning(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings - Coming Soon */}
        <Card className="relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-white/75 dark:bg-gray-800/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Coming Soon
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Notification settings will be available in a future update
              </div>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notifications on your device
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("pushNotifications", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Lesson Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Daily reminders to study
                </p>
              </div>
              <Switch
                checked={settings.lessonReminders}
                onCheckedChange={(checked) =>
                  handleSettingChange("lessonReminders", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Achievement Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notify when you earn achievements
                </p>
              </div>
              <Switch
                checked={settings.achievementAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("achievementAlerts", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Weekly Reports
                </Label>
                <p className="text-sm text-muted-foreground">
                  Summary of your weekly progress
                </p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) =>
                  handleSettingChange("weeklyReports", checked)
                }
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings - Coming Soon */}
        <Card className="relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-white/75 dark:bg-gray-800/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Coming Soon
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Privacy settings will be available in a future update
              </div>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Control your privacy and data settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Profile Visibility
              </Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) =>
                  handleSettingChange("profileVisibility", value)
                }
                disabled
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Show Progress
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display your learning progress
                </p>
              </div>
              <Switch
                checked={settings.showProgress}
                onCheckedChange={(checked) =>
                  handleSettingChange("showProgress", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Data Collection
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow analytics and improvement data
                </p>
              </div>
              <Switch
                checked={settings.allowDataCollection}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowDataCollection", checked)
                }
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Customize the look and feel of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Font Size
              </Label>
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings - Coming Soon */}
        <Card className="relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-white/75 dark:bg-gray-800/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Coming Soon
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Audio settings will be available in a future update
              </div>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              {settings.soundEnabled ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <VolumeX className="h-5 w-5" />
              )}
              Audio
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Configure audio and sound preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Enable Sound
                </Label>
                <p className="text-sm text-muted-foreground">
                  Turn on all audio features
                </p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("soundEnabled", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Pronunciation Audio
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play word pronunciations
                </p>
              </div>
              <Switch
                checked={settings.pronunciationAudio}
                onCheckedChange={(checked) =>
                  handleSettingChange("pronunciationAudio", checked)
                }
                disabled
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Background Music
                </Label>
                <p className="text-sm text-muted-foreground">
                  Play ambient music during lessons
                </p>
              </div>
              <Switch
                checked={settings.backgroundMusic}
                onCheckedChange={(checked) =>
                  handleSettingChange("backgroundMusic", checked)
                }
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Volume: {settings.volume}%
              </Label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) =>
                  handleSettingChange("volume", parseInt(e.target.value))
                }
                className="w-full"
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Study Settings - Coming Soon */}
        <Card className="relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="absolute inset-0 bg-white/75 dark:bg-gray-800/75 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Coming Soon
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Study preferences will be available in a future update
              </div>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Smartphone className="h-5 w-5" />
              Study Preferences
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Customize your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Daily Goal (minutes)
              </Label>
              <Input
                type="number"
                value={settings.dailyGoal}
                onChange={(e) =>
                  handleSettingChange("dailyGoal", parseInt(e.target.value))
                }
                min="5"
                max="120"
                disabled
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-gray-900 dark:text-gray-100">
                  Auto-advance
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically proceed to next lesson
                </p>
              </div>
              <Switch
                checked={settings.autoAdvance}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoAdvance", checked)
                }
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Review Mode
              </Label>
              <Select
                value={settings.reviewMode}
                onValueChange={(value) =>
                  handleSettingChange("reviewMode", value)
                }
                disabled
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="spaced">Spaced Repetition</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="sequential">Sequential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Difficulty
              </Label>
              <Select
                value={settings.difficulty}
                onValueChange={(value) =>
                  handleSettingChange("difficulty", value)
                }
                disabled
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectItem value="adaptive">Adaptive</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="lg:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Mail className="h-5 w-5" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Manage your account information and preferences
            </CardDescription>
            {!db && (
              <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Account updates are limited in this version. For full
                  functionality, please use the web version.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Account Update Message */}
            {accountUpdateMessage && (
              <div
                className={`p-3 rounded-md ${
                  accountUpdateMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
                }`}
              >
                {accountUpdateMessage.message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={accountSettings.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">
                  Username
                </Label>
                <Input
                  placeholder="username"
                  value={accountSettings.username}
                  onChange={(e) =>
                    handleAccountSettingChange("username", e.target.value)
                  }
                  disabled={user?.isGuest}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-gray-100">
                Display Name
              </Label>
              <Input
                placeholder="Your display name"
                value={accountSettings.displayName}
                onChange={(e) =>
                  handleAccountSettingChange("displayName", e.target.value)
                }
                disabled={user?.isGuest}
                className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>

            {/* Update Account Button */}
            {!user?.isGuest && (
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleUpdateAccount}
                  disabled={isUpdatingAccount || !db}
                  className="flex items-center gap-2"
                >
                  {isUpdatingAccount ? "Updating..." : "Update Account"}
                </Button>
              </div>
            )}

            {/* Danger Zone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Danger Zone
                </h4>
                <p className="text-sm text-muted-foreground">
                  Irreversible and destructive actions
                </p>
              </div>
              <Button
                variant="destructive"
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setShowDeleteWarning(true)}
                disabled={user?.isGuest || !db}
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Experimental Feature Warning
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              You are about to change the {pendingSetting?.type} setting. All
              settings are experimental and may cause unexpected problems or
              visual issues. Changes are applied immediately and saved
              automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={cancelSettingChange}>
              Cancel
            </Button>
            <Button onClick={confirmSettingChange}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Warning Dialog */}
      <Dialog open={showResetWarning} onOpenChange={setShowResetWarning}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Reset to Defaults
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              This will reset all settings to their default values, including
              theme and font size. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowResetWarning(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetToDefaults}>
              Reset All Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Warning Dialog */}
      <Dialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteWarning(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
