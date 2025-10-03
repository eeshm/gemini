"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore, Message } from "@/store/chatStore";
import { Send, ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ChatMessage from "./chat-message";
import toast from "react-hot-toast";

const AI_RESPONSES = [
  "That's an interesting question! Let me help you with that.",
  "I understand what you're asking. Here's what I think...",
  "Great point! From my perspective, I would say...",
  "Let me break that down for you in a clear way.",
  "That's a thoughtful query. Based on the information available...",
  "I'd be happy to help you with that! Here's my take...",
  "Excellent question! Let me provide some insights on that.",
  "I see where you're coming from. Here's how I would approach this...",
];

export default function ChatInterface({ chatroomId }: { chatroomId: string }) {
  const router = useRouter();
  const chatroom = useChatStore((state) => state.getChatroom(chatroomId));
  const addMessage = useChatStore((state) => state.addMessage);
  const updateChatroomTitle = useChatStore(
    (state) => state.updateChatroomTitle
  );

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const MESSAGES_PER_PAGE = 20;

  useEffect(() => {
    if (!chatroom) {
      router.push("/dashboard");
      return;
    }

    // Load initial messages
    const totalMessages = chatroom.messages.length;
    const startIndex = Math.max(0, totalMessages - MESSAGES_PER_PAGE);
    setDisplayedMessages(chatroom.messages.slice(startIndex));
    setHasMore(startIndex > 0);
  }, [chatroom, router]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages, isTyping]);

  const handleScroll = () => {
    if (!chatContainerRef.current || !chatroom) return;

    const { scrollTop } = chatContainerRef.current;

    // Load more messages when scrolled to top
    if (scrollTop === 0 && hasMore && !loadingMore) {
      loadMoreMessages();
    }
  };

  const loadMoreMessages = async () => {
    if (!chatroom || loadingMore) return;

    setLoadingMore(true);
    previousScrollHeightRef.current = chatContainerRef.current?.scrollHeight || 0;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentLength = displayedMessages.length;
    const totalMessages = chatroom.messages.length;
    const nextPage = page + 1;
    const startIndex = Math.max(0, totalMessages - nextPage * MESSAGES_PER_PAGE);
    const endIndex = totalMessages - currentLength;

    const olderMessages = chatroom.messages.slice(startIndex, endIndex);

    if (olderMessages.length > 0) {
      setDisplayedMessages((prev) => [...olderMessages, ...prev]);
      setPage(nextPage);
      setHasMore(startIndex > 0);

      // Maintain scroll position
      setTimeout(() => {
        if (chatContainerRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop =
            newScrollHeight - previousScrollHeightRef.current;
        }
      }, 0);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !imagePreview) return;

    const userMessage: Omit<Message, "id"> = {
      content: input.trim(),
      sender: "user",
      timestamp: Date.now(),
      imageUrl: imagePreview || undefined,
    };

    addMessage(chatroomId, userMessage);
    setDisplayedMessages((prev) => [...prev, { ...userMessage, id: Date.now().toString() }]);

    // Update chatroom title with first message
    if (chatroom && chatroom.messages.length === 0 && input.trim()) {
      const title = input.trim().slice(0, 30) + (input.length > 30 ? "..." : "");
      updateChatroomTitle(chatroomId, title);
    }

    setInput("");
    setImagePreview(null);
    setIsTyping(true);

    // Simulate AI response with throttle
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    const aiResponse: Omit<Message, "id"> = {
      content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      sender: "gemini",
      timestamp: Date.now(),
    };

    addMessage(chatroomId, aiResponse);
    setDisplayedMessages((prev) => [...prev, { ...aiResponse, id: Date.now().toString() }]);
    setIsTyping(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      toast.success("Image ready to send!");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chatroom) {
    return null;
  }

   return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-lg hover:bg-accent lg:hidden"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">{chatroom.title}</h2>
          <p className="text-xs text-muted-foreground">
            {displayedMessages.length} messages
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 chat-container"
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!hasMore && displayedMessages.length > 0 && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Beginning of conversation
          </div>
        )}

        {displayedMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-sm font-semibold">G</span>
            </div>
            <div className="bg-card rounded-2xl p-4 max-w-[80%] shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg" />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef} type="file" accept="image/*"
            onChange={handleImageUpload} className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-lg hover:bg-accent transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full px-4 py-3 bg-input rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring max-h-32 text-foreground"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() && !imagePreview}
            className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}