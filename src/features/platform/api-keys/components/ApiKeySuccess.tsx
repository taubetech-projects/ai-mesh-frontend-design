"use client";

import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { ApiKeyDisplay } from "./ApiKeyDisplay";

interface NewApiKeySuccessProps {
  apiKey: string;
  onClose: () => void;
}

export function ApiKeySuccess({
  apiKey,
  onClose,
}: NewApiKeySuccessProps) {
  const exampleCurl = `curl https://api.yourplatform.com/v1/chat/completions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{ "role": "user", "content": "Hello!" }]
  }'`;

  return (
    <div className="animate-in space-y-6 fade-in slide-in-from-bottom-4 duration-300">
      {/* Success Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-semibold">
          API Key Created Successfully
        </h3>

        <p className="text-sm text-muted-foreground">
          Please copy your API key now. For security reasons, you won&apos;t be
          able to see it again.
        </p>
      </div>

      {/* API Key */}
      <ApiKeyDisplay apiKey={apiKey} showWarning />

      {/* Example */}
      <Card className="border-muted bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Example API Call</CardTitle>
        </CardHeader>

        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-background p-3 font-mono text-xs">
            {exampleCurl}
          </pre>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Done
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
