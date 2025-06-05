'use client';
import React, { useState, useRef } from 'react';
import { IoArrowForward } from "react-icons/io5";

const SubscribeForm = ({ title = "Stay Updated", description = "Subscribe to our newsletter for the latest updates." }) => {
    const [result, setResult] = useState<string>("");
    const formRef = useRef<HTMLFormElement | null>(null);

    // ✅ "All" tag selected by default
    const [selectedTags, setSelectedTags] = useState<string[]>(["Infinity (All)"]);

    const handleTagChange = (tag: string) => {
        setSelectedTags((prevTags) => {
            if (tag === "Infinity (All)") {
                return ["Infinity (All)"]; // Selecting "All" unselects everything else
            }
            else {
                const updatedTags = prevTags.includes(tag)
                    ? prevTags.filter((t) => t !== tag) // Unselect tag
                    : [...prevTags.filter((t) => t !== "Infinity (All)"), tag]; // Remove "All" if selecting other tags

                return updatedTags.length === 0 ? ["Infinity (All)"] : updatedTags; // Ensure "All" is selected if nothing else is
            }
        });
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setResult("Subscribing...");

        try {
            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");
            const email = formData.get("email");

            const response = await fetch("/api/subscribe", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    tags: selectedTags, // Send selected tags
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                setResult("✅ Subscription successful! Check your email inbox or spam to confirm.");
                formRef.current?.reset();
                setSelectedTags(["Infinity (All)"]); // Reset to default after submission
            } else {
                console.error("Error:", data);
                setResult(`❌ ${data.error || "Something went wrong. Please try again."}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            setResult("❌ An error occurred. Please try again later.");
        }
    };

    return (
        <div id="subscribe" className="mt-16 w-full px-6 sm:px-[12%] py-10 dark:text-white border border-gray-400 rounded-lg">
            <h4 className="text-center mb-2 text-lg font-Ovo">{title}</h4>
            <h2 className="text-center text-4xl sm:text-5xl font-Ovo">{description}</h2>
            <p className="text-center max-w-2xl mx-auto mt-5 mb-12 font-Ovo">
                Get the latest updates on topics of your choice!
            </p>

            <form ref={formRef} onSubmit={onSubmit} className="max-w-2xl mx-auto">
                {/* Name & Email Fields (Responsive Grid) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 mb-8">
                    <input
                        className="w-full p-3 outline-none border border-gray-400 rounded-md bg-white dark:bg-darkTheme/50 dark:border-white"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        required
                    />
                    <input
                        className="w-full p-3 outline-none border border-gray-400 rounded-md bg-white dark:bg-darkTheme/50 dark:border-white"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Checkbox for categories */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Select your interests:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                            "Infinity (All)",
                            "AI/ML",
                            "Web Dev",
                            "Tech Trends",
                            "Research",
                            "Career & Productivity"
                        ].map((category) => (
                            <label key={category} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    value={category}
                                    onChange={() => handleTagChange(category)}
                                    checked={selectedTags.includes(category)}
                                    className="w-4 h-4"
                                />
                                <span>{category}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="py-3 px-8 w-full sm:w-max flex items-center justify-center gap-2 bg-black/80 text-white rounded-full mx-auto hover:bg-black duration-500 dark:bg-transparent dark:border-[0.5px] dark:hover:bg-darkHover"
                >
                    Subscribe Now
                    <IoArrowForward className="w-4" />
                </button>

                {/* Success/Error Message */}
                {result && <p className="mt-4 text-center">{result}</p>}
            </form>
        </div>
    );
};

export default SubscribeForm;