"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function ReportNewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/report/new');
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-6 bg-white rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Create a New Report</h1>
        <p className="text-gray-600 mb-6">What type of report would you like to create?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/report/missing" className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
            <span className="font-semibold">Missing Report</span>
          </Link>
          <Link href="/report/found" className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
            <span className="font-semibold">Found Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
