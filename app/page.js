"use client";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-blue-600 min-h-screen bg-gradient-to-br from-white to-purple-600">
      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-lg text-center w-[90%] max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-400">
          AI Caption Generator
        </h1>
        <p className="text-lg text-blue-600 mb-6">
          Generate AI-powered captions effortlessly! Enhance your social media game now.
        </p>

        {/* Signed In View */}
        <SignedIn>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
          >
            <Link href="/explore" className="mt-4 bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-lg text-lg shadow-lg">
              Start Generating Captions
            </Link>
          </motion.div>
        </SignedIn>

        {/* Signed Out View */}
        <SignedOut>
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          >
            <SignInButton mode="modal">
              <button className="bg-green-500 hover:bg-green-600 transition-all text-white px-6 py-3 rounded-lg text-lg shadow-lg">
                Sign In to Generate Custom Captions
              </button>
            </SignInButton>
          </motion.div>
          <p className="mt-4 text-blue-600">
            Sign in to unlock <span className="text-2xl font-semibold">image-based</span> AI captions and personalized suggestions.
          </p>
        </SignedOut>
      </motion.div>
    </div>
  );
}
