"use client";

import Link from "next/link";
import { formatFileSize, formatDate } from "../lib/utils";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    subject: string;
    semester: string;
    resourceType: string;
    privacy: string;
    fileSize: number;
    fileType: string;
    createdAt: string;
    averageRating: number;
    reviewCount: number;
    tags: string;
    user: {
      name: string;
      college: string;
      branch: string;
    };
  };
}

const typeIcons: Record<string, string> = {
  Notes: "📝",
  "Question Papers": "📋",
  Solutions: "✅",
  "Project Reports": "📊",
  "Study Material": "📖",
};

const typeColors: Record<string, string> = {
  Notes: "bg-blue-900/40 text-blue-200",
  "Question Papers": "bg-purple-900/40 text-purple-200",
  Solutions: "bg-green-900/40 text-green-200",
  "Project Reports": "bg-orange-900/40 text-orange-200",
  "Study Material": "bg-teal-900/40 text-teal-200",
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const tags = resource.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <Link href={`/resources/${resource.id}`}>
      <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 hover:shadow-lg hover:border-teal-400 transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="p-5 pb-3 flex-1">
          <div className="flex items-start justify-between mb-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                typeColors[resource.resourceType] ||
                "bg-slate-800 text-slate-200"
              }`}
            >
              {typeIcons[resource.resourceType] || "📄"} {resource.resourceType}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                resource.privacy === "PUBLIC"
                  ? "bg-emerald-900/40 text-emerald-200"
                  : "bg-amber-900/40 text-amber-200"
              }`}
            >
              {resource.privacy === "PUBLIC" ? "🌐 Public" : "🔒 Private"}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-teal-200 transition-colors line-clamp-2 mb-2">
            {resource.title}
          </h3>

          <p className="text-sm text-slate-400 mb-2">
            {resource.subject} • {resource.semester}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-sm ${
                  star <= Math.round(resource.averageRating)
                    ? "text-amber-300"
                    : "text-slate-600"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-slate-400 ml-1">
              {resource.averageRating > 0
                ? `${resource.averageRating} (${resource.reviewCount})`
                : "No ratings"}
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-block bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[60%]">
              By {resource.user.name}
            </span>
            <span>{formatDate(resource.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>{resource.user.college}</span>
            <span>{formatFileSize(resource.fileSize)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
