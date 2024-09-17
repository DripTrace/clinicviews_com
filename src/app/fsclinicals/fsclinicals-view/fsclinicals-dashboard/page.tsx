import FSClinicalsDashboard from "@/components/FSClinicals/FSClinicalsComponents/FSClinicalsDashboard";

export const dynamic = "force-dynamic";

export default function FSClinicalsDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <FSClinicalsDashboard />
        </div>
    );
}
