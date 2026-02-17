"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ResourceCard from "../components/ResourceCard";

export default function HomePage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources?limit=6&sort=latest")
      .then((res) => res.json())
      .then((data) => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Share Knowledge,
              <br />
              <span className="text-teal-300">Ace Together</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Upload, discover, and share academic resources with students
              across campuses. Notes, question papers, solutions, and more — all
              in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="bg-slate-100 text-slate-900 hover:bg-white px-8 py-3 rounded-lg font-semibold text-lg transition shadow-lg"
              >
                Browse Resources
              </Link>
              {!session && (
                <Link
                  href="/register"
                  className="bg-teal-300 hover:bg-teal-200 text-slate-900 px-8 py-3 rounded-lg font-semibold text-lg transition border-2 border-teal-200"
                >
                  Get Started Free
                </Link>
              )}
              {session && (
                <Link
                  href="/upload"
                  className="bg-teal-300 hover:bg-teal-200 text-slate-900 px-8 py-3 rounded-lg font-semibold text-lg transition border-2 border-teal-200"
                >
                  Upload Resource
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-teal-300">📝</p>
              <p className="text-lg font-semibold text-slate-100 mt-1">Notes</p>
              <p className="text-sm text-slate-400">Lecture & study notes</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-300">📋</p>
              <p className="text-lg font-semibold text-slate-100 mt-1">
                Question Papers
              </p>
              <p className="text-sm text-slate-400">Past exam papers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-300">✅</p>
              <p className="text-lg font-semibold text-slate-100 mt-1">
                Solutions
              </p>
              <p className="text-sm text-slate-400">Verified answers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-300">📊</p>
              <p className="text-lg font-semibold text-slate-100 mt-1">
                Projects
              </p>
              <p className="text-sm text-slate-400">Reports & references</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Resources */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
              Recent Resources
            </h2>
            <p className="text-slate-400 mt-1">
              Freshly uploaded academic materials
            </p>
          </div>
          <Link
            href="/search"
            className="text-teal-300 hover:text-teal-200 font-medium text-sm"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-900 rounded-xl border border-slate-800 p-5 animate-pulse"
              >
                <div className="h-4 bg-slate-800 rounded w-1/3 mb-3"></div>
                <div className="h-5 bg-slate-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-slate-800 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-slate-400 text-lg">
              No resources yet. Be the first to upload!
            </p>
            <Link
              href="/upload"
              className="inline-block mt-4 bg-slate-100 hover:bg-white text-slate-900 px-6 py-2 rounded-lg font-medium transition"
            >
              Upload Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
            Ready to contribute?
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Help your peers succeed by sharing your study materials. Upload
            notes, question papers, or project reports in seconds.
          </p>
          {session ? (
            <Link
              href="/upload"
              className="bg-slate-100 hover:bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Upload a Resource
            </Link>
          ) : (
            <Link
              href="/register"
              className="bg-slate-100 hover:bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold text-lg transition"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
