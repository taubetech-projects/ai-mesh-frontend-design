import { useState } from "react";
import { Send, Settings, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/features/platform/components/layouts";
import { PageHeader, CodeBlock } from "@/features/platform/components/platform";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Slider } from "@/shared/components/ui/slider";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/features/platform/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const availableModels = [
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
  { id: "gemini-pro", name: "Gemini Pro" },
];

export default function Playground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4-turbo");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `This is a simulated response from ${model}. In a real implementation, this would be connected to your backend API.\n\nYour message was: "${input}"\n\nParameters used:\n- Temperature: ${temperature[0]}\n- Max Tokens: ${maxTokens[0]}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateCurlCommand = () => {
    return `curl -X POST https://api.yourplatform.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": ${JSON.stringify(messages.length > 0 ? messages : [{ role: "user", content: "Hello" }], null, 2)},
    "temperature": ${temperature[0]},
    "max_tokens": ${maxTokens[0]}
  }'`;
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in h-[calc(100vh-8rem)]">
        <PageHeader
          title="Playground"
          description="Test and experiment with different models"
        >
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </PageHeader>

        <div className="flex gap-6 h-[calc(100%-5rem)]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-card border border-border rounded-xl overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Start a conversation to test the API
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg",
                      message.role === "user"
                        ? "bg-secondary ml-12"
                        : "bg-primary/10 mr-12"
                    )}
                  >
                    <div className="text-xs text-muted-foreground mb-1 capitalize">
                      {message.role}
                    </div>
                    <div className="text-foreground whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="bg-primary/10 mr-12 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="w-80 bg-card border border-border rounded-xl p-5 space-y-6 overflow-y-auto scrollbar-thin">
              <div className="space-y-3">
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Max Tokens</Label>
                  <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
                </div>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  min={256}
                  max={4096}
                  step={256}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Label className="mb-3 block">cURL Command</Label>
                <CodeBlock code={generateCurlCommand()} />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
