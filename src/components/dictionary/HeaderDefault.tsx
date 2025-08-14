"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const HeaderDefault = () => {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
  const navLinks = [
    { href: "/", label: "Bosh Sahifa" },
    { href: "/about", label: "Lug'at Haqida" },
    { href: "/dictionary", label: "Lug'at" },
    { href: "/contact", label: "Kontaktlar" },
  ];

  return (
    <header
      className={`${
        pathname.startsWith("/admin") ? "hidden" : ""
      } fixed top-0 left-0 w-full z-50 py-2 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }  bg-gradient-to-r from-[#0099B5] via-white to-[#1EB53A] `}
    >
      {/* Фон с градиентом и фото */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0099B5] via-white to-[#1EB53A]" />
        <div className="absolute inset-0 bg-black/10" />
        <Image
          src="/mid-uzb2.jpg" // поставь сюда фото колонн/здания МИД
          alt="Diplomatik fon"
          fill
          className="object-cover object-[50%_30%] opacity-20"
          priority
        />
        {/* Золотая линия */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 shadow-md" />
      </div>

      <div className="max-w-6xl mx-auto flex justify-between items-center  py-2">
        {/* Лого + Название */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Diplomatik Akademiya Logotipi"
              width={80}
              height={80}
              className="rounded-full border-2 border-white shadow-md"
            />
          </Link>
          <div className="ml-4">
            <h1 className="uppercase text-2xl font-bold text-white drop-shadow-lg tracking-wide">
              Diplomatik {"Lug‘at"}
            </h1>
            <p className="text-sm text-white/90 font-light drop-shadow-md">
              Rasmiy va birinchi onlayn {"lug‘at"}
            </p>
          </div>
        </div>

        {/* Навигация */}
        <nav className="flex space-x-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1 rounded-md text-white font-medium transition-colors ${
                pathname === href
                  ? "bg-black/40 shadow-md"
                  : "hover:bg-black/20"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
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
