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
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // scrolling down
        setHidden(true);
      } else {
        // scrolling up
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
      } fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } bg-gradient-to-r from-[#0099B5] via-white to-[#1EB53A] flex flex-col`}
    >
      {/* Demo Banner */}
      <div className="bg-amber-400 text-amber-950 text-xs sm:text-sm font-semibold py-1.5 w-full relative z-20 shadow-sm marquee-container">
        <div className="marquee-content">Sayt test variantda ishlamoqda.</div>
      </div>
      {/* Background with gradient and photo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0099B5] via-white to-[#1EB53A]" />
        <div className="absolute inset-0 bg-black/10" />
        <Image
          src="/mid-uzb2-min.jpg"
          alt="Diplomatik fon"
          fill
          className="object-cover object-[50%_30%] opacity-20"
          priority
        />
        {/* Golden line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-md" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4 w-full">
        {/* Logo + Title */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="Diplomatik Akademiya Logotipi"
              width={60}
              height={60}
              className="rounded-full border-2 sm:w-16 sm:h-16 md:w-20 md:h-20"
            />
          </Link>
          <div className="ml-3 sm:ml-4">
            <h1 className="uppercase text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg tracking-wide">
              {tHeader.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-light drop-shadow-md">
              {tHeader.subtitle}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1 rounded-md text-white text-center content-center font-medium transition-colors ${
                pathname === href
                  ? "bg-black/40 shadow-md"
                  : "hover:bg-black/20"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Language Switcher HIDDEN 
          <IconButton
            onClick={handleLangMenuOpen}
            className="!text-white hover:bg-black/20"
            size="small"
            sx={{ ml: 1 }}
          >
            <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
            <span className="text-sm font-medium uppercase">{language}</span>
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={() => handleLangMenuClose()}
            disableScrollLock={true}
            PaperProps={{
              sx: {
                mt: 1.5,
                bgcolor: "white",
                color: "#001c3b",
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  fontWeight: 500,
                },
              },
            }}
          >
            <MenuItem onClick={() => handleLangMenuClose("uz")}>
              Oʻzbekcha
            </MenuItem>
          </Menu>
          */}
        </nav>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="!text-white"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>

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
            backgroundColor: "rgba(0, 153, 181, 0.95)", // Match header gradient start
            color: "white",
          },
        }}
      >
        <div className="flex justify-end p-4">
          <IconButton onClick={handleDrawerToggle} className="!text-white">
            <CloseIcon />
          </IconButton>
        </div>
        <nav className="flex flex-col space-y-4 px-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={handleDrawerToggle}
              className={`px-3 py-2 rounded-md text-white font-medium transition-colors ${
                pathname === href
                  ? "bg-black/40 shadow-md"
                  : "hover:bg-black/20"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Search Section */}
          <div className="pt-6 mt-2 border-t border-white/20">
            <p className="px-3 text-xs text-white/70 mb-3 uppercase tracking-wider">
              {tDict.searchPlaceholder}
            </p>
            <form
              onSubmit={handleMobileSearchSubmit}
              className="px-3 relative flex items-center"
            >
              <input
                type="text"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                placeholder="Qidiruv..."
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2.5 pl-4 pr-10 text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-6 text-white/70 hover:text-white"
              >
                <SearchIcon fontSize="small" />
              </button>
            </form>
          </div>

          {/* Language Section HIDDEN
          <div className="pt-4 mt-4 border-t border-white/20">
            <p className="px-3 text-xs text-white/70 mb-2 uppercase tracking-wider">
              Til / Язык
            </p>
            <div className="flex gap-2 px-3">
              <button
                onClick={() => {
                  setLanguage("uz");
                  handleDrawerToggle();
                }}
                className={`py-1.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  language === "uz"
                    ? "bg-white/20 text-white"
                    : "bg-transparent text-white/70 hover:bg-white/10"
                }`}
              >
                Oʻzbekcha
              </button>
            </div>
          </div>
          */}
        </nav>
      </Drawer>
    </header>
  );
};

// export const HeaderDefault = () => {
//   const pathname = usePathname();
//   const [isFixed, setIsFixed] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 0) {
//         setIsFixed(true);
//       } else {
//         setIsFixed(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);
//   return (
//     <header
//       className={`w-full  ${
//         pathname.startsWith("/admin") ? "hidden" : ""
//       } z-50 bg-gradient-to-br from-gray-50 to-gray-100  py-2 transition-all duration-300 ${
//         isFixed ? "sticky top-0 drop-shadow-md" : "relative"
//       }`}
//       // className={`w-full mb-[200px] ${
//       //   pathname.startsWith("/admin") ? "hidden" : ""
//       // } z-50 bg-gradient-to-br from-gray-50 to-gray-100 drop-shadow-md py-2 fixed `}
//     >
//       <div className="max-w-[1920px] mx-auto flex justify-between items-center px-[50px]">
//         {/* Logo */}
//         <div className="flex items-center ">
//           <Link href={"/"} className="">
//             <Image
//               src="/logo.png"
//               alt="Diplomatik Akademiya Logotipi"
//               width={120}
//               height={120}
//               className="rounded-full"
//             />
//           </Link>
//           <h1 className="ml-4 uppercase text-xl font-semibold text-gray-800">
//             Diplomatik {"Lug‘at"}
//           </h1>
//         </div>

//         {/* Navbar */}
//         <nav className="space-x-6 text-lg text-gray-700">
//           <Link
//             href="/"
//             className={` ${
//               pathname === "/" ? "bg-[#001c3b] text-white" : "bg-none"
//             } p-2 rounded-md  duration-300 ease-in-out`}
//           >
//             <span>Bosh Sahifa</span>
//           </Link>
//           <Link
//             className={` ${
//               pathname === "/dictionary" ? "bg-[#001c3b] text-white" : "bg-none"
//             } p-2 rounded-md  duration-300 ease-in-out`}
//             href="/dictionary"
//           >
//             <span>{"Lug'at"}</span>
//           </Link>
//           <Link
//             className={` ${
//               pathname === "/about" ? "bg-[#001c3b] text-white" : "bg-none"
//             } p-2 rounded-md  duration-300 ease-in-out`}
//             href="/about"
//           >
//             <span>{"Lug'at"} Haqida</span>
//           </Link>
//           <Link
//             className={` ${
//               pathname === "/contact" ? "bg-[#001c3b] text-white" : "bg-none"
//             } p-2 rounded-md transition-all duration-300 ease-in-out`}
//             href="/contact"
//           >
//             <span>Kontaktlar</span>
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// };
