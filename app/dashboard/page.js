"use client";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";

export default function SavedCaptions() {
  const { user } = useUser();
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState(null);

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

  const handleCopy = (captionId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionId(captionId);

    // Reset the copied state after 2 seconds
    setTimeout(() => setCopiedCaptionId(null), 2000);
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
                    {captionData.image &&
                        <img
                          src={captionData.image} // Cloudinary URL
                          alt="Generated Image"
                          className="w-full max-h-100 object-contain rounded-md"
                          onError={(e) => (e.target.style.display = "none")} // Hide if broken
                        />
              }


                    <ul className="list-none space-y-1 mt-2 text-gray-700">
                    {captionsArray.map((cap, i) => (
                      <li
                        key={i}
                        className="text-gray-800 flex items-center justify-between"
                      >
                        <span>
                          {cap.split(" ").map((word, idx) =>
                            word.startsWith("#") ? (
                              <span
                                key={idx}
                                className="text-blue-500 font-medium"
                              >
                                {word}{" "}
                              </span>
                            ) : (
                              <span key={idx}>{word} </span>
                            )
                          )}
                        </span>

                          {/* Copy Button - Only the clicked one changes */}
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleCopy(
                                captionData._id,
                                captionsArray.join(" ")
                              )
                            }
                            className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs transition-all ${
                              copiedCaptionId === captionData._id
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-black hover:bg-gray-400"
                            }`}
                          >
                            {copiedCaptionId === captionData._id
                              ? "Copied ✅"
                              : "Copy 📋"}
                          </motion.button>
                        </li>
                      ))}
                    </ul>

                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(captionData.createdAt).toLocaleString()}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openDeleteModal(captionData._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600 transition-all"
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
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
