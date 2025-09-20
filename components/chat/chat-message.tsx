"use client";

import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] p-3 rounded-xl shadow-md",
          isUser
            ? "bg-[#007aff] text-white rounded-br-none"
            : "bg-white/10 text-white rounded-bl-none",
          // Add styling for markdown elements
          "prose prose-invert prose-sm max-w-none" // Tailwind Typography for basic markdown styling
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}