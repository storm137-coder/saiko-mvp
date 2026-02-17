"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RESOURCE_TYPES, SEMESTERS, YEARS } from "../../lib/utils";

export default function UploadPage() {
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
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-300"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

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
      !file ||
      !form.title ||
      !form.subject ||
      !form.semester ||
      !form.resourceType ||
      !form.yearBatch ||
      !form.tags
    ) {
      setError("Please fill in all required fields and select a file");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      router.push(`/resources/${data.resource.id}`);
    } catch (err) {
      setError("Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Upload Resource</h1>
        <p className="text-slate-400 mt-2">
          Share your academic materials with fellow students
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-8">
        {error && (
          <div className="bg-rose-900/40 border border-rose-700/60 text-rose-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              File * (PDF, DOCX, PPT, Images — Max 10MB)
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-teal-300 transition cursor-pointer bg-slate-950/40">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-white"
              />
              {file && (
                <p className="text-sm text-emerald-300 mt-2">
                  ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

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
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="e.g., Data Structures Mid-Term Notes"
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
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="e.g., Data Structures & Algorithms"
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
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="e.g., algorithms, sorting, trees, graphs"
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
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Brief description of the resource..."
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
                <span className="text-sm text-slate-200">
                  🌐 Public — Visible to everyone
                </span>
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
                <span className="text-sm text-slate-200">
                  🔒 Private — Same college only
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}
