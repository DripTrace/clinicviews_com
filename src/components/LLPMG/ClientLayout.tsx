"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import Header from "./Header";
import Footer from "./Footer";
import ClientLayoutContent from "./ClientLayoutContent";

interface ClientLayoutProps {
    children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <ClientLayoutContent>
                <Header />
                <main className="bg-blue-100 dark:bg-gray-900 flex-grow">
                    {children}
                </main>
                <Footer />
            </ClientLayoutContent>
        </Provider>
    );
};

export default ClientLayout;
