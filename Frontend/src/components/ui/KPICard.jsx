import { TrendingUp, TrendingDown } from "lucide-react";
export default function KPICard({ label, value, delta, deltaType = "neutral", icon, iconBg, iconColor }) {
    const deltaColor = deltaType === "positive" ? "var(--success)" :
        deltaType === "negative" ? "var(--destructive)" :
            "var(--muted-foreground)";
    return (<div className="flex flex-col gap-3 p-5" style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>{label}</p>
        <div className="flex items-center justify-center rounded-lg" style={{
            width: 36, height: 36,
            background: iconBg || "var(--secondary)",
            color: iconColor || "var(--primary)",
        }}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{value}</p>
        {delta && (<div className="flex items-center gap-1 mt-1">
            {deltaType === "positive" && <TrendingUp size={12} style={{ color: deltaColor }}/>}
            {deltaType === "negative" && <TrendingDown size={12} style={{ color: deltaColor }}/>}
            <p className="text-xs font-medium" style={{ color: deltaColor }}>{delta}</p>
          </div>)}
      </div>
    </div>);
}
