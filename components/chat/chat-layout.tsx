"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareTextIcon, PanelLeftClose, PanelLeftOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileDisplay } from "@/components/chat/user-profile-display";
import { fetchUserThreads } from "@/lib/api"; // Import fetchUserThreads

interface ChatLayoutProps {
  children: React.ReactNode;
  currentThreadId: string | null;
  setCurrentThreadId: (threadId: string | null) => void;
}

interface Thread {
  thread_id: string;
  title: string;
}

export function ChatLayout({ children, currentThreadId, setCurrentThreadId }: ChatLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const loadThreads = async () => {
    setIsLoadingThreads(true);
    const fetchedThreads = await fetchUserThreads();
    if (fetchedThreads) {
      setThreads(fetchedThreads);
    }
    setIsLoadingThreads(false);
  };

  useEffect(() => {
    loadThreads();
  }, [currentThreadId]); // Reload threads when a new thread is created/selected

  const handleNewChat = () => {
    setCurrentThreadId(null); // Reset current thread to start a new one
  };

  const handleThreadClick = (threadId: string) => {
    setCurrentThreadId(threadId); // Set the clicked thread as current
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-full bg-black/30 backdrop-blur-sm border-r border-white/10 p-4 transition-all duration-300 ease-in-out", // Added h-full
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-semibold text-white">Chats</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="mb-4">
          {!isSidebarCollapsed && (
            <Button
              variant="ghost"
              className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200"
              onClick={handleNewChat}
            >
              <PlusIcon className="w-4 h-4 mr-2 text-white/60" />
              New Chat
            </Button>
          )}
          {isSidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="w-full justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              onClick={handleNewChat}
            >
              <PlusIcon className="w-5 h-5 text-white/60" />
            </Button>
          )}
        </div>

        {/* Chat Threads Section */}
        <ScrollArea className="flex-1 pr-2 mb-4">
          <div className="space-y-2">
            {isLoadingThreads ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            ) : threads.length === 0 ? (
              !isSidebarCollapsed && <p className="text-white/50 text-sm text-center">No threads yet.</p>
            ) : (
              threads.map((thread) => (
                <Button
                  key={thread.thread_id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200",
                    currentThreadId === thread.thread_id && "bg-white/10 text-white"
                  )}
                  onClick={() => handleThreadClick(thread.thread_id)}
                >
                  <MessageSquareTextIcon className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2 text-white/60")} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{thread.title || `Untitled Chat ${thread.thread_id.substring(0, 4)}`}</span>
                  )}
                </Button>
              ))
            )}
            {/* Temporary placeholder threads to ensure scrollbar visibility */}
            {!isLoadingThreads && threads.length > 0 && [...Array(15)].map((_, i) => (
              <Button
                key={`placeholder-${i}`}
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200"
              >
                <MessageSquareTextIcon className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2 text-white/60")} />
                {!isSidebarCollapsed && `Placeholder Chat ${i + 1}`}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile Display - Fixed at the bottom */}
        <div className={cn("mt-auto", isSidebarCollapsed && "flex justify-center")}>
          <UserProfileDisplay isCollapsed={isSidebarCollapsed} />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] m-4 p-6 shadow-2xl">
        {children}
      </main>
    </div>
  );
}