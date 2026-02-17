"use client";

import { useEffect, useState, useCallback } from "react";
import ResourceCard from "../../components/ResourceCard";
import FilterSidebar from "../../components/FilterSidebar";

const defaultFilters = {
  subject: "",
  semester: "",
  resourceType: "",
  branch: "",
  yearBatch: "",
  privacy: "",
  sort: "latest",
};

export default function SearchPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filters.subject) params.set("subject", filters.subject);
      if (filters.semester) params.set("semester", filters.semester);
      if (filters.resourceType)
        params.set("resourceType", filters.resourceType);
      if (filters.branch) params.set("branch", filters.branch);
      if (filters.yearBatch) params.set("yearBatch", filters.yearBatch);
      if (filters.privacy) params.set("privacy", filters.privacy);
      params.set("sort", filters.sort);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/resources?${params.toString()}`);
      const data = await res.json();

      setResources(data.resources || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);

      // Extract unique subjects for filter dropdown
      const uniqueSubjects = Array.from(
        new Set((data.resources || []).map((r: any) => r.subject)),
      ) as string[];
      setSubjects((prev) => {
        const merged = Array.from(new Set([...prev, ...uniqueSubjects]));
        return merged.sort();
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setSearch("");
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchResources();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Browse Resources</h1>
        <p className="text-slate-400 mt-1">
          Search and filter through academic resources
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, subject, or tags..."
              className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>
          </div>
          <button
            type="submit"
            className="bg-slate-100 hover:bg-white text-slate-900 px-6 py-3 rounded-xl font-medium transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="lg:hidden mb-4 flex items-center space-x-2 text-teal-300 font-medium"
      >
        <span>⚙️</span>
        <span>{mobileFiltersOpen ? "Hide Filters" : "Show Filters"}</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div
          className={`lg:w-72 flex-shrink-0 ${
            mobileFiltersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            subjects={subjects}
          />
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400">
              {total} resource{total !== 1 ? "s" : ""} found
            </p>
            <p className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-slate-400 text-lg mb-2">No resources found</p>
              <p className="text-slate-500 text-sm">
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 text-teal-300 hover:text-teal-200 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-10">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          page === pageNum
                            ? "bg-slate-100 text-slate-900"
                            : "border border-slate-700 text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
