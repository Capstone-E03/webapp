// src/components/Sidebar.js

"use client"; // This is required to use the usePathname hook

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed h-full w-64 bg-white shadow-md">
      <div className="p-6">
        <nav className="space-y-2">
          <Link
            href="/"
            className={`block px-4 py-2.5 font-semibold rounded-lg ${
              pathname === "/"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/riwayat"
            className={`block px-4 py-2.5 font-semibold rounded-lg ${
              pathname === "/riwayat"
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Riwayat
          </Link>
        </nav>
      </div>
    </aside>
  );
}