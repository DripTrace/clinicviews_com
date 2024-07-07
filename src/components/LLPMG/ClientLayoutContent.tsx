"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { RootState } from "../../store/store";

interface ClientLayoutContentProps {
    children: React.ReactNode;
}

const ClientLayoutContent: React.FC<ClientLayoutContentProps> = ({
    children,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const theme = useAppSelector((state: RootState) => state.ui.theme);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div
            className={`flex flex-col min-h-screen ${
                isLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300 ${
                theme === "dark" ? "dark" : ""
            }`}
        >
            {children}
        </div>
    );
};

export default ClientLayoutContent;
