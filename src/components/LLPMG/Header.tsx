// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
// import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// import { toggleMenu, setTheme } from "@/store/slices/uiSlice";
// import LLPMGLogo from "./LLPMGLogo";

// const Header: React.FC = () => {
//     const dispatch = useAppDispatch();
//     const { isMenuOpen, theme } = useAppSelector((state) => state.ui);
//     const [isLoaded, setIsLoaded] = useState(false);

//     const navItems = [
//         { name: "Home", path: "/llpmg/landing" },
//         { name: "Why Choose Us", path: "/llpmg/why-choose-us" },
//         // { name: "Our Services", path: "/llpmg/services" },
//         { name: "Locations", path: "/llpmg/locations" },
//         { name: "Providers & Staff", path: "/llpmg/providers-and-staff" },
//         { name: "Privacy & Notices", path: "/llpmg/privacy-and-notices" },
//         { name: "Contact Us", path: "/llpmg/register" },
//         // { name: "New Patient Packet", path: "/survey" },
//     ];

//     useEffect(() => {
//         setIsLoaded(true);
//     }, []);

//     const handleToggleMenu = () => {
//         dispatch(toggleMenu());
//     };

//     const handleToggleTheme = () => {
//         dispatch(setTheme(theme === "light" ? "dark" : "light"));
//     };

//     return (
//         <header
//             className={`sticky top-0 bg-blue-900/90 dark:bg-gray-900/90 text-white z-50 shadow-md transition-all duration-300 ${
//                 isLoaded ? "translate-y-0" : "-translate-y-full w-full"
//             }`}
//         >
//             <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-5">
//                 <Link
//                     href="/llpmg/landing"
//                     className="text-2xl font-bold text-white gap-3 flex items-center justify-center"
//                 >
//                     <LLPMGLogo id="llpmg-logo" className="size-[3rem]" />
//                     <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
//                         LLPMG
//                     </span>
//                 </Link>
//                 <nav className="hidden md:flex space-x-4 items-center md:text-[0.6rem] lg:text-[0.8rem] xl:text-[1rem]">
//                     {navItems.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.path}
//                             className="text-gray-300 hover:text-white transition-colors duration-300"
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                     <button
//                         onClick={handleToggleTheme}
//                         className="ml-4 text-gray-300 hover:text-white"
//                     >
//                         {theme === "light" ? <FaMoon /> : <FaSun />}
//                     </button>
//                 </nav>
//                 <div className="md:hidden flex items-center">
//                     <button
//                         onClick={handleToggleTheme}
//                         className="mr-4 text-gray-300 hover:text-white"
//                     >
//                         {theme === "light" ? <FaMoon /> : <FaSun />}
//                     </button>
//                     <button onClick={handleToggleMenu} className="text-white">
//                         {isMenuOpen ? <FaTimes /> : <FaBars />}
//                     </button>
//                 </div>
//             </div>
//             {isMenuOpen && (
//                 <div className="md:hidden">
//                     {navItems.map((item) => (
//                         <Link
//                             key={item.name}
//                             href={item.path}
//                             className="block py-2 px-4 text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-300"
//                             onClick={handleToggleMenu}
//                         >
//                             {item.name}
//                         </Link>
//                     ))}
//                 </div>
//             )}
//         </header>
//     );
// };

