import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, CodeBlock, StatusBadge } from "@/features/platform/components/platform";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  status: "stable" | "beta" | "deprecated";
}

const endpoints: Endpoint[] = [
  {
    method: "POST",
    path: "/v1/chat/completions",
    description: "Create a chat completion with the specified model",
    status: "stable",
  },
  {
    method: "POST",
    path: "/v1/completions",
    description: "Create a text completion",
    status: "stable",
  },
  {
    method: "POST",
    path: "/v1/embeddings",
    description: "Create embeddings for the given input",
    status: "stable",
  },
  {
    method: "GET",
    path: "/v1/models",
    description: "List all available models",
    status: "stable",
  },
  {
    method: "GET",
    path: "/v1/models/:id",
    description: "Get details about a specific model",
    status: "stable",
  },
  {
    method: "POST",
    path: "/v1/images/generations",
    description: "Generate images from a text prompt",
    status: "beta",
  },
  {
    method: "POST",
    path: "/v1/audio/transcriptions",
    description: "Transcribe audio to text",
    status: "beta",
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-info/20 text-info",
  POST: "bg-success/20 text-success",
  PUT: "bg-warning/20 text-warning",
  DELETE: "bg-destructive/20 text-destructive",
};

const curlExample = `curl -X POST https://api.yourplatform.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4-turbo",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ]
  }'`;

const pythonExample = `import requests

response = requests.post(
    "https://api.yourplatform.com/v1/chat/completions",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-4-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello!"}
        ]
    }
)

print(response.json())`;

const jsExample = `const response = await fetch('https://api.yourplatform.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello!' }
    ]
  })
});

const data = await response.json();
console.log(data);`;

export default function Endpoints() {
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
              <h3 className="font-medium text-foreground">Available Endpoints</h3>
            </div>
            <div className="divide-y divide-border">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        methodColors[endpoint.method]
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm text-foreground font-mono">
                      {endpoint.path}
                    </code>
                    {endpoint.status !== "stable" && (
                      <StatusBadge
                        status={endpoint.status}
                        variant={endpoint.status === "beta" ? "warning" : "destructive"}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code Examples */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">Quick Start Examples</h3>
            </div>
            <div className="p-4">
              <Tabs defaultValue="curl">
                <TabsList className="mb-4">
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="curl">
                  <CodeBlock code={curlExample} />
                </TabsContent>

                <TabsContent value="python">
                  <CodeBlock code={pythonExample} language="python" />
                </TabsContent>

                <TabsContent value="javascript">
                  <CodeBlock code={jsExample} language="javascript" />
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
            All API requests should be made to this base URL. Make sure to include your API key in the Authorization header.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
