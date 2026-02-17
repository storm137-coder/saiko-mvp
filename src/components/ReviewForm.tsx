"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";

interface ReviewFormProps {
  resourceId: string;
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  resourceId,
  existingReview,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-800">
        <p className="text-slate-300">Please login to leave a review.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/resources/${resourceId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      onReviewSubmitted();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 rounded-lg p-4 border border-slate-800"
    >
      <h4 className="font-medium text-slate-100 mb-3">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h4>

      {error && (
        <div className="bg-rose-900/40 text-rose-200 px-3 py-2 rounded text-sm mb-3 border border-rose-700/60">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">Rating *</label>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-slate-300 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
          rows={3}
          placeholder="Share your thoughts about this resource..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : existingReview
            ? "Update Review"
            : "Submit Review"}
      </button>
    </form>
  );
}
