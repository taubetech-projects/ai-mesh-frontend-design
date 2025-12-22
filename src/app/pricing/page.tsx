"use client";

import React, { useState } from "react";
import {
  Check,
  Sparkles,
  Zap,
  LayoutGrid,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePlans } from "@/features/pricing/hooks/usePlans";
import { usePurchasePlan } from "@/features/pricing/hooks/usePurchasePlans";
import { Subscription } from "node_modules/react-hook-form/dist/utils/createSubject";
import { SubscriptionPlan } from "@/features/pricing/types/subscriptionPlans";
import {
  BillingInterval,
  BillingKind,
  BillingProvider,
} from "@/features/pricing/types/billing";

// 1. The Toggle Switch
const PlanTypeToggle = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "personal" | "business";
  setActiveTab: (t: "personal" | "business") => void;
}) => (
  <div className="flex justify-center mb-12">
    <div className="bg-zinc-900 p-1 rounded-full border border-zinc-800 flex relative">
      <button
        onClick={() => setActiveTab("personal")}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
          activeTab === "personal"
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        Personal
      </button>
      <button
        onClick={() => setActiveTab("business")}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
          activeTab === "business"
            ? "text-white bg-zinc-700"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        Business
      </button>
    </div>
  </div>
);

// 2. The Pricing Card
const PricingCard = ({
  plan,
  onPurchase,
  isLoading,
}: {
  plan: SubscriptionPlan;
  onPurchase: (plan: SubscriptionPlan) => void;
  isLoading: boolean;
}) => {
  const isHighlighted = plan.code == "ESSENTIAL" || plan.code == "PRO";
  const isFree = plan.monthlyPriceCents === 0;
  const price =
    plan.monthlyPriceCents === 0
      ? "$0"
      : `$${(plan.monthlyPriceCents / 100).toFixed(0)}`;

  return (
    <div
      className={`
        relative flex flex-col p-6 rounded-2xl transition-all duration-300
        ${
          isHighlighted
            ? "bg-zinc-900/50 border-indigo-500/50 border-2 shadow-xl shadow-indigo-500/10"
            : "bg-zinc-950 border border-zinc-800 hover:border-zinc-700"
        }
      `}
    >
      {plan.badgeText !== null && (
        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold text-indigo-300 bg-indigo-500/20 rounded-full border border-indigo-500/30">
          {plan.badgeText}
        </span>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white tracking-tight">
            {price}
          </span>
          <span className="text-zinc-400 text-sm">/month</span>
        </div>
        <p className="mt-4 text-zinc-400 text-sm h-10">{plan.description}</p>
      </div>

      {/* Action Button */}
      {isFree ? null : (
        <button
          onClick={() => onPurchase(plan)}
          disabled={isLoading}
          className={`
          w-full py-3 px-4 rounded-lg font-medium transition-colors mb-8
          ${
            isHighlighted
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              : "bg-zinc-800 hover:bg-zinc-700 text-white"
          }
        `}
        >
          Get Plan
        </button>
      )}

      {/* Features List */}
      <div className="flex-grow">
        <ul className="space-y-4">
          {plan.features[0]
            ?.replace(/^\[|\]$/g, "")
            .split(",")
            .map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-zinc-300"
              >
                {/* Dynamic Icon Selection based on context or just generic check */}
                <div
                  className={`mt-0.5 ${
                    isHighlighted ? "text-indigo-400" : "text-zinc-500"
                  }`}
                >
                  {idx === 0 && isHighlighted ? (
                    <Sparkles size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                </div>
                <span className="leading-tight">
                  {feature.trim().replace(/^"|"$/g, "")}
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function PricingPage() {
  const { data: pricingPlans, isLoading } = usePlans();
  const purchasePlan = usePurchasePlan();
  const [activeTab, setActiveTab] = useState<"personal" | "business">(
    "personal"
  );

  const personalPlans: SubscriptionPlan[] = [];
  const businessPlans: SubscriptionPlan[] = [];

  pricingPlans?.map((plan) => {
    if (plan.planType === "PERSONAL") {
      personalPlans.push(plan);
    } else {
      businessPlans.push(plan);
    }
  });

  const handlePurchase = (plan: SubscriptionPlan) => {
    purchasePlan.mutate({
      planId: plan.id,
      provider: BillingProvider.STRIPE,
      kind: BillingKind.SUBSCRIPTION,
      interval: BillingInterval.MONTHLY,
    });
  };

  if (isLoading) {
    return <div className="text-center">Loading plans...</div>;
  }

  const plans = activeTab === "personal" ? personalPlans : businessPlans;

  return (
    <div className="min-h-screen bg-black text-zinc-100 py-20 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <Link
          href="/home"
          className="font-medium text-gray-400 hover:underline mb-6 inline-block"
        >
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Upgrade your plan
        </h1>
        <PlanTypeToggle activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Grid Section */}
      <div
        className={`
        max-w-7xl mx-auto grid gap-6 
        ${
          activeTab === "personal"
            ? "grid-cols-1 md:grid-cols-3" // 3 columns for Personal
            : "grid-cols-1 md:grid-cols-3 max-w-4xl" // 3 columns centered for Business
        }
      `}
      >
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onPurchase={handlePurchase}
            isLoading={purchasePlan.isPending}
          />
        ))}
      </div>
    </div>
  );
}
