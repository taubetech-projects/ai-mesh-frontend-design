"use client";
import { Download, CreditCard, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, StatCard, DataTable, StatusBadge, Column } from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  period: string;
}

interface UsageItem {
  id: string;
  model: string;
  requests: number;
  tokens: number;
  cost: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-2024-001",
    date: "2024-01-01",
    amount: "$156.78",
    status: "paid",
    period: "December 2023",
  },
  {
    id: "INV-2024-002",
    date: "2024-02-01",
    amount: "$243.50",
    status: "paid",
    period: "January 2024",
  },
  {
    id: "INV-2024-003",
    date: "2024-03-01",
    amount: "$189.25",
    status: "pending",
    period: "February 2024",
  },
];

const mockUsage: UsageItem[] = [
  { id: "1", model: "GPT-4 Turbo", requests: 12500, tokens: 2500000, cost: "$75.00" },
  { id: "2", model: "GPT-4", requests: 3200, tokens: 640000, cost: "$38.40" },
  { id: "3", model: "Claude 3 Opus", requests: 1800, tokens: 360000, cost: "$27.00" },
  { id: "4", model: "Claude 3 Sonnet", requests: 8500, tokens: 1700000, cost: "$25.50" },
  { id: "5", model: "Gemini Pro", requests: 15000, tokens: 3000000, cost: "$7.50" },
];

export default function Billing() {
  const invoiceColumns: Column<Invoice>[] = [
    {
      header: "Invoice ID",
      accessor: (row) => (
        <span className="font-mono text-foreground">{row.id}</span>
      ),
    },
    {
      header: "Period",
      accessor: "period",
    },
    {
      header: "Date",
      accessor: "date",
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.amount}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          variant={
            row.status === "paid"
              ? "success"
              : row.status === "pending"
              ? "warning"
              : "destructive"
          }
        />
      ),
    },
    {
      header: "",
      accessor: () => (
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      ),
      className: "w-12",
    },
  ];

  const usageColumns: Column<UsageItem>[] = [
    {
      header: "Model",
      accessor: (row) => (
        <span className="font-medium text-foreground">{row.model}</span>
      ),
    },
    {
      header: "Requests",
      accessor: (row) => row.requests.toLocaleString(),
    },
    {
      header: "Tokens",
      accessor: (row) => row.tokens.toLocaleString(),
    },
    {
      header: "Cost",
      accessor: (row) => (
        <span className="font-mono text-foreground">{row.cost}</span>
      ),
    },
  ];

  const totalUsage = mockUsage.reduce((acc, item) => {
    return acc + parseFloat(item.cost.replace("$", ""));
  }, 0);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Billing"
          description="Manage your billing and view usage"
        >
          <Button variant="outline">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Methods
          </Button>
        </PageHeader>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Current Month Usage"
            value={`$${totalUsage.toFixed(2)}`}
            icon={TrendingUp}
            description="Billing period: Feb 1 - Feb 29"
          />
          <StatCard
            title="Total Requests"
            value={mockUsage.reduce((acc, item) => acc + item.requests, 0).toLocaleString()}
            description="This billing period"
          />
          <StatCard
            title="Credit Balance"
            value="$248.50"
            description="Available credits"
          />
        </div>

        <Tabs defaultValue="usage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="usage">Current Usage</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="usage">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-medium text-foreground">Usage by Model</h3>
                <span className="text-sm text-muted-foreground">February 2024</span>
              </div>
              <DataTable columns={usageColumns} data={mockUsage} />
              <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/30">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-mono font-medium text-foreground">
                  ${totalUsage.toFixed(2)}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            <DataTable columns={invoiceColumns} data={mockInvoices} />
          </TabsContent>
        </Tabs>

        {/* Billing Threshold */}
        <div className="mt-6 bg-card border border-border rounded-xl p-5">
          <h3 className="font-medium text-foreground mb-3">Billing Threshold</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">Current threshold: <span className="font-medium">$500.00</span></p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll be charged when your usage reaches this amount or at the end of the billing period.
              </p>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
