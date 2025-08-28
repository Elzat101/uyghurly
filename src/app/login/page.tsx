"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
  Home,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, loginAsGuest, signUp, signInWithGoogle, isLoading, user } =
    useAuth();
  const router = useRouter();

  // Redirect if user is already logged in (but not guest users)
  useEffect(() => {
    if (user && !user.isGuest) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(loginEmail, password);
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Enhanced password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      setError("Password must contain at least one letter");
      return;
    }

    // Check for at least one capital letter
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one capital letter");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    // Basic username validation - alphanumeric and underscores only
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }

    try {
      await signUp(name, username, email, password);
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Account creation failed. Please try again."
      );
      console.error("Sign up error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google sign in failed. Please try again."
      );
      console.error("Google sign in error:", error);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    router.push("/");
  };

  const resetForm = () => {
    setLoginEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setUsername("");
    setEmail("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (password.length === 0)
      return { score: 0, label: "Enter password", color: "text-gray-500" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[a-zA-Z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;

    if (score === 0)
      return { score: 0, label: "Very Weak", color: "text-red-500" };
    if (score === 1) return { score: 1, label: "Weak", color: "text-red-500" };
    if (score === 2)
      return { score: 2, label: "Fair", color: "text-yellow-500" };
    if (score === 3)
      return { score: 3, label: "Good", color: "text-yellow-500" };
    return { score: 4, label: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome to Uyghurly"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isSignUp
              ? "Join us to start your Uyghur language journey"
              : "Sign in to continue your learning progress"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Login/Signup Form */}
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                {isSignUp ? (
                  <UserPlus className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                {isSignUp ? "Sign Up" : "Sign In"}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {isSignUp
                  ? "Create a new account to save your progress"
                  : "Enter your credentials to access your learning progress"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={isSignUp ? handleSignUp : handleLogin}
                className="space-y-4"
              >
                {isSignUp && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <div>
                    <label
                      htmlFor="identifier"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="loginEmail"
                        type="email"
                        placeholder="Enter your email address"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        isSignUp ? "Create a password" : "Enter your password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {isSignUp && (
                    <div className="mt-2 space-y-2">
                      {/* Password strength bar */}
                      <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Password strength:
                          </span>
                          <span
                            className={`text-xs font-medium ${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.score === 0
                                ? "w-0"
                                : passwordStrength.score === 1
                                ? "w-1/4 bg-red-500"
                                : passwordStrength.score === 2
                                ? "w-2/4 bg-yellow-500"
                                : passwordStrength.score === 3
                                ? "w-3/4 bg-yellow-500"
                                : "w-full bg-green-500"
                            }`}
                          ></div>
                        </div>
                      </div>

                      {/* Individual requirements */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              password.length >= 8
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={
                              password.length >= 8
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500"
                            }
                          >
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /\d/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={
                              /\d/.test(password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500"
                            }
                          >
                            Contains a number
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /[a-zA-Z]/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={
                              /[a-zA-Z]/.test(password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500"
                            }
                          >
                            Contains a letter
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              /[A-Z]/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span
                            className={
                              /[A-Z]/.test(password)
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500"
                            }
                          >
                            Contains a capital letter
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required={isSignUp}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    <p>{error}</p>
                    {error.includes("email") && (
                      <p className="text-xs mt-1">
                        💡 Tip: Check that your email address is spelled
                        correctly
                      </p>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing in..."}
                    </>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Toggle between Login and Signup */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 mx-auto transition-all duration-200 hover:scale-105 hover:underline"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    {isSignUp
                      ? "Already have an account? Sign in"
                      : "Don't have an account? Sign up"}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                      Or
                    </span>
                  </div>
                </div>

                {/* Guest Access - Integrated */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Continue as Guest</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    Start Learning Now
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your progress will be saved locally
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
