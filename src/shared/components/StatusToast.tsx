import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type Status = "success" | "error" | "warning" | "info";

interface Props {
  status: Status;
  title: string;
  message: string;
}

export const StatusToast = ({ status, title, message }: Props) => {
  const styles = {
    success: "bg-emerald-600 border-emerald-700",
    error: "bg-red-600 border-red-700",
    warning: "bg-amber-500 border-amber-600",
    info: "bg-blue-600 border-blue-700",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex gap-3 rounded-md border px-4 py-3 text-white shadow-lg ${styles[status]}`}
    >
      {icons[status]}
      <div>
        <p className="font-semibold leading-none">{title}</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
};
