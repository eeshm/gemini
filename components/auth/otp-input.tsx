"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, ArrowLeft, KeyRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

export default function OTPInput({
  phoneNumber,
  onBack,
}: {
  phoneNumber: string;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleFormSubmit = async (data: OTPFormData) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    login(phoneNumber);
    toast.success("Login successful!");
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Change number
      </button>

      <p className="text-sm text-muted-foreground mb-6">
        Enter the 6-digit code sent to{" "}
        <strong className="text-foreground">{phoneNumber}</strong>
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            OTP Code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              {...register("otp")}
              type="text"
              maxLength={6}
              placeholder="000000"
              className="w-full pl-10 pr-4 py-3 border bg-input border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground text-center text-2xl tracking-widest"
            />
          </div>
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Any 6-digit number will work for this demo
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify & Login"
          )}
        </button>
      </form>
    </div>
  );
}