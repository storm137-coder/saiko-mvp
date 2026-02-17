"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResourcesIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/search");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      Redirecting to search...
    </div>
  );
}
