import { Key, Box, BookOpen, Users } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, ActionCard, StatCard } from "@/features/platform/components/platform";
import { Activity, TrendingUp, Zap, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Welcome, Developer"
          description="Overview of Personal team"
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="API Requests"
            value="12,847"
            icon={Activity}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Active Models"
            value="8"
            icon={Box}
            description="Across 3 projects"
          />
          <StatCard
            title="Avg Response Time"
            value="142ms"
            icon={Clock}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Credit Balance"
            value="$248.50"
            icon={Zap}
            description="Estimated 14 days left"
          />
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ActionCard
            icon={Key}
            title="Create your first API key"
            description="Start integrating with our API"
            href="/api-keys"
          />
          <ActionCard
            icon={Box}
            title="View models"
            description="Compare models and costs"
            href="/models"
          />
          <ActionCard
            icon={BookOpen}
            title="View our docs"
            description="Learn more about the API"
            href="/docs"
          />
          <ActionCard
            icon={Users}
            title="View your team"
            description="View users on your team"
            href="/team/members"
          />
        </div>

        {/* Recent Activity */}
        <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="space-y-4">
            {[
              { action: "API key created", time: "2 hours ago", project: "Production" },
              { action: "Model gpt-4 enabled", time: "5 hours ago", project: "Staging" },
              { action: "New team member invited", time: "1 day ago", project: "Personal" },
              { action: "Billing threshold updated", time: "2 days ago", project: "Production" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-foreground font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.project}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
