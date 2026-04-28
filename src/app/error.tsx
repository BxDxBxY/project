"use client";

import React, { useEffect } from "react";
import { Button } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-[#001c3b] mb-4">
          Nimadir notoʻgʻri ketdi
        </h1>
        <p className="text-gray-600 mb-10 leading-relaxed">
          Tizimda kutilmagan xatolik yuz berdi. Iltimos, sahifani yangilang yoki
          birozdan soʻng qayta urinib koʻring.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            variant="contained"
            startIcon={<ReplayIcon />}
            className="!bg-[#001c3b] !py-3 !rounded-xl !capitalize !shadow-lg"
          >
            Qayta urinish
          </Button>
          <Button
            component={Link}
            href="/"
            variant="text"
            startIcon={<HomeIcon />}
            className="!text-[#001c3b] !py-3 !capitalize font-bold"
          >
            Bosh sahifaga oʻtish
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
