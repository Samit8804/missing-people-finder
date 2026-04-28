"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/lib/authContext";
import api from "@/lib/api";

function VerifyForm() {
  const { verifyOTP } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOTP(otp, email);
      // Auth context will redirect to dashboard on success
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Missing email. Please sign up again.</p>
        <Link href="/signup" className="text-purple-600 hover:underline mt-4 block">
          Go to Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="card w-full shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
        <p className="text-gray-500 text-sm">We&apos;ve sent a 6-digit verification code to <span className="font-semibold">{email}</span>.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 text-center">Verification Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-field text-center text-2xl tracking-widest font-mono"
            placeholder="000000"
            maxLength={6}
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/signup" className="text-sm text-gray-500 hover:text-purple-600">
          &larr; Back to Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin text-purple-600" size={32} />
        </div>
      }>
        <VerifyForm />
      </Suspense>
    </div>
  );
}