"use client";

import React, { useState, useRef, useEffect } from "react";

const ContactForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if dark mode is enabled
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);

        // Optional: Listen for changes in dark mode
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    setIsDarkMode(
                        document.documentElement.classList.contains("dark")
                    );
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("reason", reason);

        if (fileInputRef.current && fileInputRef.current.files) {
            formData.append("pdf", fileInputRef.current.files[0]);
        }

        try {
            const response = await fetch("/api/llpmg-register-patient/route", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to register patient");
            }

            const data = await response.json();
            alert(
                "Your information has been submitted successfully! Please check your email for confirmation."
            );
            // Reset form
            setName("");
            setEmail("");
            setPhone("");
            setReason("");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setError(
                "An error occurred while submitting your information. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Add this to your main layout or a client-side component
    useEffect(() => {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className={`max-w-md mx-auto ${
                isDarkMode ? "text-[#D1E0EB]" : "text-[#494949]"
            }`}
        >
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block mb-2">
                    Phone
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="reason" className="block mb-2">
                    Reason for Visit
                </label>
                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="pdf" className="block mb-2">
                    Upload PDF Document (optional)
                </label>
                <input
                    type="file"
                    id="pdf"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 bg-[#6EA4CE] hover:bg-[#1FABC7] text-white rounded ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                {isLoading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};

export default ContactForm;
