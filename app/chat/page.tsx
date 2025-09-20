"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon, Loader2, MessageSquareTextIcon } from "lucide-react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { ChatMessage } from "@/components/chat/chat-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { logoutUser, sendMessageToAgent, fetchThreadMessages, fetchUserThreads, deleteThread } from "@/lib/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface Thread {
  thread_id: string;
  title: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const router = useRouter();

  const loadThreads = async () => {
    setIsLoadingThreads(true);
    const fetchedThreads = await fetchUserThreads();
    if (fetchedThreads) {
      setThreads(fetchedThreads.reverse());
    }
    setIsLoadingThreads(false);
  };

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    const loadThreadConversation = async () => {
      if (currentThreadId && !currentThreadId.startsWith('local-')) { // Don't fetch for local threads
        setIsLoadingMessages(true);
        setMessages([]);
        const fetchedMessages = await fetchThreadMessages(currentThreadId);
        if (fetchedMessages) {
          const formattedMessages: Message[] = fetchedMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.isUser,
          }));
          setMessages(formattedMessages);
        }
        setIsLoadingMessages(false);
      } else if (!currentThreadId) {
        setMessages([]);
      }
    };

    loadThreadConversation();
  }, [currentThreadId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    const userQueryText = inputMessage;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userQueryText,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsSending(true);

    let threadIdToUse = currentThreadId;
    let isNewChat = !currentThreadId;
    let localThreadId: string | null = null;

    if (isNewChat) {
      localThreadId = `local-${Date.now()}`;
      const newThread: Thread = {
        thread_id: localThreadId,
        title: userQueryText.substring(0, 30) + (userQueryText.length > 30 ? '...' : ''),
      };
      setThreads(prev => [newThread, ...prev]);
      setCurrentThreadId(localThreadId);
      threadIdToUse = null; // Send null to API to create new thread
    }

    try {
      const response = await sendMessageToAgent(
        userQueryText,
        threadIdToUse,
        isNewChat
      );

      if (response) {
        const aiResponseText = typeof response.result === 'string'
          ? response.result
          : JSON.stringify(response.result, null, 2);

        const newAiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, newAiMessage]);

        if (response.is_new_thread && localThreadId) {
          // Update local thread with real ID from backend
          setThreads(prev => prev.map(t => 
            t.thread_id === localThreadId ? { ...t, thread_id: response.thread_id } : t
          ));
          setCurrentThreadId(response.thread_id);
          // After a new thread is successfully created, reload all threads to get the server-generated title
          await loadThreads();
        }
      }
    } catch (error) {
      console.error("Error sending message to AI:", error);
      toast({
        title: "Chat Error",
        description: "Failed to get a response from the AI. Please try again.",
        variant: "destructive",
      });
      // If it was a new chat that failed, remove the local thread
      if (localThreadId) {
        setThreads(prev => prev.filter(t => t.thread_id !== localThreadId));
        setCurrentThreadId(null);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser(router);
  };

  const handleNewChat = () => {
    setCurrentThreadId(null);
    setMessages([]);
  };

  const handleThreadClick = (threadId: string) => {
    setCurrentThreadId(threadId);
  };

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      const success = await deleteThread(threadId);
      if (success) {
        if (currentThreadId === threadId) {
          setCurrentThreadId(null);
        }
        await loadThreads();
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ChatLayout
        currentThreadId={currentThreadId}
        threads={threads}
        isLoadingThreads={isLoadingThreads}
        onNewChat={handleNewChat}
        onThreadClick={handleThreadClick}
        onDeleteThread={handleDeleteThread}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <h1 className="text-2xl font-normal text-white">
              {currentThreadId ? `Thread: ${currentThreadId.substring(0, 8)}...` : "New Chat"}
            </h1>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="flex flex-col">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 text-lg">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 text-lg">
                  <MessageSquareTextIcon className="w-12 h-12 mb-4" />
                  <p>Start a conversation...</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg.text} isUser={msg.isUser} />
                ))
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-auto">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 rounded-2xl h-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
              disabled={isSending || isLoadingMessages}
            />
            <Button
              type="submit"
              className="bg-[#007aff] hover:bg-[#0056cc] text-white rounded-2xl h-12 w-12 flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95"
              disabled={isSending || inputMessage.trim() === "" || isLoadingMessages}
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
    </div>
  );
}