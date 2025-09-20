import { toast } from "@/hooks/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { setAuthData, clearAuthData, getAuthToken } from "@/lib/auth-utils"; // Import auth utilities

const BASE_URL = "https://167aliraza-news-agent.hf.space";

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  email: string;
  name: string;
}

interface LogoutResponse {
  message: string;
}

// Helper function to extract a meaningful error message
function getErrorMessage(errorData: any, defaultMessage: string): string {
  if (errorData && typeof errorData.detail === 'string' && errorData.detail.trim() !== '') {
    return errorData.detail;
  }
  if (Array.isArray(errorData.detail) && errorData.detail.length > 0) {
    // Assuming it's a Pydantic validation error format
    return errorData.detail.map((err: any) => err.msg).join(', ');
  }
  if (errorData && typeof errorData.message === 'string' && errorData.message.trim() !== '') {
    return errorData.message;
  }
  return defaultMessage;
}

export async function signupUser(name: string, email: string, password: string, router: AppRouterInstance): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Sign Up Failed",
        description: getErrorMessage(errorData, "An unexpected error occurred during sign up."),
        variant: "destructive",
      });
      return null;
    }

    const data: AuthResponse = await response.json();
    setAuthData({ accessToken: data.access_token, email: data.email, name: data.name }); // Save auth data
    toast({
      title: "Sign Up Successful!",
      description: "Your account has been created. Redirecting to chat...",
    });
    router.push("/chat");
    return data;
  } catch (error) {
    console.error("Sign up API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

export async function loginUser(email: string, password: string, router: AppRouterInstance): Promise<AuthResponse | null> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Sign In Failed",
        description: getErrorMessage(errorData, "Invalid email or password."),
        variant: "destructive",
      });
      return null;
    }

    const data: AuthResponse = await response.json();
    setAuthData({ accessToken: data.access_token, email: data.email, name: data.name }); // Save auth data
    toast({
      title: "Sign In Successful!",
      description: "Welcome back to your account. Redirecting to chat...",
    });
    router.push("/chat");
    return data;
  } catch (error) {
    console.error("Sign in API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

export async function logoutUser(router: AppRouterInstance): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    console.warn("No token found for logout.");
    clearAuthData(); // Ensure data is cleared even if no token was present
    router.push("/");
    return true;
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Logout Failed",
        description: getErrorMessage(errorData, "An error occurred during logout."),
        variant: "destructive",
      });
      // Even if API logout fails, clear client-side data for security
      clearAuthData();
      router.push("/");
      return false;
    }

    const data: LogoutResponse = await response.json();
    toast({
      title: "Logged Out",
      description: data.message || "You have been successfully logged out.",
    });
    clearAuthData(); // Clear auth data on successful logout
    router.push("/");
    return true;
  } catch (error) {
    console.error("Logout API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server for logout. Please try again.",
      variant: "destructive",
    });
    clearAuthData(); // Clear auth data even on network error
    router.push("/");
    return false;
  }
}