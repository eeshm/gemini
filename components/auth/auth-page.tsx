"use client";

import { useState } from "react";
import PhoneInput from "./phone-input";
import OTPInput from "./otp-input";
import { Sparkles } from "lucide-react";

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone);
    setStep("otp");
  };

  const handleBack = () => {
    setStep("phone");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gemini Chat
          </h1>
          <p className="text-muted-foreground">
            Sign in to start your AI conversations
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          {step === "phone" ? (
            <PhoneInput onSubmit={handlePhoneSubmit} />
          ) : (
            <OTPInput phoneNumber={phoneNumber} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
  );
}