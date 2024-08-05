// "use client";

// import React, { useState, useRef, useEffect } from "react";

// const ContactForm: React.FC = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [reason, setReason] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError("");

//         const formData = new FormData();
//         formData.append("name", name);
//         formData.append("email", email);
//         formData.append("phone", phone);
//         formData.append("reason", reason);

//         if (fileInputRef.current && fileInputRef.current.files) {
//             formData.append("pdf", fileInputRef.current.files[0]);
//         }

//         try {
//             const response = await fetch("/api/llpmg-register-patient/route", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to register patient");
//             }

//             const data = await response.json();
//             alert(
//                 "Your information has been submitted successfully! Please check your email for confirmation."
//             );
//             // Reset form
//             setName("");
//             setEmail("");
//             setPhone("");
//             setReason("");
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = "";
//             }
//         } catch (err) {
//             setError(
//                 "An error occurred while submitting your information. Please try again."
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClick = () => {
//         if (
//             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//                 navigator.userAgent
//             )
//         ) {
//             window.location.href = "tel:9098804200";
//         } else {
//             window.location.href = "mailto:colton@lomalindapsych.com";
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className={`gap-[2rem] max-w-md mx-auto dark:text-[#D1E0EB]" "text-[#494949]"
//             }`}
//         >
//             <div className="flex flex-col justify-center items-center">
//                 <h1>Contact Us</h1>
//                 <a
//                     className="special-link"
//                     href="#"
//                     onClick={() => {
//                         handleClick;
//                     }}
//                 >
//                     (909) 880-4200
//                 </a>
//             </div>
//             {error && <p className="text-red-500 mb-4">{error}</p>}
//             <div className="mb-4">
//                 <label
//                     htmlFor="name"
//                     className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
//                 >
//                     Name
//                 </label>
//                 <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="email"
//                     className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
//                 >
//                     Email
//                 </label>
//                 <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="phone"
//                     className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
//                 >
//                     Phone
//                 </label>
//                 <input
//                     type="tel"
//                     id="phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="reason"
//                     className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
//                 >
//                     Reason for Visit
//                 </label>
//                 <textarea
//                     id="reason"
//                     value={reason}
//                     onChange={(e) => setReason(e.target.value)}
//                     required
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//             </div>
//             <div className="mb-4">
//                 <label
//                     htmlFor="pdf"
//                     className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
//                 >
//                     Upload PDF Document (optional)
//                 </label>
//                 <input
//                     type="file"
//                     id="pdf"
//                     ref={fileInputRef}
//                     accept=".pdf"
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//             </div>
//             <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full py-2 px-4 bg-[#6EA4CE] hover:bg-[#1FABC7] text-white rounded ${
//                     isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//             >
//                 {isLoading ? "Submitting..." : "Submit"}
//             </button>
//         </form>
//     );
// };

// export default ContactForm;

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import debounce from "lodash/debounce";

// const insurances = [
//     { name: "IEHP", logo: "/iehp.svg", url: "https://www.iehp.org" },
//     {
//         name: "Blue Cross Blue Shield",
//         logo: "/blue-cross-blue-shield.svg",
//         url: "https://www.blueshieldca.com/",
//     },
//     {
//         name: "UnitedHealthcare",
//         logo: "/united-healthcare.svg",
//         url: "https://www.uhc.com/",
//     },
//     {
//         name: "Health Net",
//         logo: "/health-net.svg",
//         url: "https://www.healthnet.com/content/healthnet/en_us.html",
//     },
//     {
//         name: "Central Health Plan of California",
//         logo: "/central-health-plan.svg",
//         url: "https://www.centralhealthplan.com/",
//     },
//     { name: "Aetna", logo: "/aetna.svg", url: "https://www.aetna.com/" },
//     { name: "Cigna", logo: "/cigna.svg", url: "https://www.cigna.com/" },
//     {
//         name: "Medicare",
//         logo: "/medicare.svg",
//         url: "https://www.medicare.gov/",
//     },
// ];

// const states = ["CA", "AZ", "NV", "OR", "WA"];

// const ContactForm: React.FC = () => {
//     const [firstName, setFirstName] = useState("");
//     const [lastName, setLastName] = useState("");
//     const [email, setEmail] = useState("");
//     const [phone, setPhone] = useState("");
//     const [birthday, setBirthday] = useState("");
//     const [insurance, setInsurance] = useState("");
//     const [address, setAddress] = useState("");
//     const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
//     const [city, setCity] = useState("");
//     const [state, setState] = useState("");
//     const [zipCode, setZipCode] = useState("");
//     const [pharmacy, setPharmacy] = useState("");
//     const [pharmacySuggestions, setPharmacySuggestions] = useState<string[]>(
//         []
//     );
//     const [reason, setReason] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState("");
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const debouncedAddressSearch = debounce(async (input: string) => {
//         console.log("Searching for address:", input);
//         if (input.length > 2) {
//             try {
//                 const response = await fetch(
//                     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//                         input
//                     )}&countrycodes=us`
//                 );
//                 const data = await response.json();
//                 console.log("Address API response:", data);
//                 const suggestions = data.map((item: any) => item.display_name);
//                 setAddressSuggestions(suggestions.slice(0, 5));
//                 console.log(
//                     "Set address suggestions:",
//                     suggestions.slice(0, 5)
//                 );
//             } catch (error) {
//                 console.error("Error fetching address suggestions:", error);
//             }
//         } else {
//             setAddressSuggestions([]);
//         }
//     }, 300);

//     const debouncedPharmacySearch = debounce(async (input: string) => {
//         console.log("Searching for pharmacy:", input);
//         if (input.length > 2) {
//             try {
//                 const response = await fetch(
//                     `https://clinicaltables.nlm.nih.gov/api/pharmacies/v3/search?terms=${encodeURIComponent(
//                         input
//                     )}&ef=address_line1,city,state`
//                 );
//                 const data = await response.json();
//                 console.log("Pharmacy API response:", data);
//                 const suggestions = data[3].map(
//                     (item: any) =>
//                         `${item[0]} - ${item[1]}, ${item[2]}, ${item[3]}`
//                 );
//                 setPharmacySuggestions(suggestions.slice(0, 5));
//                 console.log(
//                     "Set pharmacy suggestions:",
//                     suggestions.slice(0, 5)
//                 );
//             } catch (error) {
//                 console.error("Error fetching pharmacy suggestions:", error);
//             }
//         } else {
//             setPharmacySuggestions([]);
//         }
//     }, 300);

//     useEffect(() => {
//         return () => {
//             debouncedAddressSearch.cancel();
//             debouncedPharmacySearch.cancel();
//         };
//     }, []);

//     const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setAddress(value);
//         debouncedAddressSearch(value);
//     };

//     const handleAddressSelect = (selectedAddress: string) => {
//         setAddress(selectedAddress);
//         setAddressSuggestions([]);
//         // Parse the selected address to fill in city, state, and zip code
//         const parts = selectedAddress.split(", ");
//         if (parts.length >= 3) {
//             setCity(parts[parts.length - 3]);
//             setState(parts[parts.length - 2].split(" ")[0]);
//             setZipCode(parts[parts.length - 2].split(" ")[1]);
//         }
//     };

//     const handlePharmacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setPharmacy(value);
//         debouncedPharmacySearch(value);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError("");

//         const formData = new FormData();
//         formData.append("firstName", firstName);
//         formData.append("lastName", lastName);
//         formData.append("email", email);
//         formData.append("phone", phone);
//         formData.append("birthday", birthday);
//         formData.append("insurance", insurance);
//         formData.append("address", address);
//         formData.append("city", city);
//         formData.append("state", state);
//         formData.append("zipCode", zipCode);
//         formData.append("pharmacy", pharmacy);
//         formData.append("reason", reason);

//         if (fileInputRef.current && fileInputRef.current.files) {
//             formData.append("pdf", fileInputRef.current.files[0]);
//         }

//         try {
//             const response = await fetch("/api/llpmg-register-patient/route", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to register patient");
//             }

//             const data = await response.json();
//             alert(
//                 "Your information has been submitted successfully! Please check your email for confirmation."
//             );
//             // Reset form
//             setFirstName("");
//             setLastName("");
//             setEmail("");
//             setPhone("");
//             setBirthday("");
//             setInsurance("");
//             setAddress("");
//             setCity("");
//             setState("");
//             setZipCode("");
//             setPharmacy("");
//             setReason("");
//             if (fileInputRef.current) {
//                 fileInputRef.current.value = "";
//             }
//         } catch (err) {
//             setError(
//                 "An error occurred while submitting your information. Please try again."
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="max-w-md mx-auto dark:text-[#D1E0EB] text-[#494949]"
//         >
//             {error && <p className="text-red-500 mb-4">{error}</p>}

//             {/* ... (other form fields remain the same) ... */}

//             <div className="mb-4">
//                 <label htmlFor="address" className="block mb-2">
//                     Address
//                 </label>
//                 <input
//                     type="text"
//                     id="address"
//                     value={address}
//                     onChange={handleAddressChange}
//                     required
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//                 {addressSuggestions.length > 0 && (
//                     <ul className="mt-2 bg-white dark:bg-gray-800 border rounded">
//                         {addressSuggestions.map((suggestion, index) => (
//                             <li
//                                 key={index}
//                                 className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                                 onClick={() => handleAddressSelect(suggestion)}
//                             >
//                                 {suggestion}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {/* ... (city, state, zip code fields remain the same) ... */}

//             <div className="mb-4">
//                 <label htmlFor="pharmacy" className="block mb-2">
//                     Preferred Pharmacy
//                 </label>
//                 <input
//                     type="text"
//                     id="pharmacy"
//                     value={pharmacy}
//                     onChange={handlePharmacyChange}
//                     className="w-full px-3 py-2 border rounded text-[#494949] dark:text-[#D1E0EB] dark:bg-gray-700"
//                 />
//                 {pharmacySuggestions.length > 0 && (
//                     <ul className="mt-2 bg-white dark:bg-gray-800 border rounded">
//                         {pharmacySuggestions.map((suggestion, index) => (
//                             <li
//                                 key={index}
//                                 className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                                 onClick={() => {
//                                     setPharmacy(suggestion);
//                                     setPharmacySuggestions([]);
//                                 }}
//                             >
//                                 {suggestion}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>

//             {/* ... (remaining form fields) ... */}
//         </form>
//     );
// };

// export default ContactForm;

"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";

interface FormData {
    name: string;
    email: string;
    phone: string;
    reason: string;
    suggestedAppointment: Date | null;
    consentGiven: boolean;
}

const ContactForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const watchSuggestedAppointment = watch("suggestedAppointment");

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError("");

        if (!isValidAppointmentTime(data.suggestedAppointment)) {
            setError(
                "Please select a valid appointment time (Monday-Friday, 9 AM - 5 PM, at least 48 hours in advance)."
            );
            setIsLoading(false);
            return;
        }

        const formattedPhone = formatPhoneNumber(data.phone);

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "suggestedAppointment" && value) {
                formData.append(key, (value as Date).toISOString());
            } else if (key === "phone") {
                formData.append(key, formattedPhone);
            } else {
                formData.append(key, value as string);
            }
        });

        if (fileInputRef.current?.files?.[0]) {
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

            alert(
                "Your information has been submitted successfully! Please check your email and phone for confirmation."
            );
            Object.keys(data).forEach((key) =>
                setValue(key as keyof FormData, "")
            );
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

    const isValidAppointmentTime = (date: Date | null): boolean => {
        if (!date) return false;
        const day = date.getDay();
        const hours = date.getHours();
        const isWeekday = day > 0 && day < 6;
        const isBusinessHours = hours >= 9 && hours < 17;
        const isFutureDate = date > new Date(Date.now() + 48 * 60 * 60 * 1000);
        return isWeekday && isBusinessHours && isFutureDate;
    };

    const formatPhoneNumber = (phone: string): string => {
        const digitsOnly = phone.replace(/\D/g, "");
        return `+1${digitsOnly.slice(-10)}`;
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100, damping: 15 },
        },
    };

    return (
        <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="name"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Name
                </label>
                <input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-3 py-2 border rounded text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="email"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                        },
                    })}
                    className="w-full px-3 py-2 border rounded text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="phone"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Phone
                </label>
                <div className="flex">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        +1
                    </span>
                    <input
                        id="phone"
                        type="tel"
                        {...register("phone", {
                            required: "Phone is required",
                            pattern: {
                                value: /^[2-9]\d{9}$/,
                                message:
                                    "Invalid phone number. Please enter 10 digits without spaces or dashes.",
                            },
                        })}
                        placeholder="1234567890"
                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                </div>
                {errors.phone && (
                    <span className="text-red-500">{errors.phone.message}</span>
                )}
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="reason"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Reason for Visit
                </label>
                <textarea
                    id="reason"
                    {...register("reason", { required: "Reason is required" })}
                    className="w-full px-3 py-2 border rounded text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.reason && (
                    <span className="text-red-500">
                        {errors.reason.message}
                    </span>
                )}
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="suggestedAppointment"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Suggested Appointment Time
                </label>
                <DatePicker
                    selected={watchSuggestedAppointment}
                    onChange={(date: Date | null) =>
                        setValue("suggestedAppointment", date)
                    }
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-3 py-2 border rounded text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    minDate={new Date()}
                    placeholderText="Select a date and time"
                    popperClassName="react-datepicker-popper"
                    calendarClassName="react-datepicker-calendar"
                />
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label
                    htmlFor="pdf"
                    className="block mb-2 text-gray-700 dark:text-gray-300"
                >
                    Upload PDF Document (optional)
                </label>
                <input
                    type="file"
                    id="pdf"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="w-full px-3 py-2 border rounded text-gray-700 bg-white dark:text-gray-300 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </motion.div>

            <motion.div className="mb-4" variants={itemVariants}>
                <label className="flex items-center text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        {...register("consentGiven", {
                            required: "You must give consent to proceed",
                        })}
                        className="mr-2"
                    />
                    I consent to the processing of my personal data
                </label>
                {errors.consentGiven && (
                    <span className="text-red-500">
                        {errors.consentGiven.message}
                    </span>
                )}
            </motion.div>

            <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {isLoading ? "Submitting..." : "Submit"}
            </motion.button>
        </motion.form>
    );
};

export default ContactForm;
