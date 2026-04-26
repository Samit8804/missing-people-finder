"use client";

import { useAuth } from "@/lib/authContext";
// SideDrawer integration removed to restore standard dashboard layout
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
    // Only redirect away if path starts with /dashboard (keep /missing and /report accessible)
    if (!path.startsWith('/dashboard')) {
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation (restored for desktop) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white"><ShieldCheck size={18} /></div>
            FindLink
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive ? "bg-purple-50 text-purple-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-purple-600" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
