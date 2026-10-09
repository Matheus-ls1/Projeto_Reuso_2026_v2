import { X } from "lucide-react";
export default function Drawer({ open, onClose, title, children, footer, width = 480 }) {
    return (<>
      {open && (<div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.3)" }} onClick={onClose}/>)}
      <div className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-xl transition-transform duration-300" style={{
            width,
            background: "var(--card)",
            borderLeft: "1px solid var(--border)",
            transform: open ? "translateX(0)" : "translateX(100%)",
        }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, color: "var(--muted-foreground)" }}>
            <X size={16}/>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && (<div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
            {footer}
          </div>)}
      </div>
    </>);
}
