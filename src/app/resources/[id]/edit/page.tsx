"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { RESOURCE_TYPES, SEMESTERS, YEARS } from "../../../../lib/utils";

export default function EditResourcePage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    resourceType: "",
    yearBatch: "",
    tags: "",
    description: "",
    privacy: "PUBLIC",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchResource();
    }
  }, [status]);

  const fetchResource = async () => {
    try {
      const res = await fetch(`/api/resources/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load resource");
        setLoading(false);
        return;
      }

      if (data.userId !== (session?.user as any)?.id) {
        setError("You can only edit your own resources");
        setLoading(false);
        return;
      }

      setForm({
        title: data.title,
        subject: data.subject,
        semester: data.semester,
        resourceType: data.resourceType,
        yearBatch: data.yearBatch,
        tags: data.tags,
        description: data.description || "",
        privacy: data.privacy,
      });
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.title ||
      !form.subject ||
      !form.semester ||
      !form.resourceType ||
      !form.yearBatch ||
      !form.tags
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }

      router.push(`/resources/${id}`);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Error</h1>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-slate-100 hover:bg-white text-slate-900 px-6 py-2.5 rounded-lg font-medium transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Edit Resource</h1>
        <p className="text-slate-400 mt-2">
          Update the details of your resource
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-8">
        {error && (
          <div className="bg-rose-900/40 border border-rose-700/60 text-rose-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Semester *
              </label>
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">Select</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Type *
              </label>
              <select
                name="resourceType"
                value={form.resourceType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">Select</option>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Year/Batch *
              </label>
              <select
                name="yearBatch"
                value={form.yearBatch}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                <option value="">Select</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Tags * (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Description (optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Privacy *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="PUBLIC"
                  checked={form.privacy === "PUBLIC"}
                  onChange={handleChange}
                  className="text-teal-300 focus:ring-teal-300"
                />
                <span className="text-sm text-slate-200">🌐 Public</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  value="PRIVATE"
                  checked={form.privacy === "PRIVATE"}
                  onChange={handleChange}
                  className="text-teal-300 focus:ring-teal-300"
                />
                <span className="text-sm text-slate-200">🔒 Private</span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-700 text-slate-200 rounded-lg font-semibold hover:bg-slate-900 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