// export default Header;

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleMenu, setTheme } from "@/store/slices/uiSlice";
import LLPMGLogo from "./LLPMGLogo";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isMenuOpen, theme } = useAppSelector((state) => state.ui);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);
    const contactDropdownRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const router = useRouter();

    const navItems = [
        { name: "Home", path: "/llpmg/landing" },
        { name: "Why Choose Us", path: "/llpmg/why-choose-us" },
        { name: "Locations", path: "/llpmg/locations" },
        { name: "Providers & Staff", path: "/llpmg/providers-and-staff" },
        { name: "Privacy & Notices", path: "/llpmg/privacy-and-notices" },
    ];

    useEffect(() => {
        setIsLoaded(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (
                contactDropdownRef.current &&
                !contactDropdownRef.current.contains(event.target as Node)
            ) {
                setIsContactDropdownOpen(false);
            }
        };

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const handleToggleMenu = () => {
        dispatch(toggleMenu());
    };

    const handleToggleTheme = () => {
        dispatch(setTheme(theme === "light" ? "dark" : "light"));
    };

    const handleContactClick = () => {
        setIsContactDropdownOpen(!isContactDropdownOpen);
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsContactDropdownOpen(true);
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setIsHovering(false);
            setTimeout(() => {
                if (!isHovering) {
                    setIsContactDropdownOpen(false);
                }
            }, 100);
        }
    };

    const handleMobileLinkClick = (path: string) => {
        console.log("clicked");
        router.push(path);
        dispatch(toggleMenu());
        setIsContactDropdownOpen(false);
    };

    return (
        <header
            className={`sticky top-0 bg-blue-900/90 dark:bg-gray-900/90 text-white z-50 shadow-md transition-all duration-300 ${
                isLoaded ? "translate-y-0" : "-translate-y-full w-full"
            }`}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center gap-5">
                <Link
                    href="/llpmg/landing"
                    className="text-2xl font-bold text-white gap-3 flex items-center justify-center"
                >
                    <LLPMGLogo id="llpmg-logo" className="size-[3rem]" />
                    <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
                        LLPMG
                    </span>
                </Link>
                <nav className="hidden md:flex space-x-4 items-center md:text-[0.6rem] lg:text-[0.8rem] xl:text-[1rem]">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className="text-gray-300 hover:text-white transition-colors duration-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div
                        className="relative"
                        ref={contactDropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            onClick={() => isMobile && handleContactClick()}
                            className="text-gray-300 text-[0.5rem] hover:text-white transition-colors duration-300"
                        >
                            Contact Us
                        </button>
                        {isContactDropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 flex flex-col items-center justify-center"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link
                                    href="/llpmg/register"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                                    onClick={() => {
                                        console.log("clicked");
                                        setIsContactDropdownOpen(false);
                                    }}
                                >
                                    Contact the Clinic
                                </Link>
                                <Link
                                    href="/llpmg/intake-packet"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                                    onClick={() => {
                                        console.log("clicked");
                                        setIsContactDropdownOpen(false);
                                    }}
                                >
                                    New Patient Packet
                                </Link>
                                <a
                                    href="tel:+19098804200"
                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center"
                                    onClick={() => {
                                        console.log("clicked");
                                        setIsContactDropdownOpen(false);
                                    }}
                                >
                                    Call (909) 880-4200
                                </a>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleToggleTheme}
                        className="ml-4 text-gray-300 hover:text-white"
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                </nav>
                <div className="md:hidden flex items-center">
                    <button
                        onClick={handleToggleTheme}
                        className="mr-4 text-gray-300 hover:text-white"
                    >
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                    <button onClick={handleToggleMenu} className="text-white">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            className="block w-full py-2 px-4 text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-300 text-center"
                            onClick={() => handleMobileLinkClick(item.path)}
                        >
                            {item.name}
                        </button>
                    ))}
                    <div className="relative">
                        <button
                            onClick={handleContactClick}
                            className="block w-full text-center py-2 px-4 text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-300"
                        >
                            Contact Us
                        </button>
                        {isContactDropdownOpen && (
                            <div className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                                <Link
                                    href="/llpmg/register"
                                    className="block w-full py-2 px-8 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center z-50"
                                    // onClick={() =>
                                    //     // handleMobileLinkClick("/llpmg/register")
                                    //     {
                                    //         console.log("clicked");
                                    //         // dispatch(toggleMenu());
                                    //         setIsContactDropdownOpen(false);
                                    //     }
                                    // }
                                    onTouchEnd={() => {
                                        console.log("clicked");
                                        handleMobileLinkClick(
                                            "/llpmg/register"
                                        );
                                        dispatch(toggleMenu());
                                        setIsContactDropdownOpen(false);
                                    }}
                                >
                                    Contact the Clinic
                                </Link>
                                <Link
                                    href="/llpmg/intake-packet"
                                    className="block w-full py-2 px-8 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center z-50"
                                    onTouchEnd={() => {
                                        console.log("clicked");
                                        handleMobileLinkClick(
                                            "/llpmg/intake-packet"
                                        );
                                        dispatch(toggleMenu());
                                        setIsContactDropdownOpen(false);
                                    }}
                                    // onClick={() =>
                                    //     // handleMobileLinkClick(
                                    //     //     "/llpmg/intake-packet"
                                    //     // )
                                    //     {
                                    //         console.log("clicked");
                                    //         // dispatch(toggleMenu());
                                    //         setIsContactDropdownOpen(false);
                                    //     }
                                    // }
                                >
                                    New Patient Packet
                                </Link>
                                <a
                                    href="tel:+19098804200"
                                    className="block py-2 px-8 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-center z-50"
                                    onTouchEnd={() => {
                                        console.log("clicked");
                                        handleMobileLinkClick(
                                            "tel:+19098804200"
                                        );
                                        dispatch(toggleMenu());
                                        setIsContactDropdownOpen(false);
                                    }}
                                    // onClick={() => {
                                    //     console.log("clicked");
                                    //     // dispatch(toggleMenu());
                                    //     setIsContactDropdownOpen(false);
                                    // }}
                                >
                                    Call (909) 880-4200
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
