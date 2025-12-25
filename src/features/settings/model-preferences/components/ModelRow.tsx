// components/settings/ModelRow.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Cpu } from 'lucide-react';
import { Toggle } from '../components/Toggle';
import { ModelUIState } from '../modelPreferencesTypes'; // Adjust import path
import clsx from 'clsx';

interface ModelRowProps {
  item: ModelUIState;
  onToggle: (id: string, val: boolean) => void;
  onModelChange: (id: string, modelId: string) => void;
}

export const ModelRow = ({ item, onToggle, onModelChange }: ModelRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as 'relative',
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
            <div className={`p-2 rounded-lg bg-neutral-900 ${item.icon}`}>
                <Cpu size={20} /> {/* Placeholder for Provider Logo */}
            </div>
            <span className="font-medium text-neutral-200">{item.name}</span>
        </div>
      </div>

      {/* Right Section: Controls */}
      <div className="flex items-center gap-4">
        {/* Dropdown (Hidden if locked) */}
        {!item.isLocked && (
            <select
              value={item.selectedModelId}
              onChange={(e) => onModelChange(item.id, e.target.value)}
              disabled={!item.enabled}
              className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 disabled:opacity-50"
            >
              {item.availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
        )}

        {/* Locked Status or Toggle */}
        <div className="w-12 flex justify-end">
            {item.isLocked ? (
                <Lock size={20} className="text-neutral-600" />
            ) : (
                <Toggle 
                    checked={item.enabled} 
                    onChange={(val) => onToggle(item.id, val)} 
                />
            )}
        </div>
      </div>
    </div>
  );
};