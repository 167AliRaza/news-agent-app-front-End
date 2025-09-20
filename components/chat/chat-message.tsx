import React from "react";
import { cn } from "@/lib/utils";

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
            : "bg-white/10 text-white rounded-bl-none"
        )}
      >
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}