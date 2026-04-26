"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, FileSearch, Bell, LogOut, ShieldCheck } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Route guard: prevent leaving the dashboard space unless the user logs out
  // Allow navigation to dashboard-related routes and public board/report areas
  useEffect(() => {
    if (loading || !user) return;
    const path = pathname || '';
    const allowed = path.startsWith('/dashboard') || path.startsWith('/missing') || path.startsWith('/report');
    if (!allowed) {
      router.push('/dashboard');
    }
  }, [pathname, user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-purple-600">Loading your space...</div>;
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Active Cases", href: "/dashboard/cases", icon: FileSearch },
    { name: "Match Suggestions", href: "/dashboard/matches", icon: Users },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Public Board", href: "/missing", icon: FileSearch },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content only; left sidebar removed per requirement */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
