// components/ui/Toggle.tsx
import clsx from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle = ({ checked, onChange, disabled }: ToggleProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={clsx(
      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
      checked ? "bg-white" : "bg-neutral-700",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={clsx(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5 bg-black" : "translate-x-0 bg-neutral-400"
      )}
    />
  </button>
);