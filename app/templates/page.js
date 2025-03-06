"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const captionTemplates = [
    {
        category: "Funny",
        captions: [
            "When life gives you lemons, add vodka and throw a party! 🍋🍸",
            "I followed my heart, and it led me to the fridge. 🥪😂",
            "That awkward moment when you realize you’ve been talking to yourself for 10 minutes. 😅💬",
        ],
    },
    {
        category: "Motivational",
        captions: [
            "Every day is a fresh start. Take a deep breath and begin again. 🌟",
            "Dream big, work hard, stay humble. 🚀✨",
            "You are your only limit. Push forward! 💪🔥",
        ],
    },
    {
        category: "Poetic",
        captions: [
            "Like the moon, we must go through phases of emptiness to feel full again. 🌙✨",
            "Dancing with the shadows, whispering with the wind. 🎶🌌",
            "Stars don’t compete, they shine in their own way. ✨🌠",
        ],
    },
];

export default function TemplatePage() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleCopy = (caption) => {
        navigator.clipboard.writeText(caption);
        alert("Copied to clipboard!");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-2xl border"
        >
            <h1 className="text-3xl font-bold text-gray-800 text-center">Caption Templates</h1>

            {/* Category Filter */}
            <div className="flex justify-center gap-4 mt-4">
                <button
                    className={`px-4 py-2 rounded-xl ${selectedCategory === "All" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setSelectedCategory("All")}
                >
                    All
                </button>
                {captionTemplates.map((item) => (
                    <button
                        key={item.category}
                        className={`px-4 py-2 rounded-xl ${selectedCategory === item.category ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectedCategory(item.category)}
                    >
                        {item.category}
                    </button>
                ))}
            </div>

            {/* Captions List */}
            <div className="mt-6 space-y-4">
                {captionTemplates
                    .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
                    .map((item) => (
                        <div key={item.category}>
                            <h2 className="text-xl font-semibold text-gray-700">{item.category}</h2>
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-3"
                            >
                                {item.captions.map((caption, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-gray-100 p-4 rounded-xl flex justify-between items-center shadow-md border border-gray-200"
                                    >
                                        <p 
                                            className="text-lg text-gray-900"
                                            dangerouslySetInnerHTML={{
                                                __html: caption.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
                                            }}
                                        />
                                        <button 
                                            className="ml-4 text-blue-500 hover:text-blue-700"
                                            onClick={() => handleCopy(caption)}
                                        >
                                            📋 Copy
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    ))}
            </div>
        </motion.div>
    );
}
