"use client";
import { RootState } from "@/lib/store/store";
import { hideToast } from "@/shared/hooks/toast-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function GlobalToast() {
  const dispatch = useDispatch();
  // Note: Ensure 'toast' is added to your RootState in store.ts
  const { isVisible, message, type } = useSelector(
    (state: RootState) =>
      (state as any).toast || { isVisible: false, message: "", type: "info" }
  );

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg transition-all duration-300 animate-in slide-in-from-top-2 ${getBackgroundColor()}`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => dispatch(hideToast())}
        className="ml-2 rounded-full p-1 hover:bg-white/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}
