import { toast } from "@/hooks/use-toast";

const BASE_URL = "https://167aliraza-news-agent.hf.space";

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  email: string;
  name: string;
}

export async function signupUser(name: string, email: string, password: string): Promise<AuthResponse | null> {
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
        description: errorData.detail || "An unexpected error occurred during sign up.",
        variant: "destructive",
      });
      return null;
    }

    const data: AuthResponse = await response.json();
    toast({
      title: "Sign Up Successful!",
      description: "Your account has been created. You can now sign in.",
    });
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

export async function loginUser(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const formData = new URLSearchParams();
    formData.append("username", email); // Backend expects 'username' for email
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
        description: errorData.detail || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      return null;
    }

    const data: AuthResponse = await response.json();
    toast({
      title: "Sign In Successful!",
      description: "Welcome back to your account.",
    });
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