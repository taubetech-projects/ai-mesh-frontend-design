// components/settings/ModelPreferences.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import {
  useModelPreferences,
  useUpdateModelPreferences,
} from "../hooks/modelPreferencesHook";
import { ModelRow } from "./ModelRow";
import {
  ModelUIState,
  UserModelPreference,
} from "../types/modelPreferencesTypes";
import { useModels } from "../hooks/modelHooks";

export const ModelPreferences = () => {
  // 1. Fetch Data
  const { data: initialData, isLoading } = useModelPreferences();
  const { data: modelsData, isLoading: isModelLoading } = useModels();

  const { mutate: savePreferences, isPending: isSaving } =
    useUpdateModelPreferences();

  // 2. Local State for Optimistic UI Updates
  const [items, setItems] = useState<UserModelPreference[]>([]);

  // Sync local state when data fetches
  useEffect(() => {
    if (initialData) {
      setItems(initialData);
    }
  }, [initialData]);

  // 3. DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 4. Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item))
    );
  };

  const handleModelChange = (id: string, modelId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedModelId: modelId } : item
      )
    );
  };

  const handleSave = () => {
    // Transform UI state back to API payload format
    const payload = items.map((item, index) => ({
      providerId: item.id,
      enabled: item.isActive,
      selectedModelId: item.modelId,
      order: index,
    }));
    savePreferences(payload);
  };

  if (isLoading)
    return (
      <div className="p-10 flex justify-center text-neutral-500">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto  rounded-lg min-h-screen text-white">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">
          Customize your chat AI model preferences
        </h2>
        <p className="text-neutral-500 text-sm">
          Easily update your selections anytime in the settings
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-1 ">
            {items.map((item) => (
              <ModelRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onModelChange={handleModelChange}
                modelData={modelsData || []}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex justify-end pt-6 border-t border-neutral-800">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-70"
        >
          {isSaving && <Loader2 size={16} className="animate-spin" />}
          {isSaving ? "Saving..." : "Update preferences"}
        </button>
      </div>
    </div>
  );
};
