"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const googleClientId = (typeof window !== 'undefined') ? (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '') : '';
  const googleEnabled = !!googleClientId;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In integration
  useEffect(() => {
    if (!googleEnabled) return;
      // Credential response handler must be in scope before initialize
    const handleCredentialResponse = (response) => {
      // response.credential is a JWT id_token
      const idToken = response?.credential;
      if (idToken) {
        // Use auth context to login with Google
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
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            callback: handleCredentialResponse,
          });
          const div = document.getElementById('googleSignInDiv');
          if (div) {
            window.google.accounts.id.renderButton(div, { theme: 'outline', size: 'large' });
          }
          if (window?.google?.accounts?.id?.prompt) {
            window.google.accounts.id.prompt({ prompt: 'select_account' });
          }
        } catch (e) {
          console.error('Google Sign-In initialization failed', e);
        }
      };
      document.body.appendChild(script);
    };
    if (typeof window !== 'undefined' && !window.google) {
      loadGId();
    } else if (typeof window !== 'undefined' && window.google) {
      // Google lib already loaded; render button
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        });
        const div = document.getElementById('googleSignInDiv');
        if (div) window.google.accounts.id.renderButton(div, { theme: 'outline', size: 'large' });
      } catch (e) {
        console.error(e);
      }
    }
    // Cleanup not strictly necessary here
  }, [googleEnabled]);

  return (
    <div className="card w-full shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm">Enter your details to access your account.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-purple-600 hover:text-purple-500">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="••••••••"
              required
            />
          </div>
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
              Sign in <ArrowRight size={18} />
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
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-purple-600 hover:text-purple-500">
          Sign up now
        </Link>
      </div>
    </div>
  );
}
