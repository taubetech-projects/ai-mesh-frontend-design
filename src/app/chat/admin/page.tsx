export default function AdminPage() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span className="text-muted-foreground">Total Users Statistic</span>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span className="text-muted-foreground">Active Models Statistic</span>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span className="text-muted-foreground">System Health</span>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:col-span-3 p-10">
        <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Select a category from the sidebar to manage your application.
        </p>
      </div>
    </div>
  );
}
