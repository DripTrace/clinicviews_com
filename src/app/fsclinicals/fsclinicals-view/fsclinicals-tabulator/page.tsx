import FSClinicalsDashboardTabulator from "@/components/FSClinicals/FSClinicalsComponents/FSClinicalsDashboardTabulator";

export const dynamic = "force-dynamic";

export default function FSClinicalsTabulatorPage() {
    return (
        <div className="flex size-full flex-col items-center">
            <FSClinicalsDashboardTabulator />
        </div>
    );
}
