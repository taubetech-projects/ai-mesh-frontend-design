// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\features\platform\api-keys\PermissionsForm.tsx

import { Label } from "@/shared/components/ui/label";
import { SelectionList } from "./SelectionList";
import { ModelView } from "../../models/types/modelTypes";
import { EndpointView } from "../../endpoints/endpoint.types";

interface PermissionsFormProps {
  type: "all" | "restricted";
  onTypeChange: (type: "all" | "restricted") => void;
  selectedModels: Set<string>;
  onModelsChange: (models: Set<string>) => void;
  selectedEndpoints: Set<string>;
  onEndpointsChange: (endpoints: Set<string>) => void;
  availableModels: ModelView[];
  availableEndpoints: EndpointView[];
  errors?: {
    models?: string;
    endpoints?: string;
  };
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
  errors,
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
          <div className="space-y-1">
            <SelectionList
              title="Models"
              items={
                new Map(
                  availableModels.map((model) => [model.id, model.displayName])
                )
              }
              selected={selectedModels}
              onChange={onModelsChange}
            />
            {errors?.models && (
              <p className="text-xs text-destructive">{errors.models}</p>
            )}
          </div>
          <div className="space-y-1">
            <SelectionList
              title="Endpoints"
              items={
                new Map(
                  availableEndpoints.map((endpoint) => [
                    endpoint.id,
                    endpoint.path,
                  ])
                )
              }
              selected={selectedEndpoints}
              onChange={onEndpointsChange}
            />
            {errors?.endpoints && (
              <p className="text-xs text-destructive">{errors.endpoints}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
