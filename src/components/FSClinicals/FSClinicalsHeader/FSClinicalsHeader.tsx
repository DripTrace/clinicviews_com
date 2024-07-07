// 'use client'

// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { FSClinicalsRootState } from '@/store/fsclinicalsStore';
// import { fsclinicalsToggleDarkMode } from '@/store/slices/fsclinicalsThemeSlice';
// import Link from 'next/link';
// import dynamic from 'next/dynamic';

// const Moon = dynamic(() => import('lucide-react').then(mod => mod.Moon), { ssr: false });
// const Sun = dynamic(() => import('lucide-react').then(mod => mod.Sun), { ssr: false });
// const Menu = dynamic(() => import('lucide-react').then(mod => mod.Menu), { ssr: false });
// const X = dynamic(() => import('lucide-react').then(mod => mod.X), { ssr: false });
// const UserCircle = dynamic(() => import('lucide-react').then(mod => mod.UserCircle), { ssr: false });

// const FSClinicalsHeader: React.FC = () => {
//   const dispatch = useDispatch();
//   const isDarkMode = useSelector((state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const handleToggleDarkMode = () => {
//     dispatch(fsclinicalsToggleDarkMode());
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <header className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} text-white p-4`}>
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-2xl font-bold">Four Square Clinicals</Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:block">
//           <ul className="flex space-x-4">
//             <li><Link href="/" className="text-white hover:text-blue-200 transition-colors">Home</Link></li>
//             <li><Link href="/contact" className="text-white hover:text-blue-200 transition-colors">Contact</Link></li>
//             <li><Link href="/about" className="text-white hover:text-blue-200 transition-colors">About</Link></li>
//             <li><Link href="/forms" className="text-white hover:text-blue-200 transition-colors">Forms</Link></li>
//           </ul>
//         </nav>

//         {/* Mobile Navigation Icons */}
//         <div className="flex items-center space-x-4">
//           <button onClick={handleToggleDarkMode} className="p-2 rounded-full hover:bg-blue-700 transition-colors">
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//           <Link href="/signin" className="md:hidden">
//             <UserCircle size={24} />
//           </Link>
//           <button onClick={toggleMenu} className="md:hidden">
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden mt-4">
//           <nav>
//             <ul className="flex flex-col space-y-2">
//               <li><Link href="/" className="block py-2 px-4 hover:bg-blue-700 transition-colors" onClick={toggleMenu}>Home</Link></li>
//               <li><Link href="/contact" className="block py-2 px-4 hover:bg-blue-700 transition-colors" onClick={toggleMenu}>Contact</Link></li>
//               <li><Link href="/about" className="block py-2 px-4 hover:bg-blue-700 transition-colors" onClick={toggleMenu}>About</Link></li>
//               <li><Link href="/forms" className="block py-2 px-4 hover:bg-blue-700 transition-colors" onClick={toggleMenu}>Forms</Link></li>
//             </ul>
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// };

// export default FSClinicalsHeader;

"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FSClinicalsRootState } from "@/store/fsclinicalsStore";
import { fsclinicalsToggleDarkMode } from "@/store/slices/fsclinicalsThemeSlice";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

const Moon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), {
    ssr: false,
});
const Sun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), {
    ssr: false,
});
const Menu = dynamic(() => import("lucide-react").then((mod) => mod.Menu), {
    ssr: false,
});
const X = dynamic(() => import("lucide-react").then((mod) => mod.X), {
    ssr: false,
});
const UserCircle = dynamic(
    () => import("lucide-react").then((mod) => mod.UserCircle),
    { ssr: false }
);

const FSClinicalsHeader: React.FC = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector(
        (state: FSClinicalsRootState) => state.theme.fsclinicalsIsDarkMode
    );
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleDarkMode = () => {
        dispatch(fsclinicalsToggleDarkMode());
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header
            className={`${isDarkMode ? "bg-[#0C3C60]" : "bg-[#6EA4CE]"} p-4`}
        >
            <div className="container mx-auto flex justify-between items-center gap-[2rem]">
                <Link
                    href="/fsclinicals/fsclinicals-landing"
                    className={`${
                        isDarkMode ? "text-[#1FABC7]" : "text-[#0C3C60]"
                    } hover:text-[#D1E0EB] transition-colors text-2xl font-bold flex items-center justify-center gap-3`}
                >
                    <Image
                        src="/fsclinicals/fsclinicals_-.svg"
                        alt="fsclinicals-logo"
                        height={100}
                        width={100}
                        className={`size-[4rem] bg-white rounded-xl`}
                    />
                    Four Square Clinicals
                </Link>

                <nav className="hidden md:block">
                    <ul className="flex items-center justify-center space-x-[7rem]">
                        <li>
                            <Link
                                href="/fsclinicals/fsclinicals-landing"
                                className={`${
                                    isDarkMode
                                        ? "text-[#1FABC7]"
                                        : "text-[#0C3C60]"
                                } hover:text-[#D1E0EB] transition-colors`}
                            >
                                Home
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                href="/fsclinicals/contact-us"
                                className="hover:text-[#D1E0EB] transition-colors"
                            >
                                Contact
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                href="/fsclinicals/about"
                                className={`${
                                    isDarkMode
                                        ? "text-[#1FABC7]"
                                        : "text-[#0C3C60]"
                                } hover:text-[#D1E0EB] transition-colors`}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/fsclinicals/fsclinicals-view/fsclinicals-form"
                                className={`${
                                    isDarkMode
                                        ? "text-[#1FABC7]"
                                        : "text-[#0C3C60]"
                                } hover:text-[#D1E0EB] transition-colors`}
                            >
                                New Patient
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleToggleDarkMode}
                        className="p-2 rounded-full hover:bg-[#1FABC7] transition-colors"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <Link href="/signin" className="md:hidden">
                        <UserCircle size={24} />
                    </Link>
                    <button onClick={toggleMenu} className="md:hidden">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden mt-4">
                    <nav>
                        <ul className="flex flex-col space-y-2">
                            <li>
                                <Link
                                    href="/fsclinicals/fsclinicals-landing"
                                    className={`${
                                        isDarkMode
                                            ? "text-[#1FABC7]"
                                            : "text-[#0C3C60]"
                                    } hover:text-[#D1E0EB] block py-2 px-4 hover:bg-[#1FABC7] transition-colors`}
                                    onClick={toggleMenu}
                                >
                                    Home
                                </Link>
                            </li>
                            {/* <li>
                                <Link
                                    href="/fsclinicals/contact-us"
                                    className={`${
                                        isDarkMode
                                            ? "text-[#1FABC7]"
                                            : "text-[#0C3C60]"
                                    } hover:text-[#D1E0EB] block py-2 px-4 hover:bg-[#1FABC7] transition-colors`}
                                    onClick={toggleMenu}
                                >
                                    Contact
                                </Link>
                            </li> */}
                            <li>
                                <Link
                                    href="/fsclinicals/about"
                                    className={`${
                                        isDarkMode
                                            ? "text-[#1FABC7]"
                                            : "text-[#0C3C60]"
                                    } hover:text-[#D1E0EB] block py-2 px-4 hover:bg-[#1FABC7] transition-colors`}
                                    onClick={toggleMenu}
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/fsclinicals/fsclinicals-view/fsclinicals-form"
                                    className={`${
                                        isDarkMode
                                            ? "text-[#1FABC7]"
                                            : "text-[#0C3C60]"
                                    } hover:text-[#D1E0EB] block py-2 px-4 hover:bg-[#1FABC7] transition-colors`}
                                    onClick={toggleMenu}
                                >
                                    New Patientt
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default FSClinicalsHeader;
