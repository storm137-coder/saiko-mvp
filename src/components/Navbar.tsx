"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-950/95 shadow-md sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📚</span>
              <span className="text-xl font-bold text-teal-300">
                CampusShare
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/search"
              className="text-slate-300 hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Browse
            </Link>
            {session ? (
              <>
                <Link
                  href="/upload"
                  className="text-slate-300 hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  className="text-slate-300 hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-slate-300 hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-teal-300 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-300 hover:bg-teal-200 text-slate-900 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-slate-300 hover:text-teal-300 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/search"
              className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              Browse
            </Link>
            {session ? (
              <>
                <Link
                  href="/upload"
                  className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full text-left px-3 py-2 text-slate-100 hover:bg-slate-900 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-slate-300 hover:bg-slate-900 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-teal-300 font-medium hover:bg-slate-900 rounded-md"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
