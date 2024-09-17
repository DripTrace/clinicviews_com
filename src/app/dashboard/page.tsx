import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Dashboard />
        </div>
    );
}
