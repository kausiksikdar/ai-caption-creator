"use client";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-300 text-gray-900">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/40 backdrop-blur-xl p-10 rounded-2xl shadow-2xl text-center w-[90%] max-w-3xl border border-white/50"
      >
        <div className="text-center">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-500 to-pink-500"
          >
            <motion.span
              animate={{
                textShadow: [
                  "0px 0px 10px rgba(255, 255, 255, 0.6)",
                  "0px 0px 20px rgba(255, 0, 255, 0.8)",
                  "0px 0px 30px rgba(0, 0, 255, 1)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "mirror",
              }}
            >
              AI Caption Generator
            </motion.span>
          </motion.h1>

          {/* Animated Subtext */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-gray-800 font-medium"
          >
            <motion.span
              animate={{
                color: ["#6B7280", "#9333EA", "#6366F1"],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                repeatType: "mirror",
              }}
            >
              🚀 Transform your social media with AI-powered captions.
            </motion.span>{" "}
            <br />
            Generate{" "}
            <motion.span
              animate={{
                color: ["#EF4444", "#F59E0B", "#10B981"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "mirror",
              }}
            >
              unique, creative, and engaging
            </motion.span>{" "}
            content effortlessly!
          </motion.p>
        </div>

        {/* Signed In View */}
        <SignedIn>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-8"
          >
            <Link href="/explore">
              <button className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl">
                🚀 Start Generating Now
              </button>
            </Link>
          </motion.div>
        </SignedIn>

        {/* Signed Out View */}
        <SignedOut>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-8"
          >
            <SignInButton mode="modal">
              <button className="bg-green-500 hover:bg-green-600 transition-all text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl">
                ✨ Sign In to Unlock AI Magic
              </button>
            </SignInButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-6 text-gray-800 text-lg"
          >
            🔐{" "}
            <motion.span
              animate={{
                color: ["#6B7280", "#9333EA", "#6366F1"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "mirror",
              }}
            >
              Sign in to unlock
            </motion.span>{" "}
            <span className="text-xl text-indigo-700 font-semibold">
              Image-based
            </span>{" "}
            AI captions & personalized suggestions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4 text-gray-700 text-sm"
          >
            🎭{" "}
            <motion.span
              animate={{
                color: ["#10B981", "#F59E0B", "#EF4444"],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                repeatType: "mirror",
              }}
            >
              To test as a guest:
            </motion.span>
            <br />
            <span className="text-xl font-semibold text-indigo-900">
              ahujarohit995@gmail.com
            </span>
            <br />
            Password:{" "}
            <motion.span
              animate={{
                textShadow: [
                  "0px 0px 5px rgba(255, 0, 0, 0.7)",
                  "0px 0px 10px rgba(255, 255, 0, 0.9)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatType: "mirror",
              }}
              className="text-xl font-semibold text-indigo-900"
            >
              kosec@123
            </motion.span>
          </motion.p>
        </SignedOut>
      </motion.div>
    </div>
  );
}
