// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import ContactForm from "@/components/LLPMG/ContactForm";

// const LLPMGContactUsPage: React.FC = () => {
//     const [choice, setChoice] = useState<string | null>(null);
//     const router = useRouter();

//     const handleChoice = (selectedChoice: string) => {
//         if (selectedChoice === "contact") {
//             setChoice("contact");
//         } else if (selectedChoice === "newPatient") {
//             router.push("/llpmg/intake-packet");
//         }
//     };

//     if (choice === "contact") {
//         return (
//             <div className="p-4">
//                 <ContactForm />
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
//             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center w-full max-w-md">
//                 <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
//                     How can we help you today?
//                 </h1>
//                 <div className="space-y-4 flex flex-col items-center">
//                     <button
//                         onClick={() => handleChoice("contact")}
//                         className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                     >
//                         Contact the Clinic
//                     </button>
//                     <Link href="/llpmg/intake-packet" className="w-full">
//                         <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
//                             Fill Out New Patient Packet
//                         </button>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LLPMGContactUsPage;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactForm from "@/components/LLPMG/ContactForm";

const LLPMGContactUsPage: React.FC = () => {
    const [choice, setChoice] = useState<string | null>(null);
    const router = useRouter();

    const handleChoice = (selectedChoice: string) => {
        if (selectedChoice === "contact") {
            setChoice("contact");
        } else if (selectedChoice === "newPatient") {
            router.push("/llpmg/intake-packet");
        }
    };

    if (choice === "contact") {
        return (
            <div className="p-4">
                <ContactForm />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    How can we help you today?
                </h1>

                <div className="space-y-4 flex flex-col items-center">
                    <button
                        onClick={() => handleChoice("contact")}
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Contact the Clinic
                    </button>
                    <Link href="/llpmg/intake-packet" className="w-full">
                        <button className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                            Fill Out New Patient Packet
                        </button>
                    </Link>
                </div>

                {/* Flashy Phone Number Section */}
                <div className="mt-8 flex flex-col justify-center items-center">
                    <a
                        href="tel:+14428804200"
                        className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text hover:from-green-400 hover:to-blue-500 hover:via-teal-300 transition duration-300 transform hover:scale-110 animate-pulse focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center justify-center"
                    >
                        (442)-880-4200
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Call us to get in contact immediately!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LLPMGContactUsPage;
