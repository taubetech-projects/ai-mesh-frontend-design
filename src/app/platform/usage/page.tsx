"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Progress } from "@/shared/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Download,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { format, subDays, eachDayOfInterval } from "date-fns";
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
import { useTokenUsage } from "@/features/platform/usage/usage.queries";
import { TokenUsageEvent } from "@/features/platform/usage/usage.types";
import {
  useMemberOfProjectsQuery,
  useOwnedProjectsQuery,
} from "@/features/platform/projects/hooks/useProjectQueries";
import {
  useAllApiKeys,
  useProjectApiKeys,
} from "@/features/platform/api-keys/hooks/useProjectApiKeys";
import { useEndpoints } from "@/features/platform/endpoints/endpointCatalog.queries";

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
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [dateRange, selectedProject, selectedApiKey, selectedUser]);

  const queryParams = {
    page,
    size: pageSize,
    from: dateRange?.from?.toISOString(),
    to: dateRange?.to?.toISOString(),
    projectId: selectedProject === "all" ? undefined : selectedProject,
    apiKeyId: selectedApiKey === "all" ? undefined : selectedApiKey,
    billedUserId: selectedUser === "all" ? undefined : selectedUser,
    sortDir: "DESC" as const,
  };

  const { data: usagePage, isLoading } = useTokenUsage(queryParams);
  const { data: ownedProjects } = useOwnedProjectsQuery();
  const { data: memberProjects } = useMemberOfProjectsQuery();
  const { data: allKeys } = useAllApiKeys();
  const { data: projectApiKeys } = useProjectApiKeys(selectedProject || "");
  const { data: endpoints } = useEndpoints();

  const usageData = usagePage?.data || [];

  const allProjects = [...(ownedProjects || []), ...(memberProjects || [])];
  const projects = Array.from(
    new Map(allProjects.map((p) => [p.id, p])).values()
  );

  const apiKeysList =
    selectedProject === "all" ? allKeys || [] : projectApiKeys || [];

  useEffect(() => {
    setSelectedApiKey("all");
  }, [selectedProject]);

  // --- Aggregations for Charts (Client-side based on current page) ---

  const dailySpendData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const map = new Map<string, number>();
    usageData.forEach((item) => {
      const date = format(new Date(item.createdAt), "MMM dd");
      const cost = (item.costNanoUsd || 0) / 1e9;
      map.set(date, (map.get(date) || 0) + cost);
    });

    try {
      return eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      }).map((day) => {
        const date = format(day, "MMM dd");
        return { date, spend: map.get(date) || 0 };
      });
    } catch (error) {
      return [];
    }
  }, [usageData, dateRange]);

  const tokenData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const map = new Map<string, number>();
    usageData.forEach((item) => {
      const day = format(new Date(item.createdAt), "dd");
      map.set(day, (map.get(day) || 0) + (item.totalTokens || 0));
    });

    try {
      return eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      }).map((d) => {
        const day = format(d, "dd");
        return { day, tokens: map.get(day) || 0 };
      });
    } catch (error) {
      return [];
    }
  }, [usageData, dateRange]);

  const requestData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];

    const map = new Map<string, number>();
    usageData.forEach((item) => {
      const day = format(new Date(item.createdAt), "dd");
      map.set(day, (map.get(day) || 0) + 1);
    });

    try {
      return eachDayOfInterval({
        start: dateRange.from,
        end: dateRange.to,
      }).map((d) => {
        const day = format(d, "dd");
        return { day, requests: map.get(day) || 0 };
      });
    } catch (error) {
      return [];
    }
  }, [usageData, dateRange]);

  const apiCapabilities = useMemo(() => {
    if (!endpoints) return [];

    const usageMap = new Map<string, { requests: number; tokens: number }>();

    const codeToId = new Map<string, string>();
    endpoints.forEach((e) => {
      codeToId.set(e.path, e.id);
    });

    usageData.forEach((item: any) => {
      let id = item.endpointId;

      if (!id) {
        const code = item.endpointCode || item.mode;
        if (code) {
          id = codeToId.get(code) || codeToId.get(code.toLowerCase());
        }
      }

      if (id) {
        const current = usageMap.get(id) || { requests: 0, tokens: 0 };
        usageMap.set(id, {
          requests: current.requests + 1,
          tokens: current.tokens + (item.totalTokens || 0),
        });
      }
    });

    return endpoints.map((endpoint) => {
      const stats = usageMap.get(endpoint.id) || { requests: 0, tokens: 0 };
      return {
        name: endpoint.description,
        requests: stats.requests,
        tokens: `${stats.tokens.toLocaleString()} tokens`,
      };
    });
  }, [usageData, endpoints]);

  const spendCategories = useMemo(() => {
    const map = new Map<string, number>();
    let total = 0;
    usageData.forEach((item) => {
      const model = item.modelName || "Unknown";
      const cost = (item.costNanoUsd || 0) / 1e9;
      map.set(model, (map.get(model) || 0) + cost);
      total += cost;
    });
    return Array.from(map.entries()).map(([name, spend]) => ({
      name,
      spend: `$${spend.toFixed(4)}`,
      percentage: total > 0 ? (spend / total) * 100 : 0,
    }));
  }, [usageData]);

  const totalSpend =
    usageData.reduce((sum, item) => sum + (item.costNanoUsd || 0), 0) / 1e9;
  const totalTokens = usageData.reduce(
    (sum, item) => sum + (item.totalTokens || 0),
    0
  );
  const totalRequests = usageData.length;

  // Budget is static for now as it's not in the hook
  const budgetUsed = totalSpend;
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
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* API Key Filter */}
            <Select value={selectedApiKey} onValueChange={setSelectedApiKey}>
              <SelectTrigger className="w-[140px] bg-secondary border-border">
                <SelectValue placeholder="All API Keys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All API Keys</SelectItem>
                {apiKeysList.map((apiKey: any) => (
                  <SelectItem key={apiKey.id} value={apiKey.id}>
                    {apiKey.name}
                  </SelectItem>
                ))}
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
              Export Page
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
                      ${totalSpend.toFixed(4)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Group by
                    </span>
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
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailySpendData}>
                        <XAxis
                          dataKey="date"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "var(--muted-foreground)",
                            fontSize: 12,
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "var(--foreground)", fontSize: 12 }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: "var(--secondary)" }}
                        />
                        <Bar
                          dataKey="spend"
                          fill="var(--chart-3)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
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
                {apiCapabilities.length === 0 && !isLoading && (
                  <div className="text-center p-4 text-muted-foreground">
                    No data available for this period.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {apiCapabilities.map((capability) => (
                    <Card
                      key={capability.name}
                      className="bg-card border-border hover:border-primary/30 transition-colors cursor-pointer"
                    >
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
                    {spendCategories.length === 0 && !isLoading && (
                      <div className="text-center p-4 text-muted-foreground">
                        No spend data available.
                      </div>
                    )}
                    <div className="space-y-4">
                      {spendCategories.map((category) => (
                        <div key={category.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground font-medium">
                              {category.name}
                            </span>
                            <span className="text-muted-foreground">
                              {category.spend}
                            </span>
                          </div>
                          <Progress
                            value={category.percentage}
                            className="h-2"
                          />
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
                  <span className="text-muted-foreground font-normal">
                    / ${budgetTotal}
                  </span>
                </p>
                <Progress value={budgetPercentage} className="h-2 mt-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  Resets in 22 days.{" "}
                  <button className="text-chart-3 hover:underline">
                    Edit budget
                  </button>
                </p>
              </CardContent>
            </Card>

            {/* Total Tokens Card */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total tokens</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {totalTokens.toLocaleString()}
                </p>
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
                <p className="text-2xl font-bold text-foreground mt-1">
                  {totalRequests}
                </p>
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
                    <TabsTrigger value="users" className="flex-1">
                      Users
                    </TabsTrigger>
                    <TabsTrigger value="services" className="flex-1">
                      Services
                    </TabsTrigger>
                    <TabsTrigger value="apikeys" className="flex-1">
                      API Keys
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="users" className="mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          john@example.com
                        </span>
                        <span className="text-muted-foreground">$0.08</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          jane@example.com
                        </span>
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

          {/* Request Log Table (New Section for Pagination) */}
          <div className="xl:col-span-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Request Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary text-muted-foreground">
                      <tr>
                        <th className="p-3 font-medium">Date</th>
                        <th className="p-3 font-medium">Model</th>
                        <th className="p-3 font-medium">Mode</th>
                        <th className="p-3 font-medium">Tokens</th>
                        <th className="p-3 font-medium">Cost</th>
                        <th className="p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center">
                            Loading...
                          </td>
                        </tr>
                      ) : usageData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No records found.
                          </td>
                        </tr>
                      ) : (
                        usageData.map((event) => (
                          <tr
                            key={event.id}
                            className="border-t border-border hover:bg-secondary/50"
                          >
                            <td className="p-3">
                              {format(
                                new Date(event.createdAt),
                                "MMM dd, HH:mm:ss"
                              )}
                            </td>
                            <td className="p-3">{event.modelName}</td>
                            <td className="p-3">{event.mode}</td>
                            <td className="p-3">{event.totalTokens}</td>
                            <td className="p-3">
                              ${((event.costNanoUsd || 0) / 1e9).toFixed(6)}
                            </td>
                            <td className="p-3">{event.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0 || isLoading}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page + 1} of {usagePage?.totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      page >= (usagePage?.totalPages || 1) - 1 || isLoading
                    }
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
