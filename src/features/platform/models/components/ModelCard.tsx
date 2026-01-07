import { ImageIcon } from "lucide-react";
import { ModelView } from "@/features/platform/models/types/modelTypes";

interface ModelCardProps {
  model: ModelView;
  onModelClick: () => void;
}

export function ModelCard({ model, onModelClick }: ModelCardProps) {
  return (
    <div className="card-interactive p-5" onClick={onModelClick}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{model.displayName}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{model.providerDisplayName}</p>
        </div>
        <span className="text-xs badge-warning  px-2 py-1 rounded ">
          {model.contextWindowTokens} context
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{model.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(model.inputModalities?.length > 0 || model.outputModalities?.length > 0) && (
          <div className="flex items-center gap-1.5 text-xs bg-secondary text-foreground px-2 py-1 rounded">
            <div className="flex items-center gap-1">
              {model.inputModalities?.map((m: string) =>
                m.includes("IMAGE") ? (
                  <ImageIcon key={m} className="w-3 h-3" />
                ) : (
                  <span key={m} className="font-bold">
                    T
                  </span>
                )
              )}
            </div>
            <span className="text-muted-foreground">→</span>
            <div className="flex items-center gap-1">
              {model.outputModalities?.map((m: string) =>
                m.includes("IMAGE") ? (
                  <ImageIcon key={m} className="w-3 h-3" />
                ) : (
                  <span key={m} className="font-bold">
                    T
                  </span>
                )
              )}
            </div>
          </div>
        )}
        {model.capabilities.map((cap) => (
          <span
            key={cap}
            className="text-xs bg-secondary text-foreground px-2 py-1 rounded"
          >
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm">
          <span className="text-muted-foreground">Input: </span>
          <span className="text-foreground font-mono">
            ${model.inputPpmCents != null ? (model.inputPpmCents / 100).toFixed(2) : "—"}/1M
          </span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Output: </span>
          <span className="text-foreground font-mono">
            ${model.outputPpmCents != null ? (model.outputPpmCents / 100).toFixed(2) : "—"}/1M
          </span>
        </div>
      </div>
    </div>
  );
}
