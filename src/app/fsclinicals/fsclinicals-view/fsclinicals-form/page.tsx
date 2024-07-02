// import FSClinicalsFormComponent from "@/components/FSClinicals/FSClinicalsComponents/FSClinicalsForm";

import dynamic from "next/dynamic";
const FSClinicalsFormComponent = dynamic(
	() =>
		import(
			"@/components/FSClinicals/FSClinicalsComponents/FSClinicalsForm"
		),
	{ ssr: false }
);

export default function FSClinicalsForm() {
	return (
		<div className="flex h-[100vh] w-full justify-center flex-col items-center">
			<FSClinicalsFormComponent />
		</div>
	);
}
