import Link from "next/link";
import { Search } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-purple-600 p-1.5 rounded-lg text-white">
              <Search size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              FindLink
            </span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm mb-6">
            A secure semantic matching platform built to bridge the gap between missing person reports and found individuals.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/report/missing" className="hover:text-purple-400 transition">Report Missing</Link></li>
            <li><Link href="/report/found" className="hover:text-purple-400 transition">Report Found</Link></li>
            <li><Link href="/missing" className="hover:text-purple-400 transition">Public Board</Link></li>
            <li><Link href="/login" className="hover:text-purple-400 transition">Log In</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/privacy-policy" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-purple-400 transition">Terms of Service</Link></li>
            <li><Link href="/safety-guidelines" className="hover:text-purple-400 transition">Safety Guidelines</Link></li>
            <li><Link href="/contact-us" className="hover:text-purple-400 transition">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} FindLink. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Designed for Communities.</p>
      </div>
    </footer>
  );
}
