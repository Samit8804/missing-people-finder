"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>Last updated: April 2026</p>
            <p>By using FindLink, you agree to the following terms. Please read them carefully.</p>
            <h2 className="text-xl font-semibold text-gray-900">Use of the Platform</h2>
            <p>FindLink is a platform for reporting and matching missing persons. You agree to use it lawfully, respectfully, and only for legitimate purposes.</p>
            <h2 className="text-xl font-semibold text-gray-900">Accuracy of Information</h2>
            <p>You are responsible for ensuring the information you submit is accurate and truthful. Misleading or false reports may result in account suspension.</p>
            <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
            <p>Your use of the platform is also governed by our Privacy Policy. Please review it alongside these terms.</p>
            <h2 className="text-xl font-semibold text-gray-900">Limitation of Liability</h2>
            <p>FindLink is a tool to facilitate connections. We are not responsible for outcomes resulting from matches made through the platform.</p>
            <h2 className="text-xl font-semibold text-gray-900">Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of the updated terms.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}