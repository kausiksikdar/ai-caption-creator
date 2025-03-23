"use client";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { Bar } from "react-chartjs-2"; // Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SavedCaptions() {
  const { user } = useUser();
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(null); // Track which caption is loading insights
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [selectedInsights, setSelectedInsights] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`/api/getCaptions?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setCaptions(data.captions);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const openDeleteModal = (captionId) => {
    setSelectedCaption(captionId);
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
    setSelectedCaption(null);
  };

  const handleDelete = async () => {
    if (!selectedCaption) return;

    try {
      const response = await fetch(`/api/deleteCaption`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ captionId: selectedCaption, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete caption");
      }

      setCaptions(
        captions.filter((caption) => caption._id !== selectedCaption)
      );
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      alert("Failed to delete caption.");
    }
  };

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

  const handleCopy = (captionId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionId(captionId);

    // Reset the copied state after 2 seconds
    setTimeout(() => setCopiedCaptionId(null), 2000);
  };

  // New function to post to community
  const handlePostToCommunity = async (caption, imageUrl) => {
    try {
      const response = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.fullName,
          caption,
          imageUrl, // Using the existing image URL if available
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Posted to community!");
      } else {
        alert("Failed to post.");
      }
    } catch (error) {
      console.error("Error posting to community:", error);
      alert("Error posting to community.");
    }
  };

  const fetchInsights = async (captionId, captionText) => {
    setLoadingInsights(captionId);
    try {
      const response = await fetch("/api/geminiAnalyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: captionText }),
      });
      const data = await response.json();
      setSelectedInsights(data);
      setIsInsightsOpen(true);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      alert("Error fetching AI insights.");
    }
    setLoadingInsights(null);
  };

  return (
    <>
      <SignedIn>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gray-100 p-6"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Your Saved Captions
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : captions.length === 0 ? (
              <p className="text-gray-500">No captions saved yet.</p>
            ) : (
              captions.map((captionData) => {
                const captionsArray =
                  typeof captionData.captions === "string"
                    ? captionData.captions.split("\n")
                    : Array.isArray(captionData.captions)
                    ? captionData.captions
                    : [];

                const isImageBased = captionsArray[0]?.startsWith(
                  "Image-Based Caption"
                );

                return (
                  <motion.div
                    key={captionData._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 p-4 rounded-lg my-4 shadow relative"
                  >
                    {captionData.prompt && (
                      <p className="font-semibold text-gray-900">
                        {captionData.prompt}
                      </p>
                    )}
                    {captionData.image && (
                      <img
                        src={captionData.image} // Cloudinary URL
                        alt="Generated Image"
                        className="w-full max-h-100 object-contain rounded-md"
                        onError={(e) => (e.target.style.display = "none")} // Hide if broken
                      />
                    )}

                    <ul className="list-none space-y-1 mt-2 text-gray-700">
                      {captionsArray.map((cap, i) => (
                        <li
                          key={i}
                          className="justify-between items-center"
                        >
                          <p
                            className="text-lg text-gray-900 flex-1 mr-3"
                            dangerouslySetInnerHTML={{
                              __html: cap.replace(
                                /#(\w+)/g,
                                '<span class="text-blue-500">#$1</span>'
                              ),
                            }}
                          />
                          <div className="flex gap-40 justify-center space-x-2">
                          <div className="flex gap-5 justify-center space-x-2">
                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(captionData._id, cap)}
                              className={`px-3 py-1 rounded-full text-xs ${
                                copiedCaptionId === captionData._id
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300 text-black hover:bg-gray-400"
                              }`}
                            >
                              {copiedCaptionId === captionData._id
                                ? "✅"
                                : "Copy"}
                            </button>

                            {/* Share Icons (Side-by-Side) */}
                            <a
                              href={getShareURL("twitter", cap)}
                              target="_blank"
                            >
                              <FaTwitter className="text-blue-400 text-3xl hover:text-blue-500" />
                            </a>
                            <a
                              href={getShareURL("facebook", cap)}
                              target="_blank"
                            >
                              <FaFacebook className="text-blue-600 text-3xl hover:text-blue-700" />
                            </a>
                            <a
                              href={getShareURL("linkedin", cap)}
                              target="_blank"
                            >
                              <FaLinkedin className="text-blue-800 text-3xl hover:text-blue-900" />
                            </a>
                            <a
                              href={getShareURL("whatsapp", cap)}
                              target="_blank"
                            >
                              <FaWhatsapp className="text-green-500 text-3xl hover:text-green-600" />
                            </a>
                          </div>
                          {/* Insights Chart */}
                          <button className="bg-orange-500 rounded-sm font-serif"
                            onClick={() => fetchInsights(captionData._id, cap)}
                          >
                            {loadingInsights === captionData._id
                              ? "Fetching Insights..."
                              : "Get Insights"}
                          </button>
                          </div>

                          {/* Modal for Insights */}
                          {isInsightsOpen && (
                            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm p-4">
                              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h2 className="text-lg font-bold text-gray-800">
                                  AI Insights
                                </h2>
                                {selectedInsights ? (
                                  <Bar
                                    data={{
                                      labels: [
                                        "Sentiment",
                                        "Engagement",
                                        "Relevance",
                                      ],
                                      datasets: [
                                        {
                                          label: "Scores (0-100)",
                                          data: [
                                            selectedInsights.sentimentScore,
                                            selectedInsights.engagementScore,
                                            selectedInsights.relevanceScore,
                                          ],
                                          backgroundColor: [
                                            "#4CAF50",
                                            "#FFC107",
                                            "#2196F3",
                                          ],
                                        },
                                      ],
                                    }}
                                    options={{
                                      scales: {
                                        y: { beginAtZero: true, max: 100 },
                                      },
                                    }}
                                  />
                                ) : (
                                  <p>No insights available.</p>
                                )}
                                <button
                                  onClick={() => setIsInsightsOpen(false)}
                                  className="mt-4 px-4 py-2 bg-gray-300 rounded"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                      {/* New: Post to Community Button */}
                    <button
                      onClick={() => handlePostToCommunity(captionData.captions, captionData.image)}
                      className="bg-purple-500 text-white px-4 py-1 rounded-md mt-2"
                    >
                      Post to Community
                    </button>

                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(captionData.createdAt).toLocaleString()}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openDeleteModal(captionData._id)}
                      className="absolute top-2 right-2 bg-red-500 font-bold px-3 py-1 rounded-full text-xs hover:bg-red-600 transition-all"
                    >
                      Delete
                    </motion.button>
                  </motion.div>
                );
              })
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <Dialog
            open={isOpen}
            onClose={closeDeleteModal}
            className="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            >
              <Dialog.Title className="text-lg font-bold text-gray-800">
                Confirm Deletion
              </Dialog.Title>
              <Dialog.Description className="text-gray-600 mt-2">
                Are you sure you want to delete this caption? This action cannot
                be undone.
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 font-bold rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </Dialog>
        </motion.div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
