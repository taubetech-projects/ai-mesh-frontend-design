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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  useAddModelPreferences,
  useDeleteModelPreferences,
  useModelPreferences,
  useUpdateModelPreferences,
} from "../hooks/modelPreferencesHook";
import { ModelRow } from "./ModelRow";
import {
  ModelUIState,
  UserModelPreference,
} from "../types/modelPreferencesTypes";
import { useModels } from "../hooks/modelHooks";
import { DeleteConfirmationDialog } from "@/shared/components/delete-confirmation-dialog";

export const ModelPreferences = () => {
  // 1. Fetch Data
  const { data: initialData, isLoading } = useModelPreferences();
  const { data: modelsData, isLoading: isModelLoading } = useModels();
  const {
    mutate: addPreference,
    isPending,
    error: addModelError,
  } = useAddModelPreferences();
  const { mutate: deletePreference, isPending: isDeleting } =
    useDeleteModelPreferences();

  const { mutate: updatePreference, isPending: isUpdating } =
    useUpdateModelPreferences();

  // 2. Local State for Optimistic UI Updates
  const [items, setItems] = useState<UserModelPreference[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedNewModelId, setSelectedNewModelId] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [preferenceIdToDelete, setPreferenceIdToDelete] = useState<
    string | null
  >(null);

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

  const handleToggle = (id: string, isActive: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive } : item))
    );
  };

  const handleModelChange = (id: string, modelId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, modelId: modelId } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setPreferenceIdToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (preferenceIdToDelete) {
      deletePreference(preferenceIdToDelete, {
        onSuccess: () => {
          toast.success("Preference deleted successfully");
          setItems((prev) =>
            prev.filter((item) => item.id !== preferenceIdToDelete)
          );
          setShowDeleteDialog(false);
          setPreferenceIdToDelete(null);
        },
        onError: () => toast.error("Failed to delete preference"),
      });
    }
  };

  const handleUpdatePreferences = () => {
    const payload = items.map((item, index) => ({
      id: item.id,
      modelId: item.modelId,
      position: index + 1,
      isActive: item.isActive,
    }));
    updatePreference(payload, {
      onSuccess: () => toast.success("Preferences updated successfully"),
      onError: () => toast.error("Failed to update preferences"),
    });
  };

  const handleAddNewPreference = () => {
    setIsAddModalOpen(true);
    if (modelsData && modelsData.length > 0) {
      setSelectedNewModelId(modelsData[0].id);
    }
  };

  const handleConfirmAdd = () => {
    // TODO: Call your API hook here with selectedNewModelId
    addPreference(
      { modelId: selectedNewModelId },
      {
        onSuccess: () => {
          toast.success("Preference added successfully");
          setIsAddModalOpen(false);
        },
        onError: () =>
          toast.error("Failed to add preference" + addModelError?.message),
      }
    );
  };

  if (isLoading)
    return (
      <div className="p-10 flex justify-center text-neutral-500">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto rounded-lg text-white">
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
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <ModelRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onModelChange={handleModelChange}
                onDelete={handleDelete}
                modelData={modelsData || []}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 flex justify-end gap-2 pt-6 border-t border-neutral-800">
        <button
          onClick={handleUpdatePreferences}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-70"
        >
          {isUpdating && <Loader2 size={16} className="animate-spin" />}
          {isUpdating ? "Saving..." : "Update preferences"}
        </button>

        <button
          onClick={handleAddNewPreference}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-200 hover:text-black transition-colors disabled:opacity-70"
        >
          Add New Preference
        </button>
      </div>

      {/* Add New Preference Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121212] border border-neutral-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">
              Add New Model Preference
            </h3>

            <div className="mb-6">
              <label className="block text-sm text-neutral-400 mb-2">
                Select Model
              </label>
              <select
                value={selectedNewModelId}
                onChange={(e) => setSelectedNewModelId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {modelsData?.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Model Preference"
        description="Are you sure you want to delete this model preference? This action cannot be undone."
      />
    </div>
  );
};
