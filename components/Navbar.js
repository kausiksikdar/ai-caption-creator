"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const navLinks = [
        { name: "Generate", href: "/generate" },
        { name: "Templates", href: "/templates" },
    ];

    return (
        <nav className="shadow-md p-4 sticky top-0 z-50 bg-white">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600">CaptionAI</Link>
                
                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-6">
                    {navLinks.map(({ name, href }) => (
                        <Link key={name} href={href} className={`text-lg ${pathname === href ? "text-blue-600 font-bold" : "text-gray-700"}`}>{name}</Link>
                    ))}

                    {/* Protected Links - Only Visible When Signed In */}
                    <SignedIn>
                        <Link href="/explore" className={`text-lg ${pathname === "/explore" ? "text-blue-600 font-bold" : "text-gray-700"}`}>Explore</Link>
                        <Link href="/dashboard" className={`text-lg ${pathname === "/dashboard" ? "text-blue-600 font-bold" : "text-gray-700"}`}>Dashboard</Link>
                    </SignedIn>
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="md:hidden text-gray-700 text-2xl">☰</button>
            </div>

            {/* Mobile Nav Menu */}
            {menuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden flex flex-col space-y-4 mt-4 p-4 bg-white shadow-lg rounded-lg"
                >
                    {navLinks.map(({ name, href }) => (
                        <Link key={name} href={href} className="text-lg text-gray-700" onClick={() => setMenuOpen(false)}>{name}</Link>
                    ))}

                    <SignedIn>
                        <Link href="/explore" className="text-lg text-gray-700" onClick={() => setMenuOpen(false)}>Explore</Link>
                        <Link href="/dashboard" className="text-lg text-gray-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </motion.div>
            )}
        </nav>
    );
}
