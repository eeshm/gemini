"use client";

import { Message } from "@/store/chatStore";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  const isUser = message.sender === "user";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
      onMouseEnter={() => setShowCopy(true)}
      onMouseLeave={() => setShowCopy(false)}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-secondary" : "bg-primary"
        }`}
      >
        <span className={`text-sm font-semibold ${isUser ? "text-secondary-foreground" : "text-primary-foreground"}`}>
          {isUser ? "U" : "G"}
        </span>
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[80%]`}>
        <div
          className={`relative group rounded-2xl p-4 shadow-sm ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground"
          }`}
        >
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="rounded-lg mb-2 max-w-full h-auto"
            />
          )}
          
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Copy Button */}
          {showCopy && message.content && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 p-2 rounded-full shadow-lg transition-opacity bg-accent hover:bg-accent/80"
            >
              {copied ? (
                <Check className="w-3 h-3 text-accent-foreground" />
              ) : (
                <Copy className="w-3 h-3 text-accent-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {time}
        </span>
      </div>
    </div>
  );
}