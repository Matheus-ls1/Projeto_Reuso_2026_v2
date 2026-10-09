import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, CreditCard, Package, BarChart3, Truck, ClipboardList, TrendingUp, ArrowDownCircle, ArrowUpCircle, Bell, Users, Shield, ChevronLeft, ChevronRight, LogOut, Settings, Boxes } from "lucide-react";
const navGroups = [
    {
        items: [
            { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
        ],
    },
    {
        label: "OPERAÇÃO",
        items: [
            { label: "Vendas (PDV)", icon: ShoppingCart, to: "/pdv" },
            { label: "Caixa", icon: CreditCard, to: "/caixa" },
        ],
    },
    {
        label: "ESTOQUE E COMPRAS",
        items: [
            { label: "Produtos e Insumos", icon: Package, to: "/produtos" },
            { label: "Estoque", icon: Boxes, to: "/estoque" },
            { label: "Fornecedores", icon: Truck, to: "/fornecedores" },
            { label: "Pedidos de Compra", icon: ClipboardList, to: "/pedidos" },
        ],
    },
    {
        label: "FINANCEIRO",
        items: [
            { label: "Visão Financeira", icon: TrendingUp, to: "/financeiro" },
            { label: "Contas a Pagar", icon: ArrowDownCircle, to: "/contas-pagar" },
            { label: "Contas a Receber", icon: ArrowUpCircle, to: "/contas-receber" },
        ],
    },
    {
        label: "GESTÃO",
        items: [
            { label: "Avisos", icon: Bell, to: "/avisos" },
            { label: "Relatórios", icon: BarChart3, to: "/relatorios" },
        ],
    },
    {
        label: "ADMINISTRAÇÃO",
        items: [
            { label: "Usuários", icon: Users, to: "/usuarios" },
            { label: "Permissões e Módulos", icon: Shield, to: "/permissoes" },
        ],
    },
];
export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    return (<aside className="flex flex-col h-full transition-all duration-300 relative" style={{
            width: collapsed ? 64 : 240,
            background: "var(--brand)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
        }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ minHeight: 64 }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: "var(--primary)" }}>
          <span className="text-white font-bold text-sm">A</span>
        </div>
        {!collapsed && (<span className="text-white font-semibold text-sm tracking-wide whitespace-nowrap">
            AMT Solution
          </span>)}
      </div>

      {/* Toggle button */}
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-16 z-10 flex items-center justify-center rounded-full border" style={{
            width: 24, height: 24,
            background: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--muted-foreground)",
            cursor: "pointer",
        }}>
        {collapsed ? <ChevronRight size={12}/> : <ChevronLeft size={12}/>}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {navGroups.map((group, gi) => (<div key={gi} className="mb-2">
            {group.label && !collapsed && (<p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
                {group.label}
              </p>)}
            {group.label && collapsed && <div className="my-2 mx-2" style={{ height: 1, background: "rgba(255,255,255,0.08)" }}/>}
            {group.items.map((item) => (<NavLink key={item.to} to={item.to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white/90"} ${collapsed ? "justify-center" : ""}`} title={collapsed ? item.label : undefined}>
                <item.icon size={18} className="flex-shrink-0"/>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>))}
          </div>))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button className={`flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors ${collapsed ? "justify-center" : ""}`} title={collapsed ? "Configurações" : undefined}>
          <Settings size={18} className="flex-shrink-0"/>
          {!collapsed && <span>Configurações</span>}
        </button>
        <button onClick={() => navigate("/")} className={`flex items-center gap-3 w-full rounded-lg px-2 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white/90 transition-colors ${collapsed ? "justify-center" : ""}`} title={collapsed ? "Sair" : undefined}>
          <LogOut size={18} className="flex-shrink-0"/>
          {!collapsed && <span>Sair</span>}
        </button>
        {!collapsed && (<div className="flex items-center gap-2 px-2 py-2 mt-1">
            <div className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-semibold text-white" style={{ width: 30, height: 30, background: "var(--primary)" }}>
              JA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">João Alves</p>
              <p className="text-xs text-white/40 truncate">Administrador</p>
            </div>
          </div>)}
      </div>
    </aside>);
}
