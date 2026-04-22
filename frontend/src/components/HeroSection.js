"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, Upload } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden -z-10 bg-white">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-200/50 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/50 blur-3xl opacity-50 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm mb-6 border border-purple-200">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
              </span>
              Modern Missing Persons Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8"
          >
            Bringing loved ones <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              back home, faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            A smart, unified platform connecting missing person reports with found cases. 
            Utilizing data-driven matching algorithms to assist identification securely.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/report/missing" className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary text-lg px-8 py-4">
              <Search size={20} />
              Report Missing
            </Link>
            <Link href="/report/found" className="w-full sm:w-auto flex items-center justify-center gap-2 btn-secondary text-lg px-8 py-4 bg-white">
              <Upload size={20} />
              Report Found
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-sm text-gray-500 flex items-center justify-center gap-2"
          >
            <span>You can also</span>
            <Link href="/missing" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 group">
              browse the public board <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Dashboard UI mockup preview inside Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 mx-auto max-w-5xl rounded-2xl md:rounded-[2.5rem] bg-white/40 p-2 md:p-4 backdrop-blur-2xl shadow-2xl shadow-purple-900/10 border border-white/50"
        >
          <div className="bg-gray-50 rounded-xl md:rounded-[2rem] overflow-hidden border border-gray-100/50 shadow-inner">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto w-1/2 h-6 bg-gray-100 rounded-md"></div>
            </div>
            
            <div className="p-6 md:p-10 grid md:grid-cols-3 gap-6 bg-gray-50/50">
              <div className="md:col-span-2 space-y-6">
                 <div className="h-40 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
                   <div className="w-1/3 h-6 bg-gray-200 rounded-md"></div>
                   <div className="space-y-2">
                     <div className="w-3/4 h-4 bg-gray-100 rounded-md"></div>
                     <div className="w-1/2 h-4 bg-gray-100 rounded-md"></div>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 mb-3"></div>
                      <div className="w-full h-3 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="w-10 h-10 rounded-full bg-purple-50 mb-3"></div>
                      <div className="w-full h-3 bg-gray-100 rounded-md"></div>
                    </div>
                 </div>
              </div>
              <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                 <div className="w-1/2 h-5 bg-gray-200 rounded-md mb-2"></div>
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="w-full h-3 bg-gray-200 rounded-md"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded-md"></div>
                      </div>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
