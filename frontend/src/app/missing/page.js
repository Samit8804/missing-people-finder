"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Filter,
  Loader2,
  ArrowRight,
  Info,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function MissingBoardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/missing?search=${search}&status=${status}`);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchReports();
    }, 500); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [search, status]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Public Community Board</h1>
              <p className="text-lg text-gray-600">
                Help us find our missing members. Every detail, share, or sighting matters.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10 w-full md:w-64"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input-field pl-10 appearance-none bg-white min-w-[140px]"
                >
                  <option value="">All Statuses</option>
                  <option value="missing">Missing</option>
                  <option value="found">Likely Found</option>
                  <option value="matched">Matched</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-purple-600" size={40} />
            <p className="text-gray-500 font-medium">Updating the board...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Info size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No reports found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              We couldn&apos;t find any active reports matching your search criteria. Try using broader terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {reports.map((report, index) => (
              <motion.div
                key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group card bg-white overflow-hidden p-0 flex flex-col hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                  {report.photos && report.photos.length > 0 ? (
                    <img 
                      src={report.photos[0]} 
                      alt={report.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                      <User size={48} className="opacity-20" />
                      <span className="text-xs font-semibold uppercase tracking-widest opacity-40">No Photo</span>
                    </div>
                  )}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                    report.status === 'missing' ? 'bg-red-500 text-white' : 
                    report.status === 'matched' ? 'bg-green-500 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {report.status}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                      {report.name}
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">
                      Age: {report.age || "N/A"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={14} className="text-purple-500" />
                      <span className="line-clamp-1">{report.lastSeenLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} className="text-purple-500" />
                      <span>{new Date(report.lastSeenDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <p className="text-xs text-gray-400 mb-4 line-clamp-2 italic italic text-left">
                      &quot;{report.description}&quot;
                    </p>
                    <Link 
                      href={`/report/missing/${report._id}`}
                      className="flex items-center justify-between text-sm font-bold text-purple-600 group/link"
                    >
                      <span>View Full Details</span>
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
