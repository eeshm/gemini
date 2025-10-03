"use client";

import { Sparkles, MessageSquare, Zap, Shield } from "lucide-react";

export default function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-6">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="sm:text-4xl text-xl mb-2 font-bold text-foreground ">
          Welcome to Gemini Chat
        </h1>
        
        <p className="sm:text-lg text-sm text-muted-foreground mb-12">
          Start a new conversation or select an existing chat from the sidebar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-xl border border-border">
            <MessageSquare className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">
              Natural Conversations
            </h3>
            <p className="text-sm text-muted-foreground">
              Chat naturally with AI assistance
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border">
            <Zap className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">
              Fast Responses
            </h3>
            <p className="text-sm text-muted-foreground">
              Get instant AI-powered replies
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl border border-border">
            <Shield className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">
              Secure & Private
            </h3>
            <p className="text-sm text-muted-foreground">
              Your conversations stay private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}