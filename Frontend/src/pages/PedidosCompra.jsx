import { useState } from "react";
import { Plus, PackageCheck } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import { mockPedidos, mockFornecedores, mockProdutos, formatCurrency } from "../data/mock";
import { toast } from "../components/ui/Toast";
export default function PedidosCompra() {
    const [busca, setBusca] = useState("");
    const [drawer, setDrawer] = useState(false);
    const [recebimentoModal, setRecebimentoModal] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [recItems, setRecItems] = useState([]);
    const [dataRecebimento, setDataRecebimento] = useState("19/08/2026");
    const [responsavel, setResponsavel] = useState("Roberto Silva");
    const [observacao, setObservacao] = useState("");
    const dados = mockPedidos.filter((p) => p.numero.toLowerCase().includes(busca.toLowerCase()) || p.fornecedor.toLowerCase().includes(busca.toLowerCase()));
    const cols = [
        { key: "numero", header: "Número", render: (r) => <span className="font-mono text-xs font-medium">{r.numero}</span> },
        { key: "fornecedor", header: "Fornecedor" },
        { key: "data", header: "Data" },
        { key: "previsao", header: "Previsão" },
        { key: "valorTotal", header: "Valor Total", render: (r) => <span className="font-medium">{formatCurrency(r.valorTotal)}</span> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        { key: "acoes", header: "Ações", render: (r) => (<div className="flex items-center gap-1">
        {(r.status === "Em Trânsito" || r.status === "Parcialmente Recebido" || r.status === "Enviado") && (<Button size="sm" variant="secondary" icon={<PackageCheck size={13}/>} onClick={(e) => { e.stopPropagation(); abrirRecebimento(r); }}>
            Receber
          </Button>)}
      </div>) },
    ];
    const abrirRecebimento = (pedido) => {
        setPedidoSelecionado(pedido);
        setRecItems(pedido.itens.map((item) => ({
            produto: item.produto,
            qtdPedida: item.qtdPedida,
            qtdRecebida: item.qtdRecebida > 0 ? item.qtdPedida - item.qtdRecebida : 0,
            lote: item.lote,
            validade: item.validade,
        })));
        setRecebimentoModal(true);
    };
    const confirmarRecebimento = () => {
        setRecebimentoModal(false);
        const totalPedido = pedidoSelecionado?.itens.reduce((s, i) => s + i.qtdPedida, 0) || 0;
        const totalRecebido = recItems.reduce((s, i) => s + i.qtdRecebida, 0);
        const parcial = totalRecebido < totalPedido;
        toast(parcial
            ? "Recebimento parcial registrado. Pedido continua em aberto."
            : "Recebimento concluído. Estoque atualizado.", "success");
    };
    return (<div className="flex flex-col h-full">
      <TopBar title="Pedidos de Compra" breadcrumbs={["Estoque e Compras"]}/>
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader title="Pedidos de Compra" subtitle="Gerencie pedidos aos fornecedores" actions={<Button variant="primary" icon={<Plus size={15}/>} onClick={() => setDrawer(true)}>
              Novo Pedido
            </Button>}/>
        <FilterBar search={busca} onSearchChange={setBusca} placeholder="Buscar por número ou fornecedor..."/>
        <DataTable columns={cols} data={dados} emptyMessage="Nenhum pedido encontrado."/>
      </div>

      {/* Drawer novo pedido */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Novo Pedido de Compra" width={540} footer={<>
            <Button variant="ghost" onClick={() => setDrawer(false)}>Cancelar</Button>
            <Button variant="primary" onClick={() => { setDrawer(false); toast("Pedido criado com sucesso.", "success"); }}>Criar Pedido</Button>
          </>}>
        <div className="flex flex-col gap-4">
          <Select label="Fornecedor" placeholder="Selecionar fornecedor..." options={mockFornecedores.filter((f) => f.status === "Ativo").map((f) => ({ value: f.id, label: f.nome }))}/>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data do Pedido" placeholder="DD/MM/AAAA"/>
            <Input label="Previsão de Recebimento" placeholder="DD/MM/AAAA"/>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Itens do Pedido</p>
            <div className="p-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Select label="Produto / Insumo" placeholder="Selecionar..." options={mockProdutos.map((p) => ({ value: p.id, label: p.nome }))}/>
                  </div>
                  <Input label="Qtd" placeholder="0"/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Preço Unitário (R$)" placeholder="0,00"/>
                  <Input label="Total" placeholder="R$ 0,00"/>
                </div>
              </div>
              <button className="mt-3 text-xs font-medium" style={{ color: "var(--primary)" }}>
                + Adicionar outro item
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Observações</label>
            <textarea className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none" rows={3} placeholder="Observações para o fornecedor..." style={{ border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)" }}/>
          </div>
        </div>
      </Drawer>

      {/* Modal de recebimento */}
      <Modal open={recebimentoModal} onClose={() => setRecebimentoModal(false)} title={`Registrar Recebimento — ${pedidoSelecionado?.numero}`} size="lg" footer={<>
            <Button variant="ghost" onClick={() => setRecebimentoModal(false)}>Cancelar</Button>
            <Button variant="primary" icon={<PackageCheck size={15}/>} onClick={confirmarRecebimento}>Confirmar Recebimento</Button>
          </>}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data de Recebimento" value={dataRecebimento} onChange={(e) => setDataRecebimento(e.target.value)}/>
            <Input label="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)}/>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Itens do Pedido</p>
            <div className="flex flex-col gap-3">
              {recItems.map((item, idx) => (<div key={idx} className="p-4 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                  <p className="text-sm font-semibold mb-3">{item.produto}</p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>Qtd Pedida</label>
                      <p className="text-sm font-semibold mt-0.5">{item.qtdPedida}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Qtd Recebida</label>
                      <input type="number" min={0} max={item.qtdPedida} value={item.qtdRecebida} onChange={(e) => {
                const copy = [...recItems];
                copy[idx] = { ...copy[idx], qtdRecebida: Number(e.target.value) };
                setRecItems(copy);
            }} className="w-full px-3 py-1.5 text-sm rounded-lg outline-none mt-0.5" style={{ border: "1px solid var(--border)", background: "var(--card)" }}/>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Lote" placeholder="L2026-08" value={item.lote} onChange={(e) => {
                const copy = [...recItems];
                copy[idx] = { ...copy[idx], lote: e.target.value };
                setRecItems(copy);
            }}/>
                    <Input label="Validade (opcional)" placeholder="DD/MM/AAAA" value={item.validade} onChange={(e) => {
                const copy = [...recItems];
                copy[idx] = { ...copy[idx], validade: e.target.value };
                setRecItems(copy);
            }}/>
                  </div>
                  {item.qtdRecebida < item.qtdPedida && item.qtdRecebida > 0 && (<p className="text-xs mt-2 font-medium" style={{ color: "var(--warning)" }}>
                      Recebimento parcial: {item.qtdPedida - item.qtdRecebida} unidade(s) pendente(s)
                    </p>)}
                </div>))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Observação</label>
            <textarea className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none" rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Observações sobre o recebimento..." style={{ border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}/>
          </div>
        </div>
      </Modal>
    </div>);
}
