import { X } from "lucide-react";
const sizes = { sm: 400, md: 520, lg: 680, xl: 860 };
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col w-full shadow-xl"
        style={{
          maxWidth: sizes[size],
          maxHeight: "90vh",
          background: "var(--card)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 28, height: 28, color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (
          <div
            className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
