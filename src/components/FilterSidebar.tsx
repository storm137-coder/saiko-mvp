"use client";

import { RESOURCE_TYPES, SEMESTERS, BRANCHES, YEARS } from "../lib/utils";

interface FilterSidebarProps {
  filters: {
    subject: string;
    semester: string;
    resourceType: string;
    branch: string;
    yearBatch: string;
    privacy: string;
    sort: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  subjects: string[];
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  subjects,
}: FilterSidebarProps) {
  return (
    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-100">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-xs text-teal-300 hover:text-teal-200 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange("sort", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Resource Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Resource Type
        </label>
        <select
          value={filters.resourceType}
          onChange={(e) => onFilterChange("resourceType", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All Types</option>
          {RESOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Subject
        </label>
        <select
          value={filters.subject}
          onChange={(e) => onFilterChange("subject", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All Subjects</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Semester
        </label>
        <select
          value={filters.semester}
          onChange={(e) => onFilterChange("semester", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Branch */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Branch
        </label>
        <select
          value={filters.branch}
          onChange={(e) => onFilterChange("branch", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Year/Batch
        </label>
        <select
          value={filters.yearBatch}
          onChange={(e) => onFilterChange("yearBatch", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Privacy */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Privacy
        </label>
        <select
          value={filters.privacy}
          onChange={(e) => onFilterChange("privacy", e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <option value="">All</option>
          <option value="PUBLIC">Public Only</option>
          <option value="PRIVATE">Private (My College)</option>
        </select>
      </div>
    </div>
  );
}
