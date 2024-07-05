// components/FSClinicals/PatientRegistration.tsx
"use client";

import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FSClinicalsRootState } from "@/store/fsclinicalsStore";
import AppointmentSuggestion from "./AppointmentSuggestion";

interface AppointmentData {
    date: string;
    time: string;
}

const PatientRegistration: React.FC = () => {
    const isDarkMode = useSelector(
        (state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode
    );
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [reason, setReason] = useState("");
    const [suggestAppointment, setSuggestAppointment] = useState(false);
    const [appointmentData, setAppointmentData] = useState<AppointmentData>({
        date: "",
        time: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("reason", reason);
        formData.append("suggestAppointment", suggestAppointment.toString());

        if (fileInputRef.current && fileInputRef.current.files) {
            formData.append("pdf", fileInputRef.current.files[0]);
        }

        if (suggestAppointment) {
            formData.append("appointmentDate", appointmentData.date);
            formData.append("appointmentTime", appointmentData.time);
        }

        try {
            const response = await fetch("/api/register-patient/route", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to register patient");
            }

            const data = await response.json();
            alert(
                "Patient registered successfully! Please check your email for confirmation."
            );
            // Reset form
            setName("");
            setEmail("");
            setPhone("");
            setReason("");
            setSuggestAppointment(false);
            setAppointmentData({ date: "", time: "" });
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            console.log("data:\n", data);
        } catch (err) {
            console.log("error:\n", err);
            setError(
                "An error occurred while registering the patient. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`max-w-md mx-auto ${isDarkMode ? "text-[#D1E0EB]" : "text-[#494949]"}`}
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
                    className="w-full px-3 py-2 border rounded text-[#494949]"
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
                    className="w-full px-3 py-2 border rounded text-[#494949]"
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
                    className="w-full px-3 py-2 border rounded text-[#494949]"
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
                    className="w-full px-3 py-2 border rounded text-[#494949]"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="pdf" className="block mb-2">
                    Upload PDF Document
                </label>
                <input
                    type="file"
                    id="pdf"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="w-full px-3 py-2 border rounded text-[#494949]"
                />
            </div>
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={suggestAppointment}
                        onChange={(e) =>
                            setSuggestAppointment(e.target.checked)
                        }
                        className="mr-2"
                    />
                    Suggest an appointment
                </label>
            </div>
            {suggestAppointment && (
                <AppointmentSuggestion
                    appointmentData={appointmentData}
                    onAppointmentChange={setAppointmentData}
                />
            )}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 ${isDarkMode ? "bg-[#1FABC7] hover:bg-[#6EA4CE]" : "bg-[#6EA4CE] hover:bg-[#1FABC7]"} text-white rounded ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                {isLoading
                    ? "Submitting..."
                    : suggestAppointment
                      ? "Register and Suggest Appointment"
                      : "Register"}
            </button>
        </form>
    );
};

export default PatientRegistration;
