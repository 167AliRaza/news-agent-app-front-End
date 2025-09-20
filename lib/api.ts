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

interface UserQuery {
  query: string;
  thread_id?: string | null;
  create_new_thread?: boolean;
}

interface ChatResponse {
  result: string;
  thread_id: string;
  user_id: string;
  is_new_thread: boolean;
}

interface Thread {
  thread_id: string;
  title: string;
}

interface ThreadsResponse {
  threads: Thread[];
}

interface ThreadMessage {
  id: string;
  type: string;
  content: string;
}

interface ThreadMessagesData {
  all_messages: ThreadMessage[];
  message_count: number;
}

interface ThreadMessagesResponse {
  thread_id: string;
  messages: ThreadMessagesData;
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
    // Changed to send JSON body instead of form-urlencoded
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Changed content type
      },
      body: JSON.stringify({ email, password }), // Changed body to JSON
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

export async function sendMessageToAgent(
  query: string,
  threadId: string | null,
  createNewThread: boolean
): Promise<ChatResponse | null> {
  const token = getAuthToken();
  if (!token) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to send messages.",
      variant: "destructive",
    });
    return null;
  }

  try {
    const userQuery: UserQuery = { query };
    if (threadId) {
      userQuery.thread_id = threadId;
    }
    if (createNewThread) {
      userQuery.create_new_thread = true;
    }

    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userQuery),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Chat Error",
        description: getErrorMessage(errorData, "Failed to get a response from the agent."),
        variant: "destructive",
      });
      return null;
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Send message API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

export async function fetchUserThreads(): Promise<Thread[] | null> {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/threads`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Fetch Threads Failed",
        description: getErrorMessage(errorData, "Failed to load your chat threads."),
        variant: "destructive",
      });
      return null;
    }

    const data: ThreadsResponse = await response.json();
    console.log("Fetched threads:", data.threads); // Log fetched threads
    return data.threads;
  } catch (error) {
    console.error("Fetch threads API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server to fetch threads.",
      variant: "destructive",
    });
    return null;
  }
}

interface ProcessedThreadMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export async function fetchThreadMessages(threadId: string): Promise<ProcessedThreadMessage[] | null> {
  // Client-side validation to prevent sending 'query' as a thread ID
  if (threadId === "query") {
    toast({
      title: "Invalid Thread ID",
      description: "Cannot retrieve messages for a thread with ID 'query'. This might indicate a backend issue returning an invalid thread ID.",
      variant: "destructive",
    });
    console.error("Attempted to fetch messages for invalid thread ID: 'query'");
    return null;
  }

  const token = getAuthToken();
  if (!token) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view thread messages.",
      variant: "destructive",
    });
    return null;
  }

  try {
    const response = await fetch(`${BASE_URL}/thread_messages/${threadId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Fetch Messages Failed",
        description: getErrorMessage(errorData, "Failed to load messages for this thread."),
        variant: "destructive",
      });
      return null;
    }

    const data: ThreadMessagesResponse = await response.json();
    
    // Process messages from the nested structure
    return data.messages.all_messages.map(msg => {
      let formattedText = msg.content;
      const isUser = msg.type === "HumanMessage";
      
      try {
        const parsedText = JSON.parse(msg.content);
        if (typeof parsedText === 'object' && parsedText !== null && 'query' in parsedText && 'search_results' in parsedText) {
          if (isUser) {
            formattedText = parsedText.query || "User query (details in console)";
          } else {
            // Agent's response
            const searchResults = parsedText.search_results;
            if (Array.isArray(searchResults) && searchResults.length > 0) {
              formattedText = `Agent found ${searchResults.length} relevant results.`;
            } else {
              formattedText = "Agent processed your query.";
            }
          }
        }
      } catch (e) {
        // If parsing fails, it's a plain string, so use original msg.content
      }

      return {
        id: msg.id,
        text: formattedText,
        isUser: isUser,
        timestamp: new Date().toISOString(), // Add timestamp for compatibility
      };
    });
  } catch (error) {
    console.error("Fetch thread messages API error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to the server to fetch thread messages.",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteThread(threadId: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to delete threads.",
      variant: "destructive",
    });
    return false;
  }

  try {
    const response = await fetch(`${BASE_URL}/delete_thread/${threadId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Delete Thread Failed",
        description: getErrorMessage(errorData, "Failed to delete the thread."),
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Thread Deleted",
      description: "The chat thread has been successfully deleted.",
    });
    return true;
  } catch (error) {
      console.error("Delete thread API error:", error);
      toast({
        title: "Network Error",
        description: "Could not connect to the server to delete the thread.",
        variant: "destructive",
      });
      return false;
  }
}