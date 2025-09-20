"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareTextIcon, PanelLeftClose, PanelLeftOpen } from "lucide-react"; // Added PanelLeftClose, PanelLeftOpen
import { cn } from "@/lib/utils";
import { UserProfileDisplay } from "@/components/chat/user-profile-display"; // Import UserProfileDisplay

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col bg-black/30 backdrop-blur-sm border-r border-white/10 p-4 transition-all duration-300 ease-in-out",
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

        {/* Chat Threads Section */}
        <ScrollArea className="flex-1 pr-2 mb-4">
          <div className="space-y-2">
            {!isSidebarCollapsed && (
              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2 text-white/60" />
                New Chat
              </Button>
            )}
            {/* Placeholder for chat history */}
            {[...Array(5)].map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200"
              >
                <MessageSquareTextIcon className={cn("w-4 h-4", !isSidebarCollapsed && "mr-2 text-white/60")} />
                {!isSidebarCollapsed && `Chat ${i + 1}`}
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