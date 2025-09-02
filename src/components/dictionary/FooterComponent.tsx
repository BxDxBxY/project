"use client";
import React from "react";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { usePathname } from "next/navigation";

export default function FooterComponent() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full bg-[#001c3b] text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
        {/* Footer Links */}
        <nav className="flex flex-col sm:flex-row items-center flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
          <Link
            href="/terms"
            className="hover:underline hover:text-blue-400 transition-colors"
          >
            Shartlar va Qoidalar
          </Link>
          <Link
            href="/privacy"
            className="hover:underline hover:text-blue-400 transition-colors"
          >
            Maxfiylik siyosati
          </Link>
          <Link
            href="/contact"
            className="hover:underline hover:text-blue-400 transition-colors"
          >
            Kontakt
          </Link>
        </nav>

        {/* Social Media Links */}
        <div className="flex w-full sm:w-auto items-center justify-evenly sm:justify-center space-x-4 sm:space-x-6">
          <a
            href="https://twitter.com/dipacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <XIcon fontSize="small" className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href="https://linkedin.com/company/dipacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <LinkedInIcon fontSize="small" className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-300">
        &copy; «Diplomatic Academy» — Barcha huquqlar himoyalangan
      </div>
    </footer>
  );
}
// <footer
//   className={`w-full bg-gray-800 text-white py-6  ${
//     pathname.startsWith("/admin") ? "hidden" : ""
//   }`}
// >
//   <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
//     {/* Footer Links */}
//     <nav className="space-x-6 text-sm">
//       <Link href="/terms">
//         <span>Shartlar va Qoidalar</span>
//       </Link>
//       <Link href="/privacy">
//         <span>Maxfiylik siyosati</span>
//       </Link>
//       <Link href="/contact">
//         <span>Kontakt</span>
//       </Link>
//     </nav>

//     {/* Social Media Links */}
//     <div className="space-x-4">
//       <a
//         href="https://twitter.com/dipacademy"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <XIcon />
//         {/* <img src="/icons/twitter.svg" alt="Twitter" width={20} /> */}
//       </a>
//       <a
//         href="https://linkedin.com/company/dipacademy"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <LinkedInIcon />
//         {/* <img src="/icons/linkedin.svg" alt="LinkedIn" width={20} /> */}
//       </a>
//       {/* Add more social icons as needed */}
//     </div>
//   </div>
//   <div className="mt-4 text-center text-sm text-gray-400">
//     &copy; «Diplomatic Academy» Barcha huquqlar himoyalangan
//   </div>
// </footer>
