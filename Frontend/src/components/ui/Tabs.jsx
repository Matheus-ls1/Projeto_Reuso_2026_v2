export default function Tabs({ tabs, active, onChange, children }) {
  return (
    <div>
      <div
        className="flex gap-1 mb-5 p-1 rounded-lg w-fit"
        style={{ background: "var(--muted)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="px-4 py-1.5 text-sm font-medium rounded-md transition-all"
            style={
              active === tab.key
                ? {
                    background: "var(--card)",
                    color: "var(--foreground)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }
                : {
                    background: "transparent",
                    color: "var(--muted-foreground)",
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
