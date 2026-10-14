import {
  TrendingUp,
  DollarSign,
  ArrowDownCircle,
  ArrowUpCircle,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TopBar from "../components/layout/TopBar";
import KPICard from "../components/ui/KPICard";
import StatusBadge from "../components/ui/StatusBadge";
import {
  mockFluxoCaixa,
  mockReceitasDespesas,
  mockDespesasCat,
  mockContasPagar,
  mockContasReceber,
  formatCurrency,
} from "../data/mock";
const COLORS = [
  "#2563EB",
  "#7C3AED",
  "#EA580C",
  "#16A34A",
  "#0891B2",
  "#9CA3AF",
];
export default function DashboardFinanceiro() {
  const totalReceitas = 44600;
  const totalDespesas = 29800;
  const saldo = totalReceitas - totalDespesas;
  const contasPagarProximas = mockContasPagar
    .filter((c) => c.status === "Pendente" || c.status === "Vencido")
    .slice(0, 4);
  const contasReceberProximas = mockContasReceber
    .filter((c) => c.status === "Pendente" || c.status === "Vencido")
    .slice(0, 4);
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Visão Financeira" breadcrumbs={["Financeiro"]} />
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPIs */}
        <div
          className="grid gap-4 mb-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <KPICard
            label="Saldo Atual"
            value={formatCurrency(saldo)}
            delta="+12,3% vs. mês anterior"
            deltaType="positive"
            icon={<DollarSign size={18} />}
            iconBg="#DCFCE7"
            iconColor="var(--success)"
          />
          <KPICard
            label="Faturamento Mensal"
            value={formatCurrency(totalReceitas)}
            delta="Agosto 2026"
            deltaType="positive"
            icon={<TrendingUp size={18} />}
          />
          <KPICard
            label="Total Receitas"
            value={formatCurrency(totalReceitas)}
            deltaType="positive"
            delta="mês atual"
            icon={<ArrowUpCircle size={18} />}
            iconBg="#DBEAFE"
            iconColor="var(--primary)"
          />
          <KPICard
            label="Total Despesas"
            value={formatCurrency(totalDespesas)}
            deltaType="negative"
            delta="mês atual"
            icon={<ArrowDownCircle size={18} />}
            iconBg="#FEE2E2"
            iconColor="var(--destructive)"
          />
          <KPICard
            label="Resultado"
            value={formatCurrency(saldo)}
            delta="Positivo"
            deltaType="positive"
            icon={<Activity size={18} />}
            iconBg="#EDE9FE"
            iconColor="var(--accent)"
          />
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {/* Fluxo de caixa */}
          <div
            className="p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <h3 className="text-sm font-semibold mb-4">
              Fluxo de Caixa — Agosto 2026
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockFluxoCaixa.slice(0, 18)}>
                <defs>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="despGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="dia"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  formatter={(v, n) => [
                    formatCurrency(v),
                    n === "receitas" ? "Receitas" : "Despesas",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receitas"
                  stroke="#2563EB"
                  fill="url(#recGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="despesas"
                  stroke="#DC2626"
                  fill="url(#despGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Receitas vs Despesas */}
          <div
            className="p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <h3 className="text-sm font-semibold mb-4">
              Receitas vs Despesas — 12 meses
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockReceitasDespesas.slice(-8)} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#6B7280" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v, n) => [
                    formatCurrency(v),
                    n === "receitas" ? "Receitas" : "Despesas",
                  ]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Bar
                  dataKey="receitas"
                  name="Receitas"
                  fill="#2563EB"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="despesas"
                  name="Despesas"
                  fill="#DC2626"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Despesas por categoria */}
          <div
            className="p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <h3 className="text-sm font-semibold mb-4">
              Despesas por Categoria
            </h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie
                    data={mockDespesasCat}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockDespesasCat.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(v)}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 flex flex-col gap-1.5">
                {mockDespesasCat.map((d, i) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span style={{ color: "var(--muted-foreground)" }}>
                        {d.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(d.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contas próximas */}
          <div
            className="p-5"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          >
            <h3 className="text-sm font-semibold mb-4">
              Próximas Movimentações
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <p
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  A Pagar
                </p>
                {contasPagarProximas.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2 text-sm"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div>
                      <p
                        className="text-xs font-medium truncate"
                        style={{ maxWidth: 140 }}
                      >
                        {c.descricao}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {c.vencimento}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} />
                      <p className="text-xs font-semibold">
                        {formatCurrency(c.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  A Receber
                </p>
                {contasReceberProximas.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2 text-sm"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <div>
                      <p
                        className="text-xs font-medium truncate"
                        style={{ maxWidth: 140 }}
                      >
                        {c.descricao}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {c.vencimento}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status} />
                      <p className="text-xs font-semibold">
                        {formatCurrency(c.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
