"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ChatInterface from "@/components/chat/chat-interface";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return <ChatInterface chatroomId={params.id as string} />;
}