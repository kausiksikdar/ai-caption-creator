"use client";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import DialogModal from "@/components/DialogModal";

export default function Explore() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [no, setno] = useState("");
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [tone, setTone] = useState("funny");
  const [language, setLanguage] = useState("en");
  const [reason, setReason] = useState("personal");
  const [platform, setPlatform] = useState("fb");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setPrompt("");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const showModal = (title, message) => {
  setModalTitle(title);
  setModalMessage(message);
  setModalOpen(true);
};

  const handleGenerate = async () => {
    if (!prompt && !image)
      return alert("Please enter a prompt or upload an image!");
    setLoading(true);
    setCaptions([]);

    const formData = new FormData();
    if (image) formData.append("image", image);
    if (prompt) formData.append("prompt", prompt);
    formData.append("tone", tone);
    formData.append("language", language);
    formData.append("no", no);
    formData.append("reason", reason);
    formData.append("platform", platform);
    formData.append("userId", user?.id || ""); // ✅ Add userId

    console.log(
      "Sending Request with:",
      Object.fromEntries(formData.entries())
    );

    try {
      const response = await fetch("/api/generateCaption", {
        method: "POST",
        body: formData,
      });

      console.log("Response Status:", response.status);

      const data = await response.json();
      console.log("API Response Data:", data);

      setLoading(false);

      if (data.captions) {
        setCaptions(data.captions);
      } else {
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setLoading(false);
      alert("Failed to fetch captions. Check the console for details.");
    }
  };

  const handleSaveCaption = async (caption) => {
    if (!user) {
      showModal("Error", "You need to be signed in to save captions.");
        return;
    }

    let imageBase64 = null;
    if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = async () => {
            imageBase64 = reader.result;

            try {
                const response = await fetch("/api/saveCaption", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        prompt,
                        caption,
                        image: imageBase64, // Send Base64 image
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                  showModal("Success", "Caption saved successfully!");
                } else {
                    alert("Error: " + data.error);
                }
            } catch (error) {
                console.error("Save Caption Error:", error);
                alert("Failed to save caption. Check console for details.");
            }
        };
    } else {
        // If no image, send data directly
        try {
            const response = await fetch("/api/saveCaption", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    prompt,
                    caption,
                    image: null, // No image
                }),
            });

            const data = await response.json();
            if (response.ok) {
              showModal("Success", "Caption saved successfully!");
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Save Caption Error:", error);
            alert("Failed to save caption. Check console for details.");
        }
    }
};

  return (
    <>
      <SignedIn>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gray-100 p-8 space-y-8"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.firstName || "User"}! 👋
            </h2>
            <p className="text-gray-600">
              Create AI-powered captions instantly!
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <h3 className="text-lg font-semibold">Generate Caption</h3>

            <label className="block text-gray-700 font-medium">
              Select Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
            >
              <option value="funny">Funny 😂</option>
              <option value="motivational">Motivational 💪</option>
              <option value="poetic">Poetic ✨</option>
              <option value="professional">Professional 👔</option>
              <option value="short & catchy">Short & Catchy 🎯</option>
            </select>

            <label className="block text-gray-700 font-medium">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>

            <label className="block text-gray-700 font-medium">
              Select Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
            >
              <option value="fb">Facebook - Overall Community</option>
              <option value="ig">Instagram - GenZ</option>
              <option value="tw">Twitter - Formal</option>
            </select>

            <label className="block text-gray-700 font-medium">
              Select Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border rounded-lg mt-1 bg-gray-50"
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="beloved">Beloved</option>
              <option value="show Respect">Show Respect</option>
            </select>

            <input
              type="text"
              placeholder="Enter no of captions..."
              value={no}
              onChange={(e) => setno(e.target.value)}
              className="w-full p-3 border rounded-lg mt-4 bg-gray-50"
            />

            <input
              type="text"
              placeholder="Describe little bit for more accuracy..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg mt-4 bg-gray-50"
              required
            />

            <label className="block text-gray-700 font-medium mt-4">
              Upload an Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
            {preview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-2 relative"
              >
                <Image
                  src={preview}
                  alt="Uploaded"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
                >
                  Delete
                </button>
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg mt-4 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Caption"}
            </motion.button>
          </motion.div>

          {captions.length > 0 && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-2"
            >
              <h3 className="text-lg font-semibold">Recent Captions</h3>
              <ul className="list-none space-y-2">
                {captions.map((caption, index) => (
                  <li
                    key={index}
                    className="text-gray-800 py-1 flex justify-between items-center"
                  >
                    <span>
                      {caption.split(" ").map((word, i) =>
                        word.startsWith("#") ? (
                          <span key={i} className="text-blue-600 font-medium">
                            {word}{" "}
                          </span>
                        ) : (
                          <span key={i} className="text-gray-900">
                            {word}{" "}
                          </span>
                        )
                      )}
                    </span>
                    {index > 0 && <button
                      onClick={() => handleSaveCaption(caption)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 ml-2"
                    >
                      Save
                    </button>}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <DialogModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title={modalTitle}
  message={modalMessage}
/>
    </>
  );
}
