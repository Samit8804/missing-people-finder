"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900 to-indigo-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713619-24c711fe7878?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-xl text-purple-600 shadow-xl">
              <Search size={28} className="stroke-[2.5]" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">
              FindLink
            </span>
          </Link>

          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Connecting Missing Reports with Found Hope.
          </h2>
          <p className="text-lg text-purple-100/80 mb-8 max-w-md leading-relaxed">
            Join the community database accelerating the reunification process through advanced data matching and human cooperation.
          </p>

          <div className="flex gap-4 items-center">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-2 border-purple-900 bg-purple-${i*200} bg-gray-300`}></div>
              ))}
            </div>
            <div className="text-sm font-medium text-white">
              Trusted by <span className="font-bold text-purple-300">500+</span> volunteers
            </div>
          </div>
        </div>
      </div>

      {/* Right side authentication forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
