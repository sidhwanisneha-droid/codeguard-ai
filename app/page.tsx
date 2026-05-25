"use client";

import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ code }),
});

      const data = await res.json();
      setReview(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const score = review?.merge_score || 0;

  const scoreColor =
    score >= 80
      ? "text-green-400"
      : score >= 60
      ? "text-yellow-400"
      : "text-red-400";

  const statusText =
    score >= 80
      ? "✅ Approved to Merge"
      : score >= 60
      ? "⚠ Requires Fix Before Merge"
      : "❌ Block Merge";

  const statusStyle =
    score >= 80
      ? "bg-green-500/10 border-green-500 text-green-400"
      : score >= 60
      ? "bg-yellow-500/10 border-yellow-500 text-yellow-400"
      : "bg-red-500/10 border-red-500 text-red-400";

  return (
    <main className="min-h-screen bg-black text-white px-8 py-12 md:px-16">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          CodeGuard AI
        </h1>

        <p className="text-gray-400 text-xl mt-4">
          AI-powered code review before you merge to production.
        </p>
      </div>

      {/* Code Input */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-72 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 text-lg text-white outline-none focus:border-yellow-400 transition"
      />

      {/* Review Button */}
      <button
        onClick={analyzeCode}
        className="mt-6 rounded-2xl bg-white px-8 py-4 text-black font-bold text-lg hover:scale-105 hover:bg-gray-200 transition duration-300 shadow-xl"
      >
        {loading ? "Reviewing..." : "Review Code"}
      </button>

      {/* Review Result */}
      {review && (
        <div className="mt-14">

          {/* Score */}
         <h2 className={`text-5xl font-bold ${scoreColor}`}>
           <span className="mr-3">⚠️</span>
            Merge Score: {score}/100
          127.0.0.1:8000</h2>

          {/* Merge Decision */}
          <div
            className={`mt-6 rounded-3xl border p-6 backdrop-blur-md ${statusStyle}`}
          >
            <h3 className="text-3xl font-bold">
              {statusText}
            </h3>

            <p className="mt-3 text-gray-300 text-lg">
              {review.summary}
            </p>
          </div>

          {/* Issues */}
          <div className="mt-8 grid gap-6">
            {review.issues?.map((issue: any, index: number) => (
              <div
                key={index}
                className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl hover:shadow-yellow-500/10 transition duration-300"
              >
                <p className="text-2xl mb-3">
                  <span className="font-bold">Type:</span> {issue.type}
                </p>

                <p className="text-xl mb-3 text-red-400">
                  <span className="font-bold">Severity:</span>{" "}
                  {issue.severity}
                </p>

                <p className="text-lg text-gray-200 mb-3">
                  <span className="font-bold text-white">Problem:</span>{" "}
                  {issue.problem}
                </p>

                <p className="text-lg text-green-400">
                  <span className="font-bold">Fix:</span> {issue.fix}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </main>
  );
}