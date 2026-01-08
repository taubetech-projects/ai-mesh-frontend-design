"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import {
  PageHeader,
  CodeBlock,
  StatusBadge,
} from "@/features/platform/components/platform";
import { cn } from "@/features/platform/lib/utils";
import {
  useEndpoint,
  useEndpoints,
} from "@/features/platform/endpoints/endpointCatalog.queries";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const methodColors: Record<string, string> = {
  GET: "bg-warning/20 text-warning",
  POST: "bg-success/20 text-success",
  PUT: "bg-warning/20 text-warning",
  DELETE: "bg-destructive/20 text-destructive",
};

// Static data map for endpoint examples
const endpointExamplesMap: Record<string, Record<string, string>> = {
  "/v1/chat/completions": {
    curl: `curl -X POST https://api.ai-mesh.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`,
    python: `import requests

response = requests.post(
    "https://api.ai-mesh.com/v1/chat/completions",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
print(response.json())`,
    javascript: `const response = await fetch('https://api.ai-mesh.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});
console.log(await response.json());`,
  },
  "/v1/models": {
    curl: `curl https://api.ai-mesh.com/v1/models \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    python: `import requests
response = requests.get(
    "https://api.ai-mesh.com/v1/models",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
print(response.json())`,
    javascript: `const response = await fetch('https://api.ai-mesh.com/v1/models', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});
console.log(await response.json());`,
  },
};

export default function Endpoints() {
  const { data: endpoints } = useEndpoints();
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);

  // Select the first endpoint initially when data loads
  useEffect(() => {
    if (endpoints && endpoints.length > 0 && !selectedEndpoint) {
      setSelectedEndpoint(endpoints[0]);
    }
  }, [endpoints, selectedEndpoint]);

  // Helper to get examples for the selected endpoint
  const getExamples = (endpoint: any) => {
    if (!endpoint) return { curl: "", python: "", javascript: "" };

    // Return static examples if available
    if (endpointExamplesMap[endpoint.path]) {
      return endpointExamplesMap[endpoint.path];
    }

    // Fallback: Generate generic examples based on method and path
    const url = `https://api.ai-mesh.com${endpoint.path}`;
    return {
      curl: `curl -X ${endpoint.httpMethod} ${url} \\\n  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests\n\nresponse = requests.${endpoint.httpMethod?.toLowerCase()}("${url}", headers={"Authorization": "Bearer YOUR_API_KEY"})\nprint(response.json())`,
      javascript: `const response = await fetch('${url}', {\n  method: '${endpoint.httpMethod}',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }\n});\nconsole.log(await response.json());`,
    };
  };

  const currentExamples = getExamples(selectedEndpoint);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="API Endpoints"
          description="Explore available API endpoints and documentation"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Endpoints List */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">
                Available Endpoints
              </h3>
            </div>
            <div className="divide-y divide-border">
              {endpoints?.map((endpoint, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={cn(
                    "p-4 hover:bg-secondary/50 transition-colors cursor-pointer border-l-2 border-transparent",
                    selectedEndpoint === endpoint
                      ? "bg-secondary/50 border-primary"
                      : ""
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        methodColors[endpoint.httpMethod]
                      }`}
                    >
                      {endpoint.httpMethod?.toString().toUpperCase()}
                    </span>
                    <code className="text-sm text-foreground font-mono">
                      {endpoint.path}
                    </code>
                    {/* {endpoint.status !== "stable" && (
                      <StatusBadge
                        status={endpoint.status}
                        variant={
                          endpoint.status === "beta" ? "warning" : "destructive"
                        }
                      />
                    )} */}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">
                Quick Start Examples{" "}
                {selectedEndpoint && `- ${selectedEndpoint.path}`}
              </h3>
            </div>
            <div className="p-4">
              <Tabs defaultValue="curl">
                <TabsList className="mb-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="curl">
                  <CodeBlock code={currentExamples.curl} />
                </TabsContent>

                <TabsContent value="python">
                  <CodeBlock code={currentExamples.python} language="python" />
                </TabsContent>

                <TabsContent value="javascript">
                  <CodeBlock
                    code={currentExamples.javascript}
                    language="javascript"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* API Base URL */}
        <div className="mt-6 bg-card border border-border rounded-xl p-5">
          <h3 className="font-medium text-foreground mb-3">API Base URL</h3>
          <div className="flex items-center gap-4">
            <code className="flex-1 bg-secondary px-4 py-2 rounded-lg font-mono text-foreground">
              https://api.yourplatform.com/v1
            </code>
            <StatusBadge status="Online" variant="success" />
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            All API requests should be made to this base URL. Make sure to
            include your API key in the Authorization header.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
