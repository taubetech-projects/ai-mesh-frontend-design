import { toast } from "sonner";
import * as React from "react";
import { StatusToast } from "../components/StatusToast";
import { ErrorResponse } from "@/features/chat/auth/types/authModels";

export const showStatusToast = (
  status: "success" | "error" | "warning" | "info",
  title: string,
  message: string
) => {
  toast.custom(() =>
    React.createElement(StatusToast, { status, title, message })
  );
};

export const handleApiErrorToast = (error: unknown) => {
  const err = (error as any)?.response?.data as ErrorResponse;
  if (!err) {
    showStatusToast(
      "error",
      "Unexpected Error",
      "Something went wrong. Please try again."
    );
    return;
  }

  switch (err.status) {
    case 400:
      showStatusToast("warning", "Bad Request", err.detail);
      break;

    case 401:
      showStatusToast("error", "Unauthorized", "Please login again");
      break;

    case 403:
      showStatusToast("error", "Forbidden", err.detail);
      break;

    case 404:
      showStatusToast("info", "Not Found", err.detail);
      break;

    case 409:
      showStatusToast("warning", "Conflict", err.detail);
      break;

    default:
      showStatusToast("error", "Server Error", err.detail);
  }
};

export const showSuccessToast = (message: string) => {
  showStatusToast("success", "Success", message);
};
