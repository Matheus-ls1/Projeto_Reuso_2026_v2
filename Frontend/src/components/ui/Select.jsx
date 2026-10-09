export default function Select({ label, options, placeholder, className = "", ...rest }) {
    return (<div className="flex flex-col gap-1">
      {label && (<label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
          {label}
        </label>)}
      <select className={`w-full px-3 py-2 text-sm rounded-lg outline-none ${className}`} style={{
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
        }} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>);
}
