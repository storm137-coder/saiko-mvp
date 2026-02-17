"use client";

import StarRating from "./StarRating";
import { formatDate } from "../lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    college: string;
  };
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic">
        No reviews yet. Be the first to review!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-slate-100">{review.user.name}</p>
              <p className="text-xs text-slate-400">{review.user.college}</p>
            </div>
            <span className="text-xs text-slate-500">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <StarRating rating={review.rating} readonly size="sm" />
          {review.comment && (
            <p className="text-sm text-slate-300 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
