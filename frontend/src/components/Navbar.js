"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-xl text-white shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-0.5">
            <Search size={22} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
            Find<span className="text-purple-600">Link</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#how-it-works" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
            How it Works
          </Link>
          <Link href="/#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
            Features
          </Link>
          <Link href="/missing" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
            Public Board
          </Link>
          
          <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary py-2.5 px-6">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100"
        >
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link href="/#how-it-works" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600">
              How it Works
            </Link>
            <Link href="/#features" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600">
              Features
            </Link>
            <Link href="/missing" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600">
              Public Board
            </Link>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Link href="/login" className="block px-3 py-3 rounded-xl text-center text-base font-medium text-gray-700 border border-gray-200">
                Log in
              </Link>
              <Link href="/signup" className="block px-3 py-3 rounded-xl text-center text-base font-medium text-white bg-purple-600">
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
