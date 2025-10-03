import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "gemini";
  timestamp: number;
  imageUrl?: string;
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

interface ChatState {
  chatrooms: Chatroom[];
  createChatroom: (title: string) => string;
  deleteChatroom: (id: string) => void;
  addMessage: (chatroomId: string, message: Omit<Message, "id">) => void;
  getChatroom: (id: string) => Chatroom | undefined;
  updateChatroomTitle: (id: string, title: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      createChatroom: (title: string) => {
        const id = Date.now().toString();
        const newChatroom: Chatroom = {
          id,
          title,
          createdAt: Date.now(),
          messages: [],
        };
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
        return id;
      },
      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter((room) => room.id !== id),
        }));
      },
      addMessage: (chatroomId: string, message: Omit<Message, "id">) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === chatroomId
              ? {
                  ...room,
                  messages: [
                    ...room.messages,
                    { ...message, id: Date.now().toString() },
                  ],
                }
              : room
          ),
        }));
      },
      getChatroom: (id: string) => {
        return get().chatrooms.find((room) => room.id === id);
      },
      updateChatroomTitle: (id: string, title: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.map((room) =>
            room.id === id ? { ...room, title } : room
          ),
        }));
      },
    }),
    {
      name: "chat-storage",
    }
  )
);
