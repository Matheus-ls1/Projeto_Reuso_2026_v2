import { useState } from "react";
import { Plus, AlertTriangle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import { mockProdutos, mockMovEstoque } from "../data/mock";
import { toast } from "../components/ui/Toast";
export default function Estoque() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("posicao");
    const [busca, setBusca] = useState("");
    const [drawerMov, setDrawerMov] = useState(false);
    const [movForm, setMovForm] = useState({ tipo: "Entrada", produto: "", quantidade: "", lote: "", motivo: "" });
    const posicao = mockProdutos.map((p) => ({
        ...p,
        unidade: p.unidade,
        status: p.estoque === 0 ? "Crítico" : p.estoque <= p.estoqueMinimo ? "Baixo" : "OK",
    }));
    const posicaoFiltrada = posicao.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
    const alertas = posicao.filter((p) => p.status !== "OK");
    const colsPosicao = [
        { key: "nome", header: "Produto" },
        { key: "estoque", header: "Saldo Atual", render: (r) => <span className="font-medium">{r.estoque} {r.unidade}</span> },
        { key: "estoqueMinimo", header: "Est. Mínimo", render: (r) => <span>{r.estoqueMinimo} {r.unidade}</span> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
    ];
    const colsMovs = [
        { key: "data", header: "Data/Hora", render: (r) => <span className="font-mono text-xs">{r.data} {r.hora}</span> },
        { key: "produto", header: "Produto" },
        { key: "tipo", header: "Tipo", render: (r) => (<span className="text-xs font-medium" style={{ color: r.tipo === "Entrada" ? "var(--success)" : r.tipo === "Saída" ? "var(--destructive)" : "var(--warning)" }}>
        {r.tipo}
      </span>) },
        { key: "quantidade", header: "Qtd", render: (r) => <span className="font-medium">{r.quantidade > 0 ? "+" : ""}{r.quantidade}</span> },
        { key: "lote", header: "Lote", render: (r) => <span className="font-mono text-xs">{r.lote || "—"}</span> },
        { key: "responsavel", header: "Responsável" },
        { key: "motivo", header: "Motivo" },
    ];
    const registrarMov = () => {
        setDrawerMov(false);
        toast("Movimentação registrada com sucesso.", "success");
    };
    return (<div className="flex flex-col h-full">
      <TopBar title="Estoque" breadcrumbs={["Estoque e Compras"]}/>
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader title="Controle de Estoque" subtitle="Posição atual, movimentações e alertas de estoque baixo" actions={<Button variant="primary" icon={<Plus size={15}/>} onClick={() => setDrawerMov(true)}>
              Registrar Movimentação
            </Button>}/>

        <Tabs tabs={[
            { key: "posicao", label: "Posição Atual" },
            { key: "movimentacoes", label: "Movimentações" },
            { key: "alertas", label: `Alertas (${alertas.length})` },
        ]} active={tab} onChange={setTab}/>

        {tab === "posicao" && (<>
            <FilterBar search={busca} onSearchChange={setBusca} placeholder="Buscar produto..."/>
            <DataTable columns={colsPosicao} data={posicaoFiltrada} emptyMessage="Nenhum produto encontrado."/>
          </>)}

        {tab === "movimentacoes" && (<>
            <FilterBar search={busca} onSearchChange={setBusca} placeholder="Buscar produto ou responsável..."/>
            <DataTable columns={colsMovs} data={mockMovEstoque} emptyMessage="Nenhuma movimentação."/>
          </>)}

        {tab === "alertas" && (<div className="flex flex-col gap-3">
            {alertas.length === 0 ? (<div className="text-center py-12" style={{ color: "var(--muted-foreground)" }}>
                <p className="text-sm">Nenhum alerta de estoque no momento.</p>
              </div>) : alertas.map((p) => (<div key={p.id} className="flex items-center justify-between p-4 rounded-xl" style={{
                    background: p.status === "Crítico" ? "#FEF2F2" : "#FFFBEB",
                    border: `1px solid ${p.status === "Crítico" ? "#FECACA" : "#FDE68A"}`,
                }}>
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} style={{ color: p.status === "Crítico" ? "var(--destructive)" : "var(--warning)", flexShrink: 0 }}/>
                  <div>
                    <p className="text-sm font-semibold">{p.nome}</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Estoque atual: {p.estoque} {p.unidade} &nbsp;|&nbsp; Mínimo: {p.estoqueMinimo} {p.unidade}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<ShoppingCart size={13}/>} onClick={() => navigate("/pedidos")}>
                  Gerar Pedido
                </Button>
              </div>))}
          </div>)}
      </div>

      {/* Drawer de movimentação */}
      <Drawer open={drawerMov} onClose={() => setDrawerMov(false)} title="Registrar Movimentação" footer={<>
            <Button variant="ghost" onClick={() => setDrawerMov(false)}>Cancelar</Button>
            <Button variant="primary" onClick={registrarMov}>Registrar</Button>
          </>}>
        <div className="flex flex-col gap-4">
          <Select label="Tipo de Movimentação" value={movForm.tipo} onChange={(e) => setMovForm({ ...movForm, tipo: e.target.value })} options={[{ value: "Entrada", label: "Entrada" }, { value: "Saída", label: "Saída" }, { value: "Ajuste", label: "Ajuste" }]}/>
          <Select label="Produto / Insumo" value={movForm.produto} onChange={(e) => setMovForm({ ...movForm, produto: e.target.value })} placeholder="Selecionar..." options={mockProdutos.map((p) => ({ value: p.id, label: p.nome }))}/>
          <Input label="Quantidade" placeholder="0" value={movForm.quantidade} onChange={(e) => setMovForm({ ...movForm, quantidade: e.target.value })}/>
          <Input label="Lote (opcional)" placeholder="L2026-08" value={movForm.lote} onChange={(e) => setMovForm({ ...movForm, lote: e.target.value })}/>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Motivo / Observação</label>
            <textarea className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none" rows={3} placeholder="Descreva o motivo da movimentação..." style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }} value={movForm.motivo} onChange={(e) => setMovForm({ ...movForm, motivo: e.target.value })}/>
          </div>
        </div>
      </Drawer>
    </div>);
}
