"use client";

import { useAuth } from "@/lib/authContext";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldCheck, DatabaseZap, HeartPulse, LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-purple-400">Verifying admin credentials...</div>;
  }

  const navItems = [
    { name: "System Overview", href: "/admin", icon: LayoutDashboard },
    { name: "All Reports", href: "/admin/reports", icon: DatabaseZap },
    { name: "Match Moderation", href: "/admin/matches", icon: HeartPulse },
    { name: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      {/* Admin Sidebar (Dark Theme) */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <div className="bg-red-500 p-1.5 rounded text-white"><ShieldCheck size={18} /></div>
            FindLink <span className="text-xs text-red-500 font-mono tracking-widest mt-1 ml-1 rounded border border-red-500/30 px-1 py-0.5 bg-red-500/10">ADMIN</span>
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
                  isActive 
                  ? "bg-gray-800 text-white shadow-inner" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-purple-400" : "text-gray-500"} />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 font-medium rounded-xl hover:bg-gray-900 transition-colors"
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
