// "use client";

// import Sip from "@/components/LLPMG/sip/Sip";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const SipAutoPage = () => {
//     const [callActive, setCallActive] = useState(false);
//     const [tokenData, setTokenData] = useState<any>(null);
//     const router = useRouter();

//     useEffect(() => {
//         const storedTokenData = localStorage.getItem("rcTokenData");
//         if (storedTokenData) {
//             const parsedTokenData = JSON.parse(storedTokenData);
//             setTokenData(parsedTokenData);
//         }
//     }, []);

//     const handleHangup = () => {
//         setCallActive(false);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("rcTokenData");
//         setTokenData(null);
//         router.refresh();
//     };

//     return (
//         <Sip
//             onHangup={handleHangup}
//             tokenData={tokenData}
//             onLogout={handleLogout}
//             setTokenData={setTokenData}
//         />
//     );
// };

// export default SipAutoPage;

"use client";

import SipOut from "@/components/LLPMG/sip/SipOut";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SipOutPage = () => {
    const [tokenData, setTokenData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedTokenData = localStorage.getItem("rcTokenData");
        if (storedTokenData) {
            const parsedTokenData = JSON.parse(storedTokenData);
            setTokenData(parsedTokenData);
        }
    }, []);

    const handleHangup = () => {
        // This function is now handled within the Sip component
    };

    const handleLogout = () => {
        localStorage.removeItem("rcTokenData");
        setTokenData(null);
        router.refresh();
    };

    return (
        <SipOut
            onHangup={handleHangup}
            tokenData={tokenData}
            onLogout={handleLogout}
            setTokenData={setTokenData}
        />
    );
};

export default SipOutPage;
