"use client";

import { useState } from "react";
import { X, Send, Shield, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import Link from "next/link";

export default function ContactModal(props) {
  const { reportId, isOpen, onClose, isLoggedIn } = props;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadySent, setAlreadySent] = useState(false);

  const handleContact = async () => {
    setLoading(true);
    setErrorMsg("");
    setAlreadySent(false);
    try {
      await api.post("/missing/" + reportId + "/contact");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send contact. Please try again.";
      if (msg.includes("already contacted") || msg.includes("already exists")) {
        setAlreadySent(true);
        setErrorMsg("");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    setSuccess(false);
    setErrorMsg("");
    setAlreadySent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">I Found This Person</h2>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Contact Sent!
            </h3>
            <p className="text-gray-600">
              The reporter has been notified. They will review and contact you.
            </p>
          </div>
        ) : alreadySent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Already Contacted
            </h3>
            <p className="text-gray-600">
              You have already sent a contact request for this case. The reporter has been notified.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 w-full bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}
            <div className="text-center py-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
              <Shield className="mx-auto mb-3 text-purple-600" size={48} />
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                Your identity will remain protected. Reporter sees anonymous notification first.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Send size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">
                  Email notification sent
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Send size={18} className="text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">
                  Match created for review
                </span>
              </div>
            </div>

            <div className="pt-4">
              {!isLoggedIn ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Please{" "}
                    <Link
                      href="/login"
                      className="text-purple-600 hover:underline font-medium"
                    >
                      log in
                    </Link>{" "}
                    to contact reporters.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleContact}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Contact Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

