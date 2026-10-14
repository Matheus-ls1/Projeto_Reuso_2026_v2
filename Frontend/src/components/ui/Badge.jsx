const colorStyles = {
  blue: { background: "#DBEAFE", color: "#1D4ED8" },
  green: { background: "#DCFCE7", color: "#15803D" },
  orange: { background: "#FFEDD5", color: "#C2410C" },
  red: { background: "#FEE2E2", color: "#B91C1C" },
  gray: { background: "#F3F4F6", color: "#4B5563" },
  purple: { background: "#EDE9FE", color: "#6D28D9" },
  brand: { background: "#E0E7F3", color: "#142B4A" },
};
export default function Badge({ color = "gray", children, size = "md" }) {
  const padding =
    size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${padding}`}
      style={colorStyles[color]}
    >
      {children}
    </span>
  );
}
