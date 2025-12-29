// components/settings/ModelRow.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Lock, Trash2 } from "lucide-react";
import { Toggle } from "./Toggle";
import {
  ModelUIState,
  UserModelPreference,
} from "../types/modelPreferencesTypes"; // Adjust import path
import clsx from "clsx";
import { ModelResponse } from "../types/modelTypes";

interface ModelRowProps {
  item: UserModelPreference;
  onToggle: (id: string, val: boolean) => void;
  onModelChange: (id: string, modelId: string) => void;
  onDelete: (id: string) => void;
  modelData: ModelResponse[];
}

export const ModelRow = ({
  item,
  onToggle,
  onModelChange,
  onDelete,
  modelData,
}: ModelRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group flex items-center justify-between p-4 mb-3 rounded-xl border border-neutral-800 bg-[#121212] transition-colors",
        isDragging && "shadow-xl border-neutral-600 z-50 opacity-90"
      )}
    >
      {/* Left Section: Drag Handle & Info */}
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 p-1"
        >
          <GripVertical size={20} />
        </button>

        {/* Icon & Name */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-neutral-900 `}>
            <img
              src={`/icons/${item.provider}-64x64.png`}
              alt={item.provider}
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="font-medium text-neutral-200">
            {item.modelDisplayName}
          </span>
        </div>
      </div>

      {/* Right Section: Controls */}
      <div className="flex items-center gap-4">
        {/* Dropdown (Hidden if locked) */}
        {!item.isPremium && (
          <select
            value={item.modelId}
            onChange={(e) => onModelChange(item.id, e.target.value)}
            disabled={!item.isActive}
            className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 disabled:opacity-50"
          >
            {modelData.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}

        {/* Delete Button */}
        {!item.isPremium && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-neutral-600 hover:text-red-500 transition-colors p-1"
            title="Delete Preference"
          >
            <Trash2 size={18} />
          </button>
        )}

        {/* Locked Status or Toggle */}
        <div className="w-12 flex justify-end">
          {item.isPremium ? (
            <Lock size={20} className="text-neutral-600" />
          ) : (
            <Toggle
              checked={item.isActive}
              onChange={(val) => onToggle(item.id, val)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
