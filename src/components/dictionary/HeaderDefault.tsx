"use client";
import { IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
//////////////////////////////////////////
import { Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import SearchIcon from "@mui/icons-material/Search";
import { useDictionary } from "@/hooks/useDictionary";
import { useRouter } from "next/navigation";

export const HeaderDefault = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { language } = useLanguage();
  const t = translations[language].nav;
  const tHeader = translations[language].header;
  const tDict = translations[language].dictionary;

  const { search, setSearch, triggerSearch } = useDictionary();
  const router = useRouter();
  const [mobileSearch, setMobileSearch] = useState("");

  useEffect(() => {
    setMobileSearch(search);
  }, [search]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearch(mobileSearch);
    triggerSearch(mobileSearch);
    setMobileOpen(false);
    if (pathname !== "/dictionary") {
      router.push("/dictionary");
    }
  };

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/dictionary", label: t.dictionary },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header
      className={`${
        pathname.startsWith("/admin") ? "hidden" : ""
      } sticky top-0 left-0 w-full z-50 bg-[#001c3b] flex flex-col shadow-md`}
    >
      {/* Test rejimi haqida ogohlantirish (harakatlanmaydi — WCAG 2.2.2) */}
      <div className="bg-amber-300 text-amber-950 text-xs sm:text-sm font-semibold py-1.5 w-full text-center px-4">
        {tHeader.testBanner}
      </div>

      {/* Bezak fon rasmi — mazmun tashimaydi */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <Image
          src="/mid-uzb2-min.jpg"
          alt=""
          fill
          className="object-cover object-[50%_30%] opacity-15"
          priority
        />
        <div className="absolute inset-0 bg-[#001c3b]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4 w-full">
        {/* Logo + Title */}
        <div className="flex items-center">
          <Link
            href="/"
            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e0c48f]"
          >
            <Image
              src="/logo2.png"
              alt={tHeader.title}
              width={60}
              height={60}
              className="rounded-full border-2 border-white/30 sm:w-16 sm:h-16 md:w-20 md:h-20"
            />
          </Link>
          <div className="ml-3 sm:ml-4">
            <p className="uppercase text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
              {tHeader.title}
            </p>
            <p className="text-xs sm:text-sm text-gray-200 font-light">
              {tHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex space-x-4 items-center"
          aria-label={tHeader.title}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`px-3 py-1.5 rounded-md text-white text-center content-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] ${
                pathname === href
                  ? "bg-white/20 shadow-md underline underline-offset-4"
                  : "hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <IconButton
            color="inherit"
            aria-label={tHeader.openMenu}
            aria-expanded={mobileOpen}
            edge="end"
            onClick={handleDrawerToggle}
            className="!text-white"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>

      {/* Oʻzbekiston bayrogʻi ranglaridagi bezak chizigʻi */}
      <div
        className="h-1 w-full bg-gradient-to-r from-[#0099B5] via-white to-[#1EB53A]"
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: "75%",
            maxWidth: "300px",
            backgroundColor: "#001c3b",
            color: "white",
          },
        }}
      >
        <div className="flex justify-end p-4">
          <IconButton
            onClick={handleDrawerToggle}
            className="!text-white"
            aria-label={tHeader.closeMenu}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <nav className="flex flex-col space-y-4 px-4" aria-label={tHeader.title}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleDrawerToggle}
              aria-current={pathname === href ? "page" : undefined}
              className={`px-3 py-2 rounded-md text-white font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] ${
                pathname === href ? "bg-white/20 shadow-md" : "hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Search Section */}
          <div className="pt-6 mt-2 px-3 border-t border-white/20">
            <form onSubmit={handleMobileSearchSubmit} role="search">
              <label
                htmlFor="mobile-search"
                className="block text-xs text-gray-200 mb-2 uppercase tracking-wider"
              >
                {tHeader.searchLabel}
              </label>
              <div className="relative">
                <input
                  id="mobile-search"
                  type="search"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder={tDict.searchPlaceholder}
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-2.5 pl-4 pr-11 text-sm text-white placeholder-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] focus:bg-white/20 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  aria-label={tHeader.searchSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e0c48f] rounded-sm"
                >
                  <SearchIcon fontSize="small" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </nav>
      </Drawer>
    </header>
  );
};
