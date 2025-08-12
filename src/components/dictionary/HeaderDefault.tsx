import Image from "next/image";
import Link from "next/link";

export const HeaderDefault = () => {
  return (
    <header className="w-full bg-white drop-shadow-md py-2 fixed ">
      <div className="max-w-[1920px] mx-auto flex justify-between items-center px-[50px]">
        {/* Logo */}
        <div className="flex items-center ">
          <Image
            src="/logo.png"
            alt="Diplomatik Akademiya Logotipi"
            width={120}
            height={120}
            className="rounded-full"
          />
          <h1 className="ml-4 text-xl font-semibold text-gray-800">
            Diplomatik Lug‘at
          </h1>
        </div>

        {/* Navbar */}
        <nav className="space-x-6 text-lg text-gray-700">
          <Link href="/">
            <span>Home</span>
          </Link>
          <Link href="/dictionary">
            <span>Glossary</span>
          </Link>
          <Link href="/about">
            <span>About</span>
          </Link>
          <Link href="/contact">
            <span>Contact</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
