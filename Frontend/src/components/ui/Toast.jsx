import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
let addToastFn = null;
let nextToastId = 0;

const createToastId = () => {
  nextToastId += 1;
  return `toast-${Date.now()}-${nextToastId}`;
};

export function toast(message, type = "success") {
  addToastFn?.(message, type);
}
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    addToastFn = (message, type) => {
      const id = createToastId();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };
    return () => {
      addToastFn = null;
    };
  }, []);
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
  };
  const colors = {
    success: "var(--success)",
    error: "var(--destructive)",
    warning: "var(--warning)",
    info: "var(--primary)",
  };
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl pointer-events-auto"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              minWidth: 280,
              maxWidth: 380,
            }}
          >
            <Icon size={16} style={{ color: colors[t.type], flexShrink: 0 }} />
            <p
              className="text-sm flex-1"
              style={{ color: "var(--foreground)" }}
            >
              {t.message}
            </p>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
              }
              style={{ color: "var(--muted-foreground)" }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
