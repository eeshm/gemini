"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import WelcomeScreen from "./welcome-screen";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay - now theme-aware */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 bg-background ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

{/* main content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-80" : "translate-x-0"
        }`}
      >
        <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Gemini Chat</h1>
          <div className="w-10" />
        </div>

        <WelcomeScreen />
      </div>
    </div>
  );
}