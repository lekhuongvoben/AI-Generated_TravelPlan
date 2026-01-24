"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default function DateInput() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        mode: "range", // date range
        dateFormat: "Y-m-d",
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-3 flex-1 border border-gray-200 rounded-xl px-4 py-3">
      {/* Calendar Icon */}
      <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>

      {/* Date Input */}
      <input
        ref={inputRef}
        placeholder="Select dates"
        className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </div>
  );
}
