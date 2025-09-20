"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareTextIcon, PanelLeftClose, PanelLeftOpen, Loader2, Trash2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileDisplay } from "@/components/chat/user-profile-display";

interface Thread {
  thread_id: string;
  title: string;
}

interface ChatLayoutProps {
  children: React.ReactNode;
  currentThreadId: string | null;
  threads: Thread[];
  isLoadingThreads: boolean;
  onNewChat: () => void;
  onThreadClick: (threadId: string) => void;
  onDeleteThread: (threadId: string) => void;
}

export function ChatLayout({ 
  children, 
  currentThreadId, 
  threads, 
  isLoadingThreads,
  onNewChat,
  onThreadClick,
  onDeleteThread
}: ChatLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col h-full bg-black/30 backdrop-blur-sm border-r border-white/10 p-4 transition-all duration-300 ease-in-out",
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
              onClick={onNewChat}
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
              onClick={onNewChat}
            >
              <PlusIcon className="w-5 h-5 text-white/60" />
            </Button>
          )}
        </div>

        {/* Chat Threads Section */}
        <ScrollArea className="flex-1 -mr-4 pr-4 mb-4">
          <div className="space-y-2">
            {isLoadingThreads ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-white/50" />
              </div>
            ) : threads.length === 0 ? (
              !isSidebarCollapsed && <p className="text-white/50 text-sm text-center">No threads yet.</p>
            ) : (
              threads.map((thread) => (
                <div 
                  key={thread.thread_id} 
                  className="relative flex items-center group"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (window.confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
                      onDeleteThread(thread.thread_id);
                    }
                  }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200 pr-11",
                      currentThreadId === thread.thread_id && "bg-white/10 text-white"
                    )}
                    onClick={() => onThreadClick(thread.thread_id)}
                  >
                    <MessageSquareTextIcon className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2 text-white/60")} />
                    {!isSidebarCollapsed && (
                      <span className="truncate">{thread.title || `Untitled Chat ${thread.thread_id.substring(0, 4)}`}</span>
                    )}
                  </Button>
                  {!isSidebarCollapsed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110 z-10"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent thread selection when deleting
                        onDeleteThread(thread.thread_id);
                      }}
                      aria-label="Delete thread"
                      title="Delete thread (or right-click)"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
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