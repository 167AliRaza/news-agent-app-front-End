"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loginUser, signupUser } from "@/lib/api"
import { useRouter } from "next/navigation" // Import useRouter
import { SignInForm } from "./sign-in-form" // Import SignInForm
import { SignUpForm } from "./sign-up-form" // Import SignUpForm

interface AuthCardProps {
  onForgotPassword: () => void;
}

export function AuthCard({
  onForgotPassword,
}: AuthCardProps) {
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const handleRedirect = () => {
    window.open("https://www.linkedin.com/in/167aliraza/", "_blank");
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission if called from a form
    setIsLoading(true);

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    await loginUser(email, password, router); // Pass router instance
    setIsLoading(false);
  };

  const handleSignUpSubmit = async (fullName: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);

    if (!fullName || !email || !password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Mismatch",
        description: "The password and confirmation password do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Basic password length check (more detailed checks are in PasswordStrength component)
    if (password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    await signupUser(fullName, email, password, router); // Pass router instance
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
        {/* Header with tabs and close button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("signup")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "signup"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setActiveTab("signin")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === "signin"
                  ? "bg-white/20 backdrop-blur-sm text-white border border-white/20 shadow-lg"
                  : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              Sign in
            </button>
          </div>
          <button className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-200 hover:scale-110 hover:rotate-90">
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>

        <h1 className="text-3xl font-normal text-white mb-8 transition-all duration-300">
          {activeTab === "signup" ? "Create an account" : "Welcome back"}
        </h1>

        <div className="relative overflow-hidden">
          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signup" ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            <SignUpForm
              onSubmit={handleSignUpSubmit}
              isLoading={isLoading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out transform ${
              activeTab === "signin" ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
            }`}
          >
            <SignInForm
              onSubmit={handleSignInSubmit}
              isLoading={isLoading}
              email={email}
              setEmail={setEmail}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              onForgotPassword={onForgotPassword}
            />
          </div>
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          {activeTab === "signup"
            ? "By creating an account, you agree to our Terms & Service"
            : "By signing in, you agree to our Terms & Service"}
        </p>

        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-white/30 text-xs">
            designed and developed with ❤️ by{" "}
            <button
              onClick={handleRedirect}
              className="text-white/50 hover:text-white/70 underline transition-colors duration-200"
            >
              Ali Raza
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}