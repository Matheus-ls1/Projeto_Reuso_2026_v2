import { Bell, Search } from "lucide-react";
export default function TopBar({ title, breadcrumbs }) {
    return (<header className="flex items-center justify-between px-6" style={{
            height: 64,
            background: "var(--card)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
        }}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (<p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>
            {breadcrumbs.join(" / ")}
          </p>)}
        <h1 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={14} style={{ color: "var(--muted-foreground)" }}/>
          <input placeholder="Buscar..." className="bg-transparent text-sm outline-none w-44" style={{ color: "var(--foreground)" }}/>
        </div>
        <button className="relative flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Bell size={16} style={{ color: "var(--muted-foreground)" }}/>
          <span className="absolute top-1 right-1 rounded-full" style={{ width: 7, height: 7, background: "var(--destructive)" }}/>
        </button>
        <div className="flex items-center justify-center rounded-full text-xs font-semibold text-white" style={{ width: 34, height: 34, background: "var(--primary)", flexShrink: 0 }}>
          JA
        </div>
      </div>
    </header>);
}
