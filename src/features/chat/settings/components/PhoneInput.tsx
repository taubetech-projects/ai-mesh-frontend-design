// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\shared\components\ui\phone-input.tsx
import { ChevronDownIcon } from "lucide-react";
import React from "react";

export const PhoneInput = () => (
  <div className="mb-4">
    <label
      htmlFor="phone"
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      Phone
    </label>
    <div className="flex">
      <div className="relative">
        <select
          id="country-code"
          className="w-full pl-4 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-l-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
          defaultValue="+880"
        >
          <option>+880 🇧🇩</option>
          <option>+1 🇺🇸</option>
          <option>+44 🇬🇧</option>
          <option>+91 🇮🇳</option>
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      <input
        type="tel"
        id="phone"
        placeholder="e.g. 98765 43210"
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg border-l-0 focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />
    </div>
  </div>
);
