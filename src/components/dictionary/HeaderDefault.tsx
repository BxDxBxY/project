"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const HeaderDefault = () => {
  const pathname = usePathname();
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`w-full  ${
        pathname.startsWith("/admin") ? "hidden" : ""
      } z-50 bg-gradient-to-br from-gray-50 to-gray-100  py-2 transition-all duration-300 ${
        isFixed ? "sticky top-0 drop-shadow-md" : "relative"
      }`}
      // className={`w-full mb-[200px] ${
      //   pathname.startsWith("/admin") ? "hidden" : ""
      // } z-50 bg-gradient-to-br from-gray-50 to-gray-100 drop-shadow-md py-2 fixed `}
    >
      <div className="max-w-[1920px] mx-auto flex justify-between items-center px-[50px]">
        {/* Logo */}
        <div className="flex items-center ">
          <Link href={"/"} className="">
            <Image
              src="/logo.png"
              alt="Diplomatik Akademiya Logotipi"
              width={120}
              height={120}
              className="rounded-full"
            />
          </Link>
          <h1 className="ml-4 uppercase text-xl font-semibold text-gray-800">
            Diplomatik {"Lug‘at"}
          </h1>
        </div>

        {/* Navbar */}
        <nav className="space-x-6 text-lg text-gray-700">
          <Link
            href="/"
            className={` ${
              pathname === "/" ? "bg-[#001c3b] text-white" : "bg-none"
            } p-2 rounded-md  duration-300 ease-in-out`}
          >
            <span>Bosh Sahifa</span>
          </Link>
          <Link
            className={` ${
              pathname === "/dictionary" ? "bg-[#001c3b] text-white" : "bg-none"
            } p-2 rounded-md  duration-300 ease-in-out`}
            href="/dictionary"
          >
            <span>{"Lug'at"}</span>
          </Link>
          <Link
            className={` ${
              pathname === "/about" ? "bg-[#001c3b] text-white" : "bg-none"
            } p-2 rounded-md  duration-300 ease-in-out`}
            href="/about"
          >
            <span>Diplomatik Akademiya</span>
          </Link>
          <Link
            className={` ${
              pathname === "/contact" ? "bg-[#001c3b] text-white" : "bg-none"
            } p-2 rounded-md transition-all duration-300 ease-in-out`}
            href="/contact"
          >
            <span>Kontaktlar</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
