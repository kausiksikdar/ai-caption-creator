"use client";
import { SignedIn, SignedOut, RedirectToSignIn} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boostedPosts, setBoostedPosts] = useState(new Set()); // Track boosted posts

  // Fetch community posts
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/community/get");
      const data = await res.json();
      if (data.success) setPosts(data.posts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  // Delete post function
  const deletePost = async (postId) => {
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
  };

  // Toggle Boost function
  const toggleBoost = async (postId) => {
    const isBoosted = boostedPosts.has(postId);
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

      if (isBoosted) {
        const newBoosts = new Set(boostedPosts);
        newBoosts.delete(postId);
        setBoostedPosts(newBoosts);
      } else {
        setBoostedPosts(new Set([...boostedPosts, postId]));
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Community Posts</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post._id}
                className="bg-gray-100 p-6 my-4 rounded-md shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-semibold text-lg">{post.username}</p>
                {/* Styled caption with blue hashtags */}
                <p className="mb-2">
                  {post.caption.split(" ").map((word, index) =>
                    word.startsWith("#") ? (
                      <span key={index} className="text-blue-500 font-semibold">
                        {word}{" "}
                      </span>
                    ) : (
                      word + " "
                    )
                  )}
                </p>

                {/* Centered Image */}
                {post.imageUrl && (
                  <div className="flex justify-center">
                    <img
                      src={post.imageUrl}
                      alt="Post Image"
                      className="mt-3 w-48 rounded-md"
                    />
                  </div>
                )}

                {/* Boost Section */}
                <div className="mt-3 flex items-center gap-4">
                  <p className="font-semibold">Boosts: {post.boosts || 0}</p>
                  <button
                    onClick={() => toggleBoost(post._id)}
                    className={`px-4 py-1 rounded-md text-white ${
                      boostedPosts.has(post._id) ? "bg-gray-400" : "bg-blue-500"
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
