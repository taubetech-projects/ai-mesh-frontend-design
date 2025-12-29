// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\shared\components\ui\form-input.tsx
import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const FormInput = ({
  label,
  id,
  className = "",
  ...props
}: FormInputProps) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    </div>
  );
};
