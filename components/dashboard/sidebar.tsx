"use client";
import { useState, useMemo, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  LogOut,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const chatrooms = useChatStore((state) => state.chatrooms);
  const createChatroom = useChatStore((state) => state.createChatroom);
  const deleteChatroom = useChatStore((state) => state.deleteChatroom);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredChatrooms = useMemo(() => {
    if (!debouncedQuery) return chatrooms;
    return chatrooms.filter((room) =>
      room.title.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [chatrooms, debouncedQuery]);

  const handleCreateChatroom = () => {
    const title = `Chat ${chatrooms.length + 1}`;
    const id = createChatroom(title);
    toast.success("Chatroom created!");
    router.push(`/dashboard/chat/${id}`);
    onClose();
  };

  const handleDeleteChatroom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChatroom(id);
    toast.success("Chatroom deleted!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="border-r bg-background h-screen border-border flex flex-col text-foreground">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Gemini Chat</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative border-2 border-gray-600 rounded-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg  text-sm focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleCreateChatroom}
          className="w-full mt-3 flex items-center  border-2 border-gray-500 justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Chatrooms List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredChatrooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          filteredChatrooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                router.push(`/dashboard/chat/${room.id}`);
                onClose();
              }}
              className="group flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors mb-1"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {room.title}
                </span>
              </div>
              <button
                onClick={(e) => handleDeleteChatroom(room.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">
            {theme === "dark" ? "Light" : "Dark"} Mode
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}