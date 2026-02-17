"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import StarRating from "../../../components/StarRating";
import ReviewForm from "../../../components/ReviewForm";
import ReviewList from "../../../components/ReviewList";
import { formatFileSize, formatDate } from "../../../lib/utils";

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResource = async () => {
    try {
      const res = await fetch(`/api/resources/${id}`);
      if (res.status === 403) {
        setError(
          "You don't have permission to view this resource. It is private to another institution.",
        );
        setLoading(false);
        return;
      }
      if (res.status === 404) {
        setError("Resource not found.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load resource");
      } else {
        setResource(data);
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResource();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Access Denied
        </h1>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link
          href="/search"
          className="bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-medium transition"
        >
          Browse Resources
        </Link>
      </div>
    );
  }

  if (!resource) return null;

  const tags = resource.tags
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const isOwner = session?.user && (session.user as any).id === resource.userId;

  const userExistingReview = resource.reviews?.find(
    (r: any) => r.user.id === (session?.user as any)?.id,
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <nav className="text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-teal-300">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/search" className="hover:text-teal-300">
          Resources
        </Link>{" "}
        / <span className="text-slate-100">{resource.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  resource.privacy === "PUBLIC"
                    ? "bg-emerald-900/40 text-emerald-200"
                    : "bg-amber-900/40 text-amber-200"
                }`}
              >
                {resource.privacy === "PUBLIC" ? "🌐 Public" : "🔒 Private"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/40 text-blue-200">
                {resource.resourceType}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              {resource.title}
            </h1>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-slate-400">
              <span>By {resource.user.name}</span>
              <span>•</span>
              <span>{resource.user.college}</span>
              <span>•</span>
              <span>{formatDate(resource.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <StarRating
              rating={Math.round(resource.averageRating)}
              readonly
              size="md"
            />
            <span className="text-lg font-semibold text-slate-100">
              {resource.averageRating}
            </span>
            <span className="text-slate-400">
              ({resource.reviewCount} review
              {resource.reviewCount !== 1 ? "s" : ""})
            </span>
          </div>

          {resource.description && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="font-semibold text-slate-100 mb-2">Description</h3>
              <p className="text-slate-300 whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="bg-slate-800 text-teal-200 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-xl font-semibold text-slate-100 mb-4">
              Reviews
            </h3>

            {!isOwner && session && (
              <div className="mb-6">
                <ReviewForm
                  resourceId={resource.id}
                  existingReview={userExistingReview}
                  onReviewSubmitted={() => fetchResource()}
                />
              </div>
            )}

            {!session && (
              <div className="bg-slate-950 rounded-lg p-4 mb-6 text-center border border-slate-800">
                <p className="text-slate-300 text-sm">
                  <Link
                    href="/login"
                    className="text-teal-300 font-medium hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to leave a review.
                </p>
              </div>
            )}

            <ReviewList reviews={resource.reviews || []} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-100 mb-4">File Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">File Name</dt>
                <dd className="text-slate-100 font-medium text-right max-w-[60%] truncate">
                  {resource.fileName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Size</dt>
                <dd className="text-slate-100">
                  {formatFileSize(resource.fileSize)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Subject</dt>
                <dd className="text-slate-100">{resource.subject}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Semester</dt>
                <dd className="text-slate-100">{resource.semester}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Year/Batch</dt>
                <dd className="text-slate-100">{resource.yearBatch}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Branch</dt>
                <dd className="text-slate-100">{resource.user.branch}</dd>
              </div>
            </dl>

            <a
              href={resource.filePath}
              download
              className="mt-6 block w-full bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-lg font-semibold text-center transition"
            >
              ⬇ Download File
            </a>
          </div>

          {isOwner && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-100 mb-4">
                Manage Resource
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/resources/${resource.id}/edit`}
                  className="block w-full bg-slate-100 hover:bg-white text-slate-900 py-2.5 rounded-lg font-medium text-center transition"
                >
                  ✏️ Edit Resource
                </Link>
                <button
                  onClick={handleDelete}
                  className="block w-full bg-rose-300 hover:bg-rose-200 text-slate-900 py-2.5 rounded-lg font-medium text-center transition"
                >
                  🗑️ Delete Resource
                </button>
              </div>
            </div>
          )}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-100 mb-3">Uploaded By</h3>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-800 text-teal-200 rounded-full flex items-center justify-center font-bold text-lg">
                {resource.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-slate-100">
                  {resource.user.name}
                </p>
                <p className="text-xs text-slate-400">
                  {resource.user.college}
                </p>
                <p className="text-xs text-slate-400">
                  {resource.user.branch} • {resource.user.semester}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
