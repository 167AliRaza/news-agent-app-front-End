"use client";

import React, { useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth-utils";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

interface UserProfileDisplayProps {
  isCollapsed?: boolean;
}

export function UserProfileDisplay({ isCollapsed = false }: UserProfileDisplayProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUserName(authData.name);
      setUserEmail(authData.email);
    }
  }, []);

  if (!userName && !userEmail) {
    return null; // Or a loading state/skeleton
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const profileContent = (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="size-10 border border-white/20">
        <AvatarFallback className="bg-white/10 text-white/80 text-sm font-medium">
          {userName ? getInitials(userName) : <UserIcon className="size-5" />}
        </AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="flex flex-col">
          {userName && <p className="text-white text-lg font-medium">{userName}</p>}
          {userEmail && <p className="text-white/60 text-sm">{userEmail}</p>}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {profileContent}
        </TooltipTrigger>
        <TooltipContent side="right">
          {userName && <p className="font-medium">{userName}</p>}
          {userEmail && <p className="text-muted-foreground text-sm">{userEmail}</p>}
        </TooltipContent>
      </Tooltip>
    );
  }

  return profileContent;
}