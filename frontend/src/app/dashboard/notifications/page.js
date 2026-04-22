"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Bell, 
  Trash2, 
  CheckCheck, 
  Loader2, 
  Search, 
  Info,
  Users,
  AlertCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Bell size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
            <p className="text-gray-500 mt-1">
              You have <span className="font-bold text-purple-600">{unreadCount}</span> unread updates.
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="btn-secondary py-2.5 px-6 flex items-center justify-center gap-2 text-sm"
          >
            <CheckCheck size={18} /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Bell size={40} className="opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Quiet for now</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            We will notify you here about match updates, case sightings, and platform news.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notif, index) => (
              <motion.div 
                key={notif._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className={`card p-6 flex items-start gap-5 transition-all ${
                  notif.isRead ? "bg-white opacity-80" : "bg-white border-l-4 border-l-purple-600 shadow-md ring-1 ring-purple-100"
                }`}
              >
                <div className={`p-4 rounded-2xl shrink-0 ${
                  notif.type === 'match' ? 'bg-indigo-50 text-indigo-600' : 
                  notif.type === 'system' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {notif.type === 'match' ? <Users size={24} /> : 
                   notif.type === 'system' ? <Info size={24} /> : <Search size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4 mb-2">
                    <h4 className="font-bold text-gray-900 line-clamp-1">{notif.title}</h4>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest flex items-center gap-1 shrink-0">
                      <Clock size={10} /> {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 text-left">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-4">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markRead(notif._id)}
                        className="text-xs font-bold text-purple-600 hover:text-purple-700 underline underline-offset-4"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif._id)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 group"
                    >
                      <Trash2 size={14} className="group-hover:scale-110 transition-transform" /> Delete
                    </button>
                  </div>
                </div>
                
                {!notif.isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0 mt-2"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
