"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { useAuth } from "@/lib/authContext";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  ArrowLeft, 
  Loader2,
  Share2,
  AlertTriangle,
  Clock,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function MissingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sightingModal, setSightingModal] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/missing/${id}`);
        setReport(res.data.report);
      } catch (err) {
        setError("Report not found or has been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center max-w-md px-4">
            <AlertTriangle size={64} className="text-amber-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notice</h1>
            <p className="text-gray-600 mb-8">{error || "Something went wrong."}</p>
            <Link href="/missing" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft size={18} /> Back to Public Board
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Top Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/missing" className="flex items-center gap-2 text-gray-600 hover:text-purple-600 font-medium transition-colors">
              <ArrowLeft size={20} /> Back to Board
            </Link>
            <button 
              onClick={() => {
                navigator.share({
                  title: `FindLink: Missing Person - ${report.name}`,
                  text: `Help us find ${report.name}, last seen in ${report.lastSeenLocation}.`,
                  url: window.location.href
                }).catch(() => alert("Shared copy link"));
              }}
              className="btn-secondary py-2 flex items-center gap-2"
            >
              <Share2 size={18} /> Share Case
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Gallery & Main Image */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-white p-0 overflow-hidden border-none shadow-2xl"
              >
                <div className="aspect-video sm:aspect-square md:aspect-video relative bg-gray-100">
                  {report.photos && report.photos.length > 0 ? (
                    <img 
                      src={report.photos[0]} 
                      alt={report.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                      <User size={80} className="opacity-10" />
                      <span className="font-semibold uppercase tracking-widest text-sm">No Photo Available</span>
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-xs font-bold text-gray-900 border border-gray-100">
                      Case #{report._id.substring(18).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-xs font-bold border border-gray-100 ${
                      report.status === 'missing' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Thumbnails if more than 1 photo */}
              {report.photos && report.photos.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {report.photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-purple-500 transition-colors">
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="card bg-white p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Narrative</h2>
                <div className="prose prose-purple max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap text-left">
                    {report.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Sidebar Info */}
            <div className="space-y-6">
              <div className="card bg-white p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{report.name}</h1>
                  <p className="text-purple-600 font-bold text-lg">Age: {report.age || "Unknown"}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Seen Location</p>
                      <p className="text-gray-900 font-semibold">{report.lastSeenLocation}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Seen Date</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(report.lastSeenDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reported On</p>
                      <p className="text-gray-900 font-semibold">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-10 border-t border-gray-100">
                  <button
                    onClick={() => setSightingModal(true)}
                    disabled={!user}
                    title={user ? "Report a Sighting" : "Login to report a sighting"}
                    className="w-full btn-primary py-4 mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle size={20} /> Report a Sighting
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    {user
                      ? "Your sighting report will be sent directly to the family."
                      : "Please log in to report a sighting."}
                  </p>
                </div>
              </div>

              {/* Verified Reporter Section */}
              <div className="card bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-indigo-200" size={24} />
                  <h3 className="font-bold text-lg">Contact Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-indigo-300" />
                    <span>{report.contactName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-indigo-300" />
                    <a href={`tel:${report.contactPhone}`} className="hover:underline">{report.contactPhone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-indigo-300" />
                    <a href={`mailto:${report.contactEmail}`} className="hover:underline text-sm truncate">{report.contactEmail}</a>
                  </div>
                </div>
                
                <div className="mt-8 p-3 bg-white/10 rounded-xl text-xs text-indigo-100 leading-relaxed border border-white/10">
                  Please reach out only if you have genuine information. Harassment is strictly prohibited and reported.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sighting / Contact Modal */}
      <ContactModal
        reportId={id}
        isOpen={sightingModal}
        onClose={() => setSightingModal(false)}
        isLoggedIn={!!user}
      />
      
      <Footer />
    </div>
  );
}
