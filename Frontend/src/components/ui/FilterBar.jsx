import { Search, X } from "lucide-react";
export default function FilterBar({
  search,
  onSearchChange,
  placeholder = "Buscar...",
  children,
  onClear,
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap mb-4">
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs"
        style={{ border: "1px solid var(--border)", background: "var(--card)" }}
      >
        <Search size={14} style={{ color: "var(--muted-foreground)" }} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent text-sm outline-none flex-1"
          style={{ color: "var(--foreground)" }}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={12} />
          </button>
        )}
      </div>
      {children}
      {onClear && (
        <button
          onClick={onClear}
          className="text-xs px-3 py-2 rounded-lg"
          style={{
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
            background: "var(--card)",
          }}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
