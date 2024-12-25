"use client";

import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import ModeToggle from "@/components/ThemeToggle";
import { Button } from "./ui/button";
// import toast from "react-hot-toast";

// Attendance 1, 2

const Navbar = () => {
  // const router = useRouter();

  return (
    <nav className="w-full bg-zinc-50 dark:bg-zinc-900 p-4 border-zinc-300 dark:border-zinc-800">
      <div className="mx-auto flex justify-between items-center text-sm">
        {/* Menu items */}
        <div className="flex text-[13px]">
          {/* Logo */}
          <Button variant="link">
            <Link href="/" className="text-lg flex items-center justify-center">
              <Image
                src="/qreate-logo-rectangle.png"
                alt="Qreate Logo"
                width={40}
                height={40}
                className="mr-2 border-[1px] border-zinc-800 rounded-lg"
              />
              Qreate
            </Link>
          </Button>
          {/* All filter button */}
          {/* <Button variant="link">
            <Link href="/search" className="text-sm">
              All
            </Link>
          </Button>
          <Button variant="link">
            <Link href="/search?q=shirts" className="text-sm">
              Shirt
            </Link>
          </Button>
          <Button variant="link">
            <Link href="/search?q=shoes" className="text-sm">
              Shoes
            </Link>
          </Button> */}
        </div>

        {/* Authentication */}
        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
