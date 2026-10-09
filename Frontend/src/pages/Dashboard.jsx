import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, AlertTriangle, TrendingUp, Calendar, Bell, Plus, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import TopBar from "../components/layout/TopBar";
import KPICard from "../components/ui/KPICard";
import StatusBadge from "../components/ui/StatusBadge";
import { mockFaturamentoSemanal, mockVendas, mockContasPagar, mockProdutos, mockAvisos, formatCurrency } from "../data/mock";
export default function Dashboard() {
    const navigate = useNavigate();
    const vendasHoje = mockVendas.filter((v) => v.data === "18/08/2026" && v.status === "Concluída");
    const totalHoje = vendasHoje.reduce((s, v) => s + v.total, 0);
    const estoqueBaixo = mockProdutos.filter((p) => p.estoque <= p.estoqueMinimo);
    const contasProximas = mockContasPagar.filter((c) => c.status === "Pendente" || c.status === "Vencido").slice(0, 4);
    const avisosAtivos = mockAvisos.filter((a) => a.status === "Publicado").slice(0, 2);
    return (<div className="flex flex-col h-full">
      <TopBar title="Dashboard"/>
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPIs */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <KPICard label="Vendas Hoje" value={formatCurrency(totalHoje)} delta={`${vendasHoje.length} transações`} deltaType="positive" icon={<ShoppingCart size={18}/>}/>
          <KPICard label="Faturamento Mensal" value="R$ 44.600,00" delta="+5,4% vs. mês anterior" deltaType="positive" icon={<TrendingUp size={18}/>}/>
          <KPICard label="Saldo do Caixa" value="R$ 1.248,50" delta="Caixa aberto — 08:20" deltaType="neutral" icon={<CreditCard size={18}/>}/>
          <KPICard label="Estoque Crítico" value={String(estoqueBaixo.length)} delta="itens abaixo do mínimo" deltaType={estoqueBaixo.length > 0 ? "negative" : "positive"} icon={<AlertTriangle size={18}/>} iconBg="#FEF3C7" iconColor="#D97706"/>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 380px" }}>
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Gráfico faturamento */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Faturamento — últimos 7 dias</h3>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={mockFaturamentoSemanal} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
                  <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}/>
                  <Tooltip formatter={(v) => [formatCurrency(v), "Faturamento"]} labelStyle={{ color: "#1A202C" }} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}/>
                  <Bar dataKey="valor" fill="#2563EB" radius={[4, 4, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Últimas vendas */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Últimas Vendas</h3>
                <button onClick={() => navigate("/pdv")} className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--primary)" }}>
                  Ver todas <ArrowRight size={12}/>
                </button>
              </div>
              <div className="flex flex-col gap-0">
                {mockVendas.slice(0, 5).map((v, i) => (<div key={v.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < 4 ? "1px solid var(--border)" : undefined }}>
                    <div>
                      <p className="text-sm font-medium">{v.numero}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{v.data} {v.hora} · {v.pagamento}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={v.status}/>
                      <p className="text-sm font-semibold">{formatCurrency(v.total)}</p>
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Estoque crítico */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle size={14} style={{ color: "var(--warning)" }}/>
                  Estoque Crítico
                </h3>
                <button onClick={() => navigate("/estoque")} className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                  Ver estoque
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {estoqueBaixo.map((p) => (<div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#FEF3C7" }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "#92400E" }}>{p.nome}</p>
                      <p className="text-xs" style={{ color: "#B45309" }}>
                        Estoque: {p.estoque} / Mín: {p.estoqueMinimo}
                      </p>
                    </div>
                    <button onClick={() => navigate("/pedidos")} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md" style={{ background: "var(--warning)", color: "white" }}>
                      <Plus size={10}/> Pedir
                    </button>
                  </div>))}
              </div>
            </div>

            {/* Próximos vencimentos */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Calendar size={14} style={{ color: "var(--muted-foreground)" }}/>
                  Próximos Vencimentos
                </h3>
                <button onClick={() => navigate("/contas-pagar")} className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                  Ver todos
                </button>
              </div>
              <div className="flex flex-col gap-0">
                {contasProximas.map((c, i) => (<div key={c.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: i < contasProximas.length - 1 ? "1px solid var(--border)" : undefined }}>
                    <div>
                      <p className="text-xs font-medium truncate" style={{ maxWidth: 160 }}>{c.descricao}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{c.vencimento}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={c.status}/>
                      <p className="text-xs font-semibold">{formatCurrency(c.valor)}</p>
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Avisos */}
            <div className="p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Bell size={14}/>
                  Avisos
                </h3>
                <button onClick={() => navigate("/avisos")} className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                  Ver todos
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {avisosAtivos.map((a) => (<div key={a.id} className="p-3 rounded-lg" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                    <p className="text-xs font-semibold mb-0.5">{a.titulo}</p>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--muted-foreground)" }}>{a.corpo}</p>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
