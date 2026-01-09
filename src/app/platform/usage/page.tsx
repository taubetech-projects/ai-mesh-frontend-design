"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Progress } from "@/shared/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { Calendar as CalendarIcon, Download, ChevronRight } from "lucide-react";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader } from "@/features/platform/components/platform";

// Mock data for usage
const dailySpendData = [
  { date: "Dec 25", spend: 0.06 },
  { date: "Dec 26", spend: 0.02 },
  { date: "Dec 27", spend: 0.015 },
  { date: "Dec 28", spend: 0.012 },
  { date: "Dec 29", spend: 0.01 },
  { date: "Dec 30", spend: 0.008 },
  { date: "Dec 31", spend: 0.006 },
  { date: "Jan 01", spend: 0.005 },
  { date: "Jan 02", spend: 0.004 },
  { date: "Jan 03", spend: 0.003 },
  { date: "Jan 04", spend: 0.002 },
  { date: "Jan 05", spend: 0.025 },
  { date: "Jan 06", spend: 0.018 },
  { date: "Jan 07", spend: 0.035 },
  { date: "Jan 08", spend: 0.04 },
  { date: "Jan 09", spend: 0.0 },
];

const tokenData = [
  { day: "1", tokens: 800 },
  { day: "2", tokens: 1200 },
  { day: "3", tokens: 900 },
  { day: "4", tokens: 1500 },
  { day: "5", tokens: 1100 },
  { day: "6", tokens: 1800 },
  { day: "7", tokens: 1400 },
  { day: "8", tokens: 2000 },
  { day: "9", tokens: 1600 },
  { day: "10", tokens: 1300 },
];

const requestData = [
  { day: "1", requests: 12 },
  { day: "2", requests: 15 },
  { day: "3", requests: 8 },
  { day: "4", requests: 20 },
  { day: "5", requests: 18 },
  { day: "6", requests: 25 },
  { day: "7", requests: 22 },
  { day: "8", requests: 30 },
  { day: "9", requests: 16 },
  { day: "10", requests: 10 },
];

const apiCapabilities = [
  { name: "Responses and Chat Completions", requests: 182, tokens: "12.378K input tokens" },
  { name: "Images", requests: 0, tokens: "0 images" },
  { name: "Audio", requests: 0, tokens: "0 minutes" },
  { name: "Embeddings", requests: 0, tokens: "0 tokens" },
];

const spendCategories = [
  { name: "GPT-4o", spend: "$0.08", percentage: 57 },
  { name: "GPT-4o-mini", spend: "$0.04", percentage: 29 },
  { name: "Claude-3.5", spend: "$0.02", percentage: 14 },
];

const groupByOptions = ["1d", "7d", "30d"];

export default function Usage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 15),
    to: new Date(),
  });
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedApiKey, setSelectedApiKey] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [groupBy, setGroupBy] = useState("1d");
  const [rightTabValue, setRightTabValue] = useState("users");

  const totalSpend = dailySpendData.reduce((sum, item) => sum + item.spend, 0);
  const budgetUsed = 0.05;
  const budgetTotal = 120;
  const budgetPercentage = (budgetUsed / budgetTotal) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader title="Usage" />
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Project Filter */}
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                <SelectItem value="project-1">Project Alpha</SelectItem>
                <SelectItem value="project-2">Project Beta</SelectItem>
                <SelectItem value="project-3">Project Gamma</SelectItem>
              </SelectContent>
            </Select>

            {/* API Key Filter */}
            <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="All API Keys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All API Keys</SelectItem>
                <SelectItem value="key-1">Production Key</SelectItem>
                <SelectItem value="key-2">Development Key</SelectItem>
                <SelectItem value="key-3">Test Key</SelectItem>
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[120px] bg-secondary border-border">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="user-1">John Doe</SelectItem>
                <SelectItem value="user-2">Jane Smith</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-secondary border-border text-foreground"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MM/dd/yy")} -{" "}
                        {format(dateRange.to, "MM/dd/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "MM/dd/yy")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Export Button */}
            <Button variant="outline" className="bg-secondary border-border">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Bar Chart Section - Takes 3 columns */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spend</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${totalSpend.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Group by</span>
                    <div className="flex bg-secondary rounded-lg p-1">
                      {groupByOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setGroupBy(option)}
                          className={`px-3 py-1 text-sm rounded-md transition-colors ${
                            groupBy === option
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySpendData}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--foreground)", fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--secondary)" }} />
                      <Bar
                        dataKey="spend"
                        fill="var(--chart-3)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* API Capabilities and Spend Categories Tabs */}
            <Tabs defaultValue="capabilities" className="w-full ">
              <TabsList className="bg-card border-border">
                <TabsTrigger value="capabilities">API capabilities</TabsTrigger>
                <TabsTrigger value="categories">Spend categories</TabsTrigger>
              </TabsList>
              <TabsContent value="capabilities" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiCapabilities.map((capability) => (
                    <Card key={capability.name} className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground flex items-center gap-2">
                              {capability.name}
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-chart-3"></span>
                                {capability.requests} requests
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                                {capability.tokens}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="categories" className="mt-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {spendCategories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">{category.name}</span>
                            <span className="text-muted-foreground">{category.spend}</span>
                          </div>
                          <Progress value={category.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Budget and Stats */}
          <div className="xl:col-span-1 space-y-6">
            {/* Budget Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">January budget</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ${budgetUsed.toFixed(2)}{" "}
                  <span className="text-muted-foreground font-normal">/ ${budgetTotal}</span>
                </p>
                <Progress value={budgetPercentage} className="h-2 mt-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  Resets in 22 days.{" "}
                  <button className="text-chart-3 hover:underline">Edit budget</button>
                </p>
              </CardContent>
            </Card>

            {/* Total Tokens Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total tokens</p>
                <p className="text-2xl font-bold text-foreground mt-1">12,378</p>
                <div className="h-[60px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tokenData}>
                      <Line
                        type="monotone"
                        dataKey="tokens"
                        stroke="var(--chart-3)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Total Requests Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total requests</p>
                <p className="text-2xl font-bold text-foreground mt-1">182</p>
                <div className="h-[60px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestData}>
                      <Bar
                        dataKey="requests"
                        fill="var(--chart-3)"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Users/Services/API Keys Tabs */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <Tabs value={rightTabValue} onValueChange={setRightTabValue}>
                  <TabsList className="bg-card border w-full">
                    <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
                    <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
                    <TabsTrigger value="apikeys" className="flex-1">API Keys</TabsTrigger>
                  </TabsList>
                  <TabsContent value="users" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">john@example.com</span>
                        <span className="text-muted-foreground">$0.08</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">jane@example.com</span>
                        <span className="text-muted-foreground">$0.04</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">dev@example.com</span>
                        <span className="text-muted-foreground">$0.02</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="services" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">Chat API</span>
                        <span className="text-muted-foreground">$0.10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">Image API</span>
                        <span className="text-muted-foreground">$0.04</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="apikeys" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">sk-prod-***</span>
                        <span className="text-muted-foreground">$0.09</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">sk-dev-***</span>
                        <span className="text-muted-foreground">$0.05</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
