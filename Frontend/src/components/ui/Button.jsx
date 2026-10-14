const variants = {
  primary: "text-white font-medium",
  secondary: "font-medium",
  ghost: "font-medium hover:opacity-80",
  destructive: "text-white font-medium",
  outline: "font-medium border",
};
const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-sm gap-2",
};
export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  disabled,
  style,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variantStyles = {
    primary: {
      background: "var(--primary)",
      color: "var(--primary-foreground)",
    },
    secondary: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
    },
    ghost: { background: "transparent", color: "var(--foreground)" },
    destructive: { background: "var(--destructive)", color: "white" },
    outline: {
      background: "transparent",
      color: "var(--foreground)",
      borderColor: "var(--border)",
    },
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      disabled={disabled}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
