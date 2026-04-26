"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import api from "@/lib/api";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/contact", form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500 mb-8">Have a question or feedback? We'd love to hear from you.</p>

          {sent ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-gray-600">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="input-field" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" required className="input-field" />
              </div>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required className="input-field" />
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your message..." required rows={5} className="input-field resize-none" />
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}