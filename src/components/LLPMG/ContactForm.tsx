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
    // const [isDarkMode, setIsDarkMode] = useState(false);

    // useEffect(() => {
    //     // Check if dark mode is enabled
    //     const isDark = document.documentElement.classList.contains("dark");
    //     setIsDarkMode(isDark);

    //     // Optional: Listen for changes in dark mode
    //     const observer = new MutationObserver((mutations) => {
    //         mutations.forEach((mutation) => {
    //             if (
    //                 mutation.type === "attributes" &&
    //                 mutation.attributeName === "class"
    //             ) {
    //                 setIsDarkMode(
    //                     document.documentElement.classList.contains("dark")
    //                 );
    //             }
    //         });
    //     });

    //     observer.observe(document.documentElement, { attributes: true });

    //     return () => observer.disconnect();
    // }, []);

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

    const handleClick = () => {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            window.location.href = "tel:9098804200";
        } else {
            window.location.href = "mailto:colton@lomalindapsych.com";
        }
    };

    // Add this to your main layout or a client-side component
    // useEffect(() => {
    //     // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    //     if (
    //         localStorage.theme === "dark" ||
    //         (!("theme" in localStorage) &&
    //             window.matchMedia("(prefers-color-scheme: dark)").matches)
    //     ) {
    //         document.documentElement.classList.add("dark");
    //     } else {
    //         document.documentElement.classList.remove("dark");
    //     }
    // }, []);

    return (
        <form
            onSubmit={handleSubmit}
            // className={`max-w-md mx-auto ${
            //     isDarkMode ? "text-[#D1E0EB]" : "text-[#494949]"
            // }`}
            className={`gap-[2rem] max-w-md mx-auto dark:text-[#D1E0EB]" "text-[#494949]"
            }`}
        >
            <div className="flex flex-col justify-center items-center">
                <h1>Contact Us</h1>
                <a
                    className="special-link"
                    href="#"
                    onClick={() => {
                        handleClick;
                    }}
                >
                    (909) 880-4200
                </a>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
                >
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
                <label
                    htmlFor="email"
                    className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
                >
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
                <label
                    htmlFor="phone"
                    className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
                >
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
                <label
                    htmlFor="reason"
                    className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
                >
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
                <label
                    htmlFor="pdf"
                    className="block mb-2 text-[#494949] dark:text-[#D1E0EB]"
                >
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
