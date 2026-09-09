"use client";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";

export default function FooterComponent() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].footer;

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="w-full bg-gradient-to-b from-[#001c3b] to-[#001428] text-white py-10 sm:py-12 border-t-4 border-[#c9a96e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 sm:gap-10 mb-8">
          {/* Footer Links */}
          <nav className="flex flex-col sm:flex-row items-center flex-wrap justify-center sm:justify-start gap-5 sm:gap-8 text-sm sm:text-base">
            <Link
              href="/terms"
              className="hover:text-[#c9a96e] transition-colors font-medium"
            >
              {t.terms}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-[#c9a96e] transition-colors font-medium"
            >
              {t.privacy}
            </Link>
            <Link
              href="/cookies"
              className="hover:text-[#c9a96e] transition-colors font-medium"
            >
              {language === "uz" ? "Cookie Siyosati" : "Политика Cookie"}
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#c9a96e] transition-colors font-medium"
            >
              {t.contact}
            </Link>
          </nav>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/uwedofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#c9a96e] transition-all hover:scale-110"
              aria-label="X (Twitter)"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/UQBc-SSY-DS13uH4Nys8KIJw4bUBXxbhVO7FJAzVrD3S9Pi3-jidu-huzuridagi-diplomatik-akademiya/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#c9a96e] transition-all hover:scale-110"
              aria-label="LinkedIn"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6"></div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          <p>
            &copy; 2024-{new Date().getFullYear()} {t.rights}
          </p>
        </div>
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
