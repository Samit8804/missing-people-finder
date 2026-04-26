"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>Last updated: April 2026</p>
            <p>FindLink is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our platform.</p>
            <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, phone number, and any details you share about missing persons or found individuals.</p>
            <h2 className="text-xl font-semibold text-gray-900">How We Use Your Information</h2>
            <p>Your information is used to facilitate matches between missing person reports and found individuals, notify reporters of potential matches, and improve our platform.</p>
            <h2 className="text-xl font-semibold text-gray-900">Data Protection</h2>
            <p>We implement industry-standard security measures to protect your data. We never sell your personal information to third parties.</p>
            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@findlink.app" className="text-purple-600 hover:underline">support@findlink.app</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}