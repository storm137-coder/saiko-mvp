"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalResources: 0,
    totalReviews: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/resources?limit=100");
      const data = await res.json();

      const myResources = (data.resources || []).filter(
        (r: any) => r.user.id === (session?.user as any)?.id,
      );

      const totalReviews = myResources.reduce(
        (sum: number, r: any) => sum + (r.reviewCount || 0),
        0,
      );

      const totalRating = myResources.reduce(
        (sum: number, r: any) => sum + (r.averageRating || 0),
        0,
      );

      const avgRating =
        myResources.length > 0 ? totalRating / myResources.length : 0;

      setStats({
        totalResources: myResources.length,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6 text-center">
            <div className="w-20 h-20 bg-slate-800 text-teal-200 rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-4">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>
                🏫 <span className="font-medium">{user.college}</span>
              </p>
              <p>
                📚 <span className="font-medium">{user.branch}</span>
              </p>
              <p>
                🎓 <span className="font-medium">{user.semester}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-teal-300">
                {stats.totalResources}
              </p>
              <p className="text-sm text-slate-400 mt-1">Resources</p>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-emerald-300">
                {stats.totalReviews}
              </p>
              <p className="text-sm text-slate-400 mt-1">Reviews Received</p>
            </div>
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-5 text-center">
              <p className="text-3xl font-bold text-orange-300">
                ⭐ {stats.avgRating}
              </p>
              <p className="text-sm text-slate-400 mt-1">Avg Rating</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm p-6">
            <h3 className="font-semibold text-slate-100 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/upload"
                className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg hover:border-teal-300 hover:bg-slate-900 transition"
              >
                <span className="text-2xl">📤</span>
                <div>
                  <p className="font-medium text-slate-100">Upload Resource</p>
                  <p className="text-xs text-slate-400">
                    Share new study material
                  </p>
                </div>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg hover:border-teal-300 hover:bg-slate-900 transition"
              >
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-medium text-slate-100">Dashboard</p>
                  <p className="text-xs text-slate-400">
                    Manage your resources
                  </p>
                </div>
              </Link>
              <Link
                href="/search"
                className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg hover:border-teal-300 hover:bg-slate-900 transition"
              >
                <span className="text-2xl">🔍</span>
                <div>
                  <p className="font-medium text-slate-100">Browse</p>
                  <p className="text-xs text-slate-400">
                    Discover new resources
                  </p>
                </div>
              </Link>
              <div className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg bg-slate-950">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="font-medium text-slate-100">Account Secure</p>
                  <p className="text-xs text-slate-400">
                    Password hashed with bcrypt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
