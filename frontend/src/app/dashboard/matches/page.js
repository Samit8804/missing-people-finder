"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get("/match/my");
      setMatches(res.data.matches || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.put(`/match/${id}/${action}`);
      // Refresh the list after action
      fetchMatches();
    } catch (err) {
      alert("Action failed. Try again.");
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Match Suggestions</h1>
        <p className="text-gray-500 mt-1">Review AI-suggested matches for your reports.</p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No matches found yet</h3>
          <p className="text-gray-500 mt-2">We will notify you the moment our system finds a potential match.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match._id} className="card bg-white p-6 relative overflow-hidden">
              <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase rounded-bl-lg text-white ${
                match.status === 'suggested' ? 'bg-amber-500' :
                match.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {match.status}
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center mt-2">
                
                {/* Left: Your Report */}
                <div className="flex-1 text-center md:text-left">
                  <div className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Your Report</div>
                  <h4 className="text-xl font-bold text-gray-900">{match.missingReport?.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Last Seen: {match.missingReport?.lastSeenLocation}</p>
                </div>

                {/* Center: Match Score */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">Match Score</div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <span className="text-2xl font-bold text-white">{match.matchScore}%</span>
                  </div>
                </div>

                {/* Right: Found Report */}
                <div className="flex-1 text-center md:text-right">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Found Report Details</div>
                  <p className="text-sm text-gray-600 italic">&quot;{match.foundReport?.description.substring(0, 80)}...&quot;</p>
                  <p className="text-sm font-medium text-gray-900 mt-2">Found in: {match.foundReport?.locationFound}</p>
                </div>
              </div>

              {match.status === 'suggested' && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
                  <button onClick={() => handleAction(match._id, 'reject')} className="btn-secondary flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50">
                    <XCircle size={18} /> Reject
                  </button>
                  <button onClick={() => handleAction(match._id, 'confirm')} className="btn-primary flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 border-none shadow-green-500/30">
                    <CheckCircle2 size={18} /> Confirm Match
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
