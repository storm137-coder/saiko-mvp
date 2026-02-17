"use client";

import { useState } from "react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${sizeClasses[size]} ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          } transition-transform`}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <span
            className={
              star <= (hover || rating) ? "text-amber-300" : "text-slate-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
