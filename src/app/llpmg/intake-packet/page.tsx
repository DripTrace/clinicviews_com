// import IntakePacket from "@/components/Survey";

import dynamic from "next/dynamic";
const IntakePacket = dynamic(() => import("@/components/LLPMG/IntakePacket"), {
    ssr: false,
});

export default function Survey() {
    return (
        // <div className="/*flex h-[100vh] w-full justify-center flex-col items-center*/">
        <>
            <IntakePacket />
            {/* // </div> */}
        </>
    );
}
