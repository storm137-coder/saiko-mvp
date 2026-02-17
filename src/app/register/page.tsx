"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SEMESTERS, BRANCHES } from "../../lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    branch: "",
    semester: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      !form.name ||
      !form.email ||
      !form.password ||
      !form.college ||
      !form.branch ||
      !form.semester
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          college: form.college,
          branch: form.branch,
          semester: form.semester,
          bio: form.bio || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-slate-950">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Create Account</h1>
          <p className="text-slate-400 mt-2">
            Join CampusShare and start sharing resources
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-8">
          {error && (
            <div className="bg-rose-900/40 border border-rose-700/60 text-rose-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                placeholder="john@college.edu"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                  placeholder="Min 6 chars"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                College / Institution *
              </label>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                placeholder="MIT, Stanford, IIT Delhi, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Branch / Department *
                </label>
                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Semester / Year *
                </label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                >
                  <option value="">Select Semester</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">
                Bio (optional)
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-white text-slate-900 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-300 hover:text-teal-200 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
