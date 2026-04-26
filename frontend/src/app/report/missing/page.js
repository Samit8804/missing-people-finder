"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Info, 
  Loader2, 
  ChevronRight,
  Upload,
  X
} from "lucide-react";

export default function ReportMissingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "unknown",
    description: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    isPublic: true,
    lat: "",
    lng: ""
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/report/missing");
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: user.name,
        contactEmail: user.email,
        contactPhone: user.phone || ""
      }));
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }
    
    const newImages = [...images, ...files];
    setImages(newImages);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
        setLocationLoading(false);
      },
      (err) => {
        console.error(err);
        alert("Unable to retrieve location");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    images.forEach(image => {
      data.append("photos", image);
    });

    try {
      const res = await api.post("/missing", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (res.data.success) {
        router.push("/dashboard?message=Report submitted successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-purple-600" size={32} /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-purple-600 hover:underline">
          <ChevronLeft size={16} /> Dashboard
        </Link>
      </div>
      
      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Report a Missing Person</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please provide as much detail as possible to help our matching engine and community identify the person.
            </p>
          </motion.div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl animate-shake">
              <div className="flex gap-3 items-center">
                <Info size={20} />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Basic Information */}
            <div className="card bg-white p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <User size={20} className="text-purple-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g. 25"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="input-field"
                  placeholder="Mention physical features, clothes wearing when last seen, etc."
                  required
                ></textarea>
              </div>
            </div>

            {/* Section 2: Last Seen Details */}
            <div className="card bg-white p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Last Seen Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-left">
                  <label className="block text-sm font-medium text-gray-700">Last Seen Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="date"
                      name="lastSeenDate"
                      value={formData.lastSeenDate}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Last Seen Location / Area</label>
                  <input
                    type="text"
                    name="lastSeenLocation"
                    value={formData.lastSeenLocation}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. Central Park, NY"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Pin precise location</p>
                      <p className="text-xs text-gray-500">Helps in accurate geographic matching</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={getMyLocation}
                    disabled={locationLoading}
                    className="w-full sm:w-auto btn-secondary bg-white py-2 text-sm flex items-center justify-center gap-2"
                  >
                    {locationLoading ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                    {formData.lat ? "Coordinates Captured" : "Get Current Location"}
                  </button>
                </div>
                {(formData.lat && formData.lng) && (
                  <p className="mt-2 text-xs text-center text-purple-600 font-medium">
                    Lat: {formData.lat.toFixed(6)} | Lng: {formData.lng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            {/* Section 3: Photos */}
            <div className="card bg-white p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Camera size={20} className="text-purple-600" />
                Photos
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all text-gray-400 hover:text-purple-600">
                    <Upload size={24} />
                    <span className="text-xs font-medium">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Tip: Clear, recent photos significantly increase the chances of identification.
              </p>
            </div>

            {/* Section 4: Contact & Visibility */}
            <div className="card bg-white p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
                <Phone size={20} className="text-purple-600" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Person Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Phone Number</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700 select-none">
                  Make this report public (visible on the community board)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-3 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Submitting Report...
                </>
              ) : (
                <>
                  Submit Report <ChevronRight size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
