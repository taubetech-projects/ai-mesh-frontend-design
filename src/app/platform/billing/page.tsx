"use client";
import { Download, CreditCard, TrendingUp, WalletIcon } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  StatCard,
  DataTable,
  StatusBadge,
  Column,
} from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useInvoicePreviewQuery } from "@/features/platform/billing/hooks/useBillingAndInvoicesHook";
import {
  InvoicePreview,
  TokenUsageSummary,
} from "@/features/platform/billing/types/invoiceTypes";
import {
  formatCurrency,
  formatNanoCentsCurrency,
} from "@/shared/utils/currency";
import { formatBillingPeriod } from "@/shared/utils/dateFormat";
import { useMyTeamWalletQuery } from "@/features/platform/wallet/hooks/useWalletHook";
import {
  DeveloperWalletTransaction,
  WalletView,
} from "@/features/platform/wallet/types/walletTypes";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  period: string;
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

export default function Billing() {
  const { data: invoicePreviewData } = useInvoicePreviewQuery();
  const invoicePreview = invoicePreviewData as InvoicePreview | undefined;
  const { data: walletData } = useMyTeamWalletQuery();
  const wallet = walletData as WalletView | undefined;

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

  const usageColumns: Column<TokenUsageSummary>[] = [
    {
      header: "Model",
      accessor: (row) => (
        <span className="font-medium text-foreground">
          {row.modelName || "N/A"}
        </span>
      ),
    },
    {
      header: "Requests",
      accessor: (row) => row?.requests?.toLocaleString() || "0",
    },
    {
      header: "Tokens",
      accessor: (row) => row.tokens?.toLocaleString() || "0",
    },
    {
      header: "Cost",
      accessor: (row) => (
        <span className="font-mono text-foreground">
          {formatNanoCentsCurrency(row.amountNanoUsd, {
            prefix: "$",
            decimals: 4,
          })}
        </span>
      ),
    },
  ];

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
            value={formatNanoCentsCurrency(invoicePreview?.totalAmountCents, {
              prefix: "$",
              decimals: 4,
            })}
            icon={TrendingUp}
            description={formatBillingPeriod(
              invoicePreview?.periodStart,
              invoicePreview?.periodEnd,
            )}
          />
          <StatCard
            title="Total Requests"
            value={invoicePreview?.totalRequests?.toLocaleString() || "0"}
            description="This billing period"
          />
          <StatCard
            title="Credit Balance"
            value={formatCurrency(wallet?.balanceUsd, {
              prefix: "$",
              decimals: 2,
            })}
            icon={WalletIcon}
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
                <span className="text-sm text-muted-foreground">
                  {formatBillingPeriod(
                    invoicePreview?.periodStart,
                    invoicePreview?.periodEnd,
                  )}
                </span>
              </div>
              <DataTable
                columns={usageColumns}
                data={invoicePreview?.lines || []}
              />
              <div className="p-4 border-t border-border flex justify-between items-center bg-secondary/30">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-mono font-medium text-foreground">
                  {formatNanoCentsCurrency(invoicePreview?.totalAmountCents, {
                    prefix: "$",
                    decimals: 4,
                  })}
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
          <h3 className="font-medium text-foreground mb-3">
            Billing Threshold
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground">
                Current threshold: <span className="font-medium">$500.00</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll be charged when your usage reaches this amount or at the
                end of the billing period.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
