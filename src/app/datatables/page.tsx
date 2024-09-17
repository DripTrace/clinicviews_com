import DashboardDatatables from "@/components/DashboardDatatables";

export const dynamic = "force-dynamic";

export default function SurveyDatatables() {
    return (
        <div className="flex h-[100vh] w-full justify-center flex-col items-center">
            <DashboardDatatables />
        </div>
    );
}
