// import SurveyComponent from "@/components/Survey";

import dynamic from "next/dynamic";
const SurveyComponent = dynamic(() => import("@/components/Survey"), {
	ssr: false,
});

export default function Survey() {
	return (
		// <div className="/*flex h-[100vh] w-full justify-center flex-col items-center*/">
		<>
			<SurveyComponent />
			{/* // </div> */}
		</>
	);
}
