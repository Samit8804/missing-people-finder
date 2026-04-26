"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SafetyGuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Safety Guidelines</h1>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>Your safety is our priority. Please follow these guidelines when using FindLink.</p>
            <h2 className="text-xl font-semibold text-gray-900">Protect Your Identity</h2>
            <p>When reporting or responding to a sighting, avoid sharing personal identifiers such as your home address, workplace, or financial information publicly.</p>
            <h2 className="text-xl font-semibold text-gray-900">Meet Safely</h2>
            <p>If you arrange to meet someone in person, always choose a public, well-lit location and consider bringing a trusted friend or family member with you.</p>
            <h2 className="text-xl font-semibold text-gray-900">Verify Before Sharing</h2>
            <p>Be cautious of individuals who request money or personal financial information. FindLink will never ask you for payment to submit or view reports.</p>
            <h2 className="text-xl font-semibold text-gray-900">Report Suspicious Activity</h2>
            <p>If you encounter suspicious behavior or someone making false claims, please report it to us immediately at <a href="mailto:support@findlink.app" className="text-purple-600 hover:underline">support@findlink.app</a>.</p>
            <h2 className="text-xl font-semibold text-gray-900">Community Responsibility</h2>
            <p>Help keep the community safe by only submitting accurate information and treating all members with respect and dignity.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}