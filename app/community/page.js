"use client";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";

export default function CommunityPage() {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boostedPosts, setBoostedPosts] = useState(new Set());
  const [filteredUserId, setFilteredUserId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch community posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/community/get");
        const data = await res.json();
        if (data.success) setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Delete post function
  const deletePost = async (postId) => {
    try {
      const res = await fetch("/api/community/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted!");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error deleting post. Please try again.");
    }
  };

  // Toggle Boost function
  const toggleBoost = async (postId) => {
    const isBoosted = boostedPosts.has(postId);
    try {
      const res = await fetch("/api/community/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, remove: isBoosted }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, boosts: data.boosts } : post
          )
        );
        setBoostedPosts((prev) => {
          const newBoosts = new Set(prev);
          if (isBoosted) newBoosts.delete(postId);
          else newBoosts.add(postId);
          return newBoosts;
        });
      } else {
        alert(data.message);
      }
    } catch {
      alert("Error boosting post. Please try again.");
    }
  };

  // Toggle User-Specific Filtering
  const toggleUserFilter = (userId) => {
    setFilteredUserId(filteredUserId === userId ? null : userId);
  };

  // Share Function
  const getShareURL = (platform, text) => {
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`;
      case "whatsapp":
        return `https://wa.me/?text=${encodedText}`;
      default:
        return "#";
    }
  };

  return (
    <>
      <SignedIn>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Community Posts</h1>
          {filteredUserId && (
            <button
              onClick={() => setFilteredUserId(null)}
              className="mb-4 px-4 py-2 bg-gray-300 rounded-md"
            >
              Show All Posts
            </button>
          )}
          {loading ? (
            <div className="animate-pulse">Loading...</div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            posts
              .filter((post) =>
                filteredUserId ? post.userId === filteredUserId : true
              )
              .map((post) => (
                <motion.div
                  key={post._id}
                  className="bg-gray-100 p-6 my-4 rounded-md shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="font-semibold text-lg cursor-pointer text-blue-600"
                    onClick={() => toggleUserFilter(post.userId)}
                  >
                    {post.username}
                  </p>
                  <p className="mb-2 text-gray-800">
                    {post.caption.split(" ").map((word, index) =>
                      word.startsWith("#") ? (
                        <span
                          key={index}
                          className="text-blue-500 font-semibold"
                        >
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                  {post.imageUrl && (
                    <div className="flex justify-center">
                      <img
                        src={post.imageUrl}
                        alt="Post Image"
                        className="mt-3 w-48 h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <p className="font-semibold">Boosts: {post.boosts || 0}</p>
                    <button
                      onClick={() => toggleBoost(post._id)}
                      className={`px-4 py-1 rounded-md text-white ${
                        boostedPosts.has(post._id)
                          ? "bg-gray-400"
                          : "bg-blue-500"
                      }`}
                    >
                      {boostedPosts.has(post._id) ? "Remove Boost" : "Boost"}
                    </button>
                    {user && user.id === post.userId && (
                      <button
                        onClick={() => deletePost(post._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    )}
                    {/* Share Icons (Side-by-Side) */}
                    {user && user.id === post.userId && (
                      <div className="mx-5 flex gap-10">
                        {" "}
                        <a
                          href={getShareURL("twitter", post.caption)}
                          target="_blank"
                        >
                          <FaTwitter className="text-blue-400 text-3xl hover:text-blue-500" />
                        </a>
                        <a
                          href={getShareURL("facebook", post.caption)}
                          target="_blank"
                        >
                          <FaFacebook className="text-blue-600 text-3xl hover:text-blue-700" />
                        </a>
                        <a
                          href={getShareURL("linkedin", post.caption)}
                          target="_blank"
                        >
                          <FaLinkedin className="text-blue-800 text-3xl hover:text-blue-900" />
                        </a>
                        <a
                          href={getShareURL("whatsapp", post.caption)}
                          target="_blank"
                        >
                          <FaWhatsapp className="text-green-500 text-3xl hover:text-green-600" />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
