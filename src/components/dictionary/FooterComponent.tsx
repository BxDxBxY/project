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
    <footer className="w-full bg-gray-800 text-white py-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-6">
        {/* Footer Links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
          <Link href="/terms" className="hover:underline">
            Shartlar va Qoidalar
          </Link>
          <Link href="/privacy" className="hover:underline">
            Maxfiylik siyosati
          </Link>
          <Link href="/contact" className="hover:underline">
            Kontakt
          </Link>
        </nav>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://twitter.com/dipacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <XIcon fontSize="small" />
          </a>
          <a
            href="https://linkedin.com/company/dipacademy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            <LinkedInIcon fontSize="small" />
          </a>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-300">
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
