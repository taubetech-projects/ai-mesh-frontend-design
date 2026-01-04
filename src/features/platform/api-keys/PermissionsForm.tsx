// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\features\platform\api-keys\PermissionsForm.tsx

import { Label } from "@/shared/components/ui/label";
import { SelectionList } from "./SelectionList";

interface PermissionsFormProps {
  type: "all" | "restricted";
  onTypeChange: (type: "all" | "restricted") => void;
  selectedModels: Set<string>;
  onModelsChange: (models: Set<string>) => void;
  selectedEndpoints: Set<string>;
  onEndpointsChange: (endpoints: Set<string>) => void;
  availableModels: string[];
  availableEndpoints: string[];
}

export function PermissionsForm({
  type,
  onTypeChange,
  selectedModels,
  onModelsChange,
  selectedEndpoints,
  onEndpointsChange,
  availableModels,
  availableEndpoints,
}: PermissionsFormProps) {
  return (
    <div className="space-y-3">
      <Label>Permissions</Label>
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        <button
          type="button"
          className={`flex-1 text-sm font-medium py-1.5 px-3 rounded-md transition-all ${
            type === "all"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTypeChange("all")}
        >
          All Access
        </button>
        <button
          type="button"
          className={`flex-1 text-sm font-medium py-1.5 px-3 rounded-md transition-all ${
            type === "restricted"
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => onTypeChange("restricted")}
        >
          Restricted
        </button>
      </div>

      {type === "restricted" && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-200">
          <SelectionList
            title="Models"
            items={availableModels}
            selected={selectedModels}
            onChange={onModelsChange}
          />
          <SelectionList
            title="Endpoints"
            items={availableEndpoints}
            selected={selectedEndpoints}
            onChange={onEndpointsChange}
          />
        </div>
      )}
    </div>
  );
}
