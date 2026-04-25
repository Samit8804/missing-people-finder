"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function SignupPage() {
  const { signup, verifyOTP, googleLogin } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [otp, setOtp] = useState("");
  const googleClientId = (typeof window !== 'undefined') ? (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '') : '';
  const googleEnabled = !!googleClientId;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(formData);
      setStep(2); // Move to OTP step on success
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOTP(otp, formData.email);
      // Auth context will redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="card w-full shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-500 text-sm">We&apos;ve sent a 6-digit verification code to <span className="font-semibold">{formData.email}</span>.</p>
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
      </div>
    );
  }

  // Google Sign-In integration for signup
  useEffect(() => {
    if (!googleEnabled) return;
    const handleCredentialResponse = (response) => {
      const idToken = response?.credential;
      if (idToken) {
        // Sign up/login with Google using the same backend flow
        googleLogin(idToken).then(() => {}).catch(() => {});
      }
    };
    const loadGId = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId || '',
            callback: handleCredentialResponse,
          });
          const div = document.getElementById('googleSignInDiv');
          if (div) window.google.accounts.id.renderButton(div, { theme: 'outline', size: 'large' });
        } catch (e) {
          console.error('Google Sign-In initialization failed', e);
        }
      };
      document.body.appendChild(script);
    };
    if (typeof window !== 'undefined' && !window.google) {
      loadGId();
    } else if (typeof window !== 'undefined' && window.google) {
      try {
        window.google.accounts.id.initialize({ client_id: googleClientId || '', callback: handleCredentialResponse });
        const div = document.getElementById('googleSignInDiv');
        if (div) window.google.accounts.id.renderButton(div, { theme: 'outline', size: 'large' });
      } catch (e) {
        console.error(e);
      }
    }
  }, [googleEnabled]);

  return (
    <div className="card w-full shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h1>
        <p className="text-gray-500 text-sm">Join the FindLink community today.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (Optional)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-4 disabled:opacity-70"
        >
          {loading ? (
             <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Create Account <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {googleEnabled ? (
        <div className="mt-4 flex items-center justify-center">
          <div id="googleSignInDiv"></div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center mb-4">Google Sign-In is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID.</p>
      )}

      <div className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500">
          Log in
        </Link>
      </div>
    </div>
  );
}
