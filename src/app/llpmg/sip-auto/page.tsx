// ------- latest claude
// "use client";

// import React, { useState } from "react";
// import Sip from "@/components/LLPMG/sip/Sip";

// const SipAutoPage = () => {
//     const [callActive, setCallActive] = useState(false);

//     const handleCallStateChange = (isActive: boolean) => {
//         setCallActive(isActive);
//     };

//     return <Sip onCallStateChange={handleCallStateChange} />;
// };

// export default SipAutoPage;
// -------- latest claude

// looking for audio log (recording and capturing from browser)
"use client";

import React, { useState } from "react";
import Sip from "@/components/LLPMG/sip/Sip";
import SipErrorBoundary from "@/components/LLPMG/sip/SipErrorBoundary";

const SipAutoPage = () => {
    const [callActive, setCallActive] = useState(false);

    const handleCallStateChange = (isActive: boolean) => {
        setCallActive(isActive);
    };

    return (
        <SipErrorBoundary>
            <Sip onCallStateChange={handleCallStateChange} />
        </SipErrorBoundary>
    );
};

export default SipAutoPage;
// looking for audio log (recording and capturing from browser)
