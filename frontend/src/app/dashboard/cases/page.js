"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  FileSearch, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Search, 
  MapPin, 
  Calendar,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CasesPage() {
  const [missingReports, setMissingReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchCases = async () => {
    try {
      const [missingRes, foundRes] = await Promise.all([
        api.get("/missing/my"),
        api.get("/found/my")
      ]);
      setMissingReports(missingRes.data.reports || []);
      setFoundReports(foundRes.data.reports || []);
    } catch (err) {
      console.error("Failed to fetch user reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = async (id, type) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
    
    setDeleting(id);
    try {
      await api.delete(`/${type}/${id}`);
      fetchCases();
    } catch (err) {
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  const allReports = [
    ...missingReports.map(r => ({ ...r, type: 'missing' })),
    ...foundReports.map(r => ({ ...r, type: 'found' }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Active Cases</h1>
          <p className="text-gray-500 mt-1">Manage and track reports you have submitted to the platform.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/report/missing" className="btn-primary py-2.5 text-sm">Report Missing</Link>
          <Link href="/report/found" className="btn-secondary py-2.5 text-sm">Report Found</Link>
        </div>
      </div>

      {allReports.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <FileSearch size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No active cases found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto mb-8">
            You haven&apos;t submitted any missing or found person reports yet.
          </p>
          <Link href="/#features" className="text-purple-600 font-bold hover:underline">How reporting works →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allReports.map((report) => (
            <motion.div 
              key={report._id}
              layout
              className="card bg-white p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-purple-200 transition-all"
            >
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0 shadow-inner">
                {report.photos?.[0] ? (
                  <img src={report.photos[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Search size={32} />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      report.type === 'missing' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {report.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {report.type === 'missing' ? report.name : "Unidentified Person Found"}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      {report.type === 'missing' ? report.lastSeenLocation : report.locationFound}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(report.type === 'missing' ? report.lastSeenDate : report.dateFound).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                  <Link 
                    href={report.type === 'missing' ? `/report/missing/${report._id}` : "#"}
                    className="flex-1 sm:flex-none btn-secondary py-2 px-4 text-xs flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} /> Full View
                  </Link>
                  <button 
                    onClick={() => handleDelete(report._id, report.type)}
                    disabled={deleting === report._id}
                    className="flex-1 sm:flex-none p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {deleting === report._id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
