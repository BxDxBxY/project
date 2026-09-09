"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <Image
            src="/logo2.png"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain opacity-20 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl font-black text-[#001c3b]/10">404</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-[#001c3b] mb-4 tracking-tight">
          Sahifa topilmadi
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto leading-relaxed">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga
          koʻchirilgan.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            component={Link}
            href="/"
            variant="contained"
            startIcon={<HomeIcon />}
            className="!bg-[#001c3b] !px-8 !py-3 !rounded-xl !capitalize !text-lg !shadow-xl hover:!scale-105 transition-transform"
          >
            Bosh sahifaga qaytish
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            className="!border-[#001c3b] !text-[#001c3b] !px-8 !py-3 !rounded-xl !capitalize !text-lg hover:!bg-[#001c3b]/5 transition-colors"
          >
            Orqaga qaytish
          </Button>
        </div>

        <div className="mt-20 flex justify-center gap-8 opacity-40">
          <div className="w-12 h-1 bg-[#0099B5]"></div>
          <div className="w-12 h-1 bg-[#c9a96e]"></div>
          <div className="w-12 h-1 bg-[#1EB53A]"></div>
        </div>
      </div>
    </div>
  );
}
