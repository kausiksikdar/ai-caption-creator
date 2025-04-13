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
        <motion.nav 
            className="shadow-md p-4 sticky top-0 z-50 bg-black"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-[#00f0ff]">CaptionAI</Link>
                
                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-6">
                    {navLinks.map(({ name, href }) => (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Link 
                                href={href} 
                                className={`group relative text-lg transition-all duration-300 ${
                                    pathname === href ? "text-[#00f0ff] font-bold" : "text-gray-300"
                                }`}
                            >
                                {name}
                                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#00f0ff] transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </Link>
                        </motion.div>
                    ))}

                    {/* Protected Links - Only Visible When Signed In */}
                    <SignedIn>
                        {["/explore", "/community", "/dashboard"].map((href) => {
                            const label = href.replace("/", "").charAt(0).toUpperCase() + href.slice(2);
                            return (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Link 
                                        href={href}
                                        className={`group relative text-lg transition-all duration-300 ${
                                            pathname === href ? "text-[#00f0ff] font-bold" : "text-gray-300"
                                        }`}
                                    >
                                        {label}
                                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#00f0ff] transition-all duration-300 group-hover:w-full rounded-full"></span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </SignedIn>
                </div>

                {/* Auth Actions */}
                <div className="hidden md:flex items-center space-x-4">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>

                {/* Mobile Menu Button */}
                <button onClick={toggleMenu} className="md:hidden text-gray-300 text-2xl">☰</button>
            </div>

            {/* Mobile Nav Menu */}
            {menuOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="md:hidden flex flex-col space-y-4 mt-4 p-4 bg-black shadow-lg rounded-lg"
                >
                    {navLinks.map(({ name, href }) => (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Link 
                                href={href}
                                className="group relative text-lg text-gray-300"
                                onClick={() => setMenuOpen(false)}
                            >
                                {name}
                                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#00f0ff] transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </Link>
                        </motion.div>
                    ))}

                    <SignedIn>
                        {["/explore", "/community", "/dashboard"].map((href) => {
                            const label = href.replace("/", "").charAt(0).toUpperCase() + href.slice(2);
                            return (
                                <motion.div
                                    key={href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <Link 
                                        href={href}
                                        className="group relative text-lg text-gray-300"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {label}
                                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#00f0ff] transition-all duration-300 group-hover:w-full rounded-full"></span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </motion.div>
            )}
        </motion.nav>
    );
}
