export default function DataTable({ columns, data, emptyMessage = "Nenhum registro encontrado.", onRowClick }) {
    return (<div className="w-full overflow-x-auto" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
        }}>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {columns.map((col) => (<th key={col.key} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)", width: col.width }}>
                {col.header}
              </th>))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (<tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                {emptyMessage}
              </td>
            </tr>) : (data.map((row, i) => (<tr key={row.id} className={`transition-colors ${onRowClick ? "cursor-pointer" : ""}`} style={{ borderBottom: i < data.length - 1 ? "1px solid var(--border)" : undefined }} onClick={() => onRowClick?.(row)} onMouseEnter={(e) => { if (onRowClick)
            e.currentTarget.style.background = "var(--muted)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}>
                {columns.map((col) => (<td key={col.key} className="px-4 py-3 text-sm" style={{ color: "var(--foreground)" }}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>))}
              </tr>)))}
        </tbody>
      </table>
    </div>);
}
