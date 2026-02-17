"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResourceCard from "../../components/ResourceCard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    private: 0,
    avgRating: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchMyResources();
    }
  }, [status]);

  const fetchMyResources = async () => {
    try {
      const res = await fetch("/api/resources?limit=100");
      const data = await res.json();

      const myResources = (data.resources || []).filter(
        (r: any) => r.user.id === (session?.user as any)?.id,
      );

      setResources(myResources);

      const publicCount = myResources.filter(
        (r: any) => r.privacy === "PUBLIC",
      ).length;
      const privateCount = myResources.filter(
        (r: any) => r.privacy === "PRIVATE",
      ).length;
      const totalRating = myResources.reduce(
        (sum: number, r: any) => sum + (r.averageRating || 0),
        0,
      );
      const avgRating =
        myResources.length > 0 ? totalRating / myResources.length : 0;

      setStats({
        total: myResources.length,
        public: publicCount,
        private: privateCount,
        avgRating: Math.round(avgRating * 10) / 10,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResources(resources.filter((r) => r.id !== id));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Welcome back, {session?.user?.name}!
          </p>
        </div>
        <Link
          href="/upload"
          className="mt-4 sm:mt-0 bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-medium transition"
        >
          + Upload Resource
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
          <p className="text-2xl font-bold text-teal-300">{stats.total}</p>
          <p className="text-sm text-slate-400">Total Uploads</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
          <p className="text-2xl font-bold text-emerald-300">{stats.public}</p>
          <p className="text-sm text-slate-400">Public</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
          <p className="text-2xl font-bold text-amber-300">{stats.private}</p>
          <p className="text-sm text-slate-400">Private</p>
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
          <p className="text-2xl font-bold text-orange-300">
            ⭐ {stats.avgRating}
          </p>
          <p className="text-sm text-slate-400">Avg Rating</p>
        </div>
      </div>

      {/* Resources */}
      <h2 className="text-xl font-semibold text-slate-100 mb-4">
        My Resources
      </h2>

      {resources.length === 0 ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-slate-400 text-lg mb-4">
            You haven&apos;t uploaded any resources yet.
          </p>
          <Link
            href="/upload"
            className="bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-medium transition inline-block"
          >
            Upload Your First Resource
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="relative group">
              <ResourceCard resource={resource} />
              {/* Action buttons overlay */}
              <div className="absolute top-3 right-14 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Link
                  href={`/resources/${resource.id}/edit`}
                  className="bg-slate-100 hover:bg-white text-slate-900 px-2 py-1 rounded text-xs font-medium shadow"
                >
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(resource.id);
                  }}
                  className="bg-rose-300 hover:bg-rose-200 text-slate-900 px-2 py-1 rounded text-xs font-medium shadow"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
