"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, MessageSquareTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-black/30 backdrop-blur-sm border-r border-white/10 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Chats</h2>
          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
            <PlusIcon className="w-5 h-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-2">
            {/* Placeholder for chat history */}
            {[...Array(5)].map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 transition-colors duration-200"
              >
                <MessageSquareTextIcon className="w-4 h-4 mr-2 text-white/60" />
                Chat {i + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] m-4 p-6 shadow-2xl">
        {children}
      </main>
    </div>
  );
}