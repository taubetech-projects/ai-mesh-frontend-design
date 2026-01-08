"use client";

import { useState } from "react";
import {
  Plus,
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/hooks/use-toast";
import {
  useTransactionsQuery,
  useWalletQuery,
} from "@/features/platform/wallet/hooks/useWalletHook";
import {
  DeveloperWalletTransaction,
  WalletView,
} from "@/features/platform/wallet/types/walletTypes";
import { formatNanoCentsCurrency, nanoToUsd } from "@/shared/utils/currency";
import { formatDateYearMonthDay } from "@/shared/utils/dateFormat";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: string;
  description: string;
  date: string;
  status: "completed" | "pending";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    amount: "+$100.00",
    description: "Wallet top-up",
    date: "2024-01-25",
    status: "completed",
  },
  {
    id: "2",
    type: "debit",
    amount: "-$45.50",
    description: "API usage - January",
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: "3",
    type: "credit",
    amount: "+$250.00",
    description: "Wallet top-up",
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "4",
    type: "debit",
    amount: "-$56.00",
    description: "API usage - December",
    date: "2024-01-01",
    status: "completed",
  },
];

const topUpAmounts = [25, 50, 100, 250, 500, 1000];

export default function Wallet() {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");

  const { data: walletData } = useWalletQuery();
  const wallet = walletData as WalletView | undefined;

  const { data: transactionsData } = useTransactionsQuery();
  const walletTransactions = transactionsData as Transaction[] | undefined;

  const handleTopUp = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) return;

    toast({
      title: "Top-up Successful",
      description: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
    setIsTopUpOpen(false);
    setSelectedAmount(100);
    setCustomAmount("");
  };

  const transactionColumns: Column<DeveloperWalletTransaction>[] = [
    {
      header: "Transaction",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              row.type === "DEPPOSIT" ? "bg-success/10" : "bg-destructive/10"
            }`}
          >
            {row.type === "DEPOSIT" ? (
              <ArrowDownRight className="h-4 w-4 text-success" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {row.type == "DEPOSIT" ? "Wallet Top-up" : "Usage Charge"}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateYearMonthDay(row.createdAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: (row) => (
        <span
          className={`font-mono font-medium ${
            row.type === "DEPOSIT" ? "text-success" : "text-destructive"
          }`}
        >
          {formatNanoCentsCurrency(Math.abs(row.amountNanoUsd), {
            prefix: "$",
            decimals: 4,
          })}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <StatusBadge
          status={
            row.type === "USAGE_CHARGE" || row.type === "DEPOSIT"
              ? "Completed"
              : "Pending"
          }
          variant={
            row.type === "USAGE_CHARGE" || row.type === "DEPOSIT"
              ? "success"
              : "warning"
          }
        />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Wallet"
          description="Manage your credit balance and transactions"
        >
          <Button onClick={() => setIsTopUpOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Top Up
          </Button>
        </PageHeader>
        {/* Balance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Available Balance"
            value={formatNanoCentsCurrency(wallet?.balanceNanoUsd, {
              prefix: "$",
              decimals: 2,
            })}
            icon={WalletIcon}
            description="Ready to use"
            className="border-primary/30"
          />
          <StatCard
            title="Total Credits Added"
            value={formatNanoCentsCurrency(wallet?.totalLifetimeCredits, {
              prefix: "$",
              decimals: 2,
            })}
            icon={CreditCard}
            description="Lifetime total"
          />
          <StatCard
            title="Total Usage"
            value={formatNanoCentsCurrency(wallet?.totalLifetimeUsage, {
              prefix: "$",
              decimals: 2,
            })}
            icon={TrendingUp}
            description="Lifetime spending"
          />
        </div>
        {/* Low Balance Alert */}
        {wallet?.balanceUsd !== undefined &&
          wallet?.balanceUsd < nanoToUsd(wallet.lowBalanceThresholdNanoUsd) && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <WalletIcon className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    Low Balance Alert
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your balance is running low. Consider topping up to avoid
                    service interruption. Estimated usage at current rate: ~14
                    days remaining.
                  </p>
                </div>
                <Button size="sm" onClick={() => setIsTopUpOpen(true)}>
                  Top Up Now
                </Button>
              </div>
            </div>
          )}
        {/* Transaction History */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-medium text-foreground">Transaction History</h3>
          </div>
          <DataTable
            columns={transactionColumns}
            data={walletTransactions || []}
          />
        </div>
        {/* Top Up Dialog */}
        <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Top Up Wallet</DialogTitle>
              <DialogDescription>
                Add credits to your wallet to continue using the API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                {topUpAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    or enter custom amount
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  •••• •••• •••• 4242
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Default
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTopUpOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTopUp}>
                Add ${customAmount || selectedAmount || 0}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
