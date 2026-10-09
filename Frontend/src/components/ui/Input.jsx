export default function Input({ label, error, className = "", ...rest }) {
    return (<div className="flex flex-col gap-1">
      {label && (<label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {label}
        </label>)}
      <input className={`w-full px-3 py-2 text-sm rounded-lg outline-none transition-all ${className}`} style={{
            border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
            background: "var(--card)",
            color: "var(--foreground)",
        }} {...rest}/>
      {error && <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>}
    </div>);
}
