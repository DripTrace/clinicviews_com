"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleMenu, setTheme } from "@/store/slices/uiSlice";
import LLPMGLogo from "./LLPMGLogo";

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isMenuOpen, theme } = useAppSelector((state) => state.ui);
    const [isLoaded, setIsLoaded] = useState(false);

    const navItems = [
        { name: "Home", path: "/llpmg/landing" },
        { name: "Why Choose Us", path: "/llpmg/why-choose-us" },
        // { name: "Our Services", path: "/llpmg/services" },
        { name: "Locations", path: "/llpmg/locations" },
        { name: "Providers & Staff", path: "/llpmg/providers-and-staff" },
        { name: "Privacy & Notices", path: "/llpmg/privacy-and-notices" },
        { name: "Contact Us", path: "/llpmg/register" },
        // { name: "New Patient Packet", path: "/survey" },
    ];

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleToggleMenu = () => {
        dispatch(toggleMenu());
    };

    const handleToggleTheme = () => {
        dispatch(setTheme(theme === "light" ? "dark" : "light"));
    };

    return (
        <header
            className={`sticky top-0 bg-blue-900 dark:bg-gray-900 text-white z-50 shadow-md transition-all duration-300 ${
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
                        <Link
                            key={item.name}
                            href={item.path}
                            className="block py-2 px-4 text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800 hover:text-white transition-colors duration-300"
                            onClick={handleToggleMenu}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

export default Header;
