// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\features\platform\api-keys\RateLimitForm.tsx

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface RateLimitFormProps {
  value: { tpm: string; rpm: string };
  onChange: (value: { tpm: string; rpm: string }) => void;
}

export function RateLimitForm({ value, onChange }: RateLimitFormProps) {
  return (
    <div className="space-y-2">
      <Label>Custom Rate Limits (Optional)</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tpm" className="text-xs text-muted-foreground">
            Tokens per Minute (TPM)
          </Label>
          <Input
            id="tpm"
            placeholder="Unlimited"
            value={value.tpm}
            onChange={(e) => onChange({ ...value, tpm: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="rpm" className="text-xs text-muted-foreground">
            Requests per Minute (RPM)
          </Label>
          <Input
            id="rpm"
            placeholder="Unlimited"
            value={value.rpm}
            onChange={(e) => onChange({ ...value, rpm: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
