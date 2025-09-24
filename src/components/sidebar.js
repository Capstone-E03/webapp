"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
        <div
            className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={onClose}
        ></div>

        <aside className={`fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-md transform transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
            <div className="p-6">
                <nav className="space-y-2">
                <Link
                    href="/"
                    onClick={onClose}
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
                    onClick={onClose}
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
    </>
  );
}