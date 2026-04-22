"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Plus, Users, FileSearch, CheckCircle2 } from "lucide-react";

export default function DashboardClient() {
  const [stats, setStats] = useState({ missing: 0, found: 0, matches: 0 });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missingRes, matchesRes] = await Promise.all([
          api.get("/missing/my"),
          api.get("/match/my"),
        ]);
        setStats({
          missing: missingRes.data.count || 0,
          found: 0, 
          matches: matchesRes.data.count || 0
        });
        setReports(missingRes.data.reports || []);
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Manage your active cases and review new matches.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/report/missing" className="btn-primary py-2.5 text-sm flex items-center gap-2">
            <Plus size={18} /> New Report
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white hover:-translate-y-1 transition-transform border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Your Missing Reports</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.missing}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <FileSearch size={24} />
            </div>
          </div>
        </div>
        
        <div className="card bg-white hover:-translate-y-1 transition-transform border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Suggested Matches</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.matches}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-white hover:-translate-y-1 transition-transform border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved Cases</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Recent Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((report) => (
              <div key={report._id} className="card bg-white flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  {report.photos?.[0] ? (
                    <img src={report.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{report.name}</h4>
                  <p className="text-xs text-gray-500 truncate">{report.lastSeenLocation}</p>
                </div>
                <Link 
                  href={`/report/missing/${report._id}`}
                  className="text-purple-600 text-sm font-bold hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
          {reports.length > 4 && (
            <Link href="/dashboard/cases" className="text-sm text-purple-600 font-medium hover:underline block text-center mt-4">
              View all cases
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Create your first report</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Whether you are looking for someone or you have found someone, start by submitting a detailed report to our matching engine.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/report/missing" className="btn-primary">Report Missing Person</Link>
            <Link href="/report/found" className="btn-secondary">Report Found Person</Link>
          </div>
        </div>
      )}
    </div>
  );
}

