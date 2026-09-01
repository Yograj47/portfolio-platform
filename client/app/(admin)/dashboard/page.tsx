export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back. Here is an overview of your system.
                </p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Total Media</p>
                    <h2 className="mt-2 text-3xl font-bold">128</h2>
                </div>

                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                    <h2 className="mt-2 text-3xl font-bold">1.2 GB</h2>
                </div>

                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <h2 className="mt-2 text-3xl font-bold">12</h2>
                </div>

                <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground">System Status</p>
                    <h2 className="mt-2 text-3xl font-bold text-emerald-600 font-sans">Healthy</h2>
                </div>
            </div>
        </div>
    );
}