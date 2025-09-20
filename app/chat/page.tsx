"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon, Loader2 } from "lucide-react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessage } from "@/components/chat/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsSending(true);

    // Simulate API call for AI response
    try {
      // In a real application, you would send inputMessage to your AI backend here
      // and wait for a response.
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      const aiResponseText = `AI response to: "${newUserMessage.text}"`;
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      toast({
        title: "Chat Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Example of how to handle logout or navigate away
  const handleLogout = () => {
    // Perform logout logic (e.g., clear tokens)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/"); // Redirect to the login page
  };

  return (
    <ChatLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <h1 className="text-2xl font-normal text-white">New Chat</h1>
          <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="flex flex-col">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-white/50 text-lg">
                <MessageSquareTextIcon className="w-12 h-12 mb-4" />
                <p>Start a conversation...</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} />
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-auto">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-0 rounded-2xl h-12 text-base transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
            disabled={isSending}
          />
          <Button
            type="submit"
            className="bg-[#007aff] hover:bg-[#0056cc] text-white rounded-2xl h-12 w-12 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
            disabled={isSending || inputMessage.trim() === ""}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizonalIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
      <Toaster />
    </ChatLayout>
  );
}