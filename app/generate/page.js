"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function GenerateCaption() {
    const [prompt, setPrompt] = useState("");
    const [tone, setTone] = useState("funny");
    const [language, setLanguage] = useState("en");
    const [captions, setCaptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        setCaptions([]);

        try {
            const response = await fetch("/api/generatePage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, tone, language })
            });

            const data = await response.json();
            console.log("API Response:", data);

            setLoading(false);

            if (data.caption) {
                let allCaptions = Array.isArray(data.caption) ? data.caption : data.caption.split("\n");

                if (allCaptions[0].match(/^\d*\s*$/)) {
                    allCaptions.shift();
                }

                const formattedCaptions = allCaptions.map((caption) =>
                    caption.replace(/^\d+\.\s*/, "").trim()
                );

                setCaptions(formattedCaptions);
            } else {
                alert("Error: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            setLoading(false);
            console.error("Fetch Error:", error);
            alert("Failed to fetch captions.");
        }
    };

    const handleCopy = (caption, index) => {
            navigator.clipboard.writeText(caption);
            setCopiedIndex(index);

            setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 sec
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 max-w-xl mx-auto bg-white/90 shadow-2xl rounded-3xl border border-gray-200 backdrop-blur-lg"
        >
            <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">AI Caption Generator</h1>

            <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Describe your image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-4 border rounded-xl text-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            <motion.select
                whileHover={{ scale: 1.02 }}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-4 border rounded-xl text-lg bg-gray-50 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
                <option value="funny">😂 Funny</option>
                <option value="motivational">💪 Motivational</option>
                <option value="poetic">📜 Poetic</option>
                <option value="professional">👔 Professional</option>
                <option value="short">⚡ Short & Catchy</option>
            </motion.select>

            <motion.select
                whileHover={{ scale: 1.02 }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-4 border rounded-xl text-lg bg-gray-50 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="zh">🇨🇳 Chinese</option>
            </motion.select>

            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold px-4 py-3 rounded-xl mt-5 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate Caption"}
            </motion.button>

            {captions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-5 mt-5 border rounded-2xl bg-gray-100 space-y-3 shadow-md"
                >
                    <h2 className="text-xl font-semibold text-gray-800">Generated Captions:</h2>
                    {captions.map((caption, index) => (
                        <div 
                            key={index} 
                            className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-200"
                        >
                            <p 
                                className="text-lg text-gray-900 flex-1 mr-3"
                                dangerouslySetInnerHTML={{
                                    __html: caption.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
                                }}
                            />
                            {index > 1 && index != 12 && <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCopy(caption, index)}
                                className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all ${
                                    (index > 1 && index != 12 && copiedIndex === index)
                                        ? "bg-green-500" 
                                        : "bg-gray-600 hover:bg-gray-700"
                                }`}
                            >
                                {(index > 1 && index != 12 && copiedIndex === index) ?  "Copied ✅" : "Copy 📋"}
                            </motion.button>}
                        </div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
