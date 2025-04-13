"use client";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Neon Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-[0_0_30px_#00f7ff] text-center w-[90%] max-w-3xl border border-white/20"
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00f7ff] via-[#ff00e0] to-[#00f7ff]"
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 10px #00f7ff",
                "0 0 20px #ff00e0",
                "0 0 30px #00f7ff",
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

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl font-medium text-white/90"
        >
          <motion.span
            animate={{
              color: ["#00f7ff", "#ff00e0", "#00ff95"],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              repeatType: "mirror",
            }}
          >
            🚀 Transform your social media with AI-powered captions.
          </motion.span>
          <br />
          Generate{" "}
          <motion.span
            animate={{
              color: ["#ff4d4d", "#ffcc00", "#00ff95"],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              repeatType: "mirror",
            }}
          >
            unique, creative, and engaging
          </motion.span>{" "}
          content effortlessly!
        </motion.p>

        {/* Signed In CTA */}
        <SignedIn>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-10"
          >
            <Link href="/explore">
              <button className="bg-[#00f7ff] hover:bg-[#00d6e0] transition-all text-black px-8 py-4 rounded-full text-xl font-bold shadow-[0_0_20px_#00f7ff] hover:shadow-[0_0_30px_#00f7ff]">
                🚀 Start Generating Now
              </button>
            </Link>
          </motion.div>
        </SignedIn>

        {/* Signed Out CTA */}
        <SignedOut>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-10"
          >
            <SignInButton mode="modal">
              <button className="bg-[#ff00e0] hover:bg-[#ff33e6] transition-all text-white px-8 py-4 rounded-full text-xl font-bold shadow-[0_0_20px_#ff00e0] hover:shadow-[0_0_30px_#ff00e0]">
                ✨ Sign In to Unlock AI Magic
              </button>
            </SignInButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-6 text-white/80 text-lg"
          >
            🔐{" "}
            <motion.span
              animate={{
                color: ["#00f7ff", "#ff00e0"],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatType: "mirror",
              }}
            >
              Sign in to unlock
            </motion.span>{" "}
            <span className="text-xl font-semibold text-[#00f7ff]">
              image-based
            </span>{" "}
            AI captions & smart suggestions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-4 text-white/70 text-sm"
          >
            🎭{" "}
            <motion.span
              animate={{
                color: ["#00ff95", "#ffcc00", "#ff4d4d"],
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
            <span className="text-xl font-semibold text-[#00f7ff]">
              ahujarohit995@gmail.com
            </span>
            <br />
            Password:{" "}
            <motion.span
              animate={{
                textShadow: [
                  "0px 0px 5px #ff00e0",
                  "0px 0px 10px #ffff00",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatType: "mirror",
              }}
              className="text-xl font-semibold text-[#ff00e0]"
            >
              kosec@123
            </motion.span>
          </motion.p>
        </SignedOut>
      </motion.div>
    </div>
  );
}
