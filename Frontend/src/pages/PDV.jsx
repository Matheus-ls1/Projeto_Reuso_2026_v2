import { useState } from "react";
import { Search, Plus, Minus, Trash2, ShoppingBag, X } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import StatusBadge from "../components/ui/StatusBadge";
import { mockProdutos, mockVendas, formatCurrency } from "../data/mock";
import { toast } from "../components/ui/Toast";
const categorias = ["Todos", "Bebidas", "Padaria", "Doces", "Salgados"];
export default function PDV() {
    const [busca, setBusca] = useState("");
    const [catAtiva, setCatAtiva] = useState("Todos");
    const [cart, setCart] = useState([]);
    const [desconto, setDesconto] = useState("0");
    const [tabAtiva, setTabAtiva] = useState("pdv");
    const [pagamentoModal, setPagamentoModal] = useState(false);
    const [formaPag, setFormaPag] = useState("PIX");
    const [valorRecebido, setValorRecebido] = useState("");
    const produtos = mockProdutos.filter((p) => {
        const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) || p.sku.toLowerCase().includes(busca.toLowerCase());
        const matchCat = catAtiva === "Todos" || p.categoria === catAtiva;
        return matchBusca && matchCat && p.status === "Ativo";
    });
    const addToCart = (p) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === p.id);
            if (existing)
                return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { id: p.id, nome: p.nome, preco: p.preco, qty: 1 }];
        });
    };
    const updateQty = (id, delta) => {
        setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    };
    const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
    const subtotal = cart.reduce((s, i) => s + i.preco * i.qty, 0);
    const descontoVal = parseFloat(desconto) || 0;
    const total = Math.max(0, subtotal - descontoVal);
    const troco = formaPag === "Dinheiro" ? Math.max(0, (parseFloat(valorRecebido) || 0) - total) : 0;
    const finalizarVenda = () => {
        setCart([]);
        setDesconto("0");
        setValorRecebido("");
        setPagamentoModal(false);
        toast("Venda concluída com sucesso! Estoque atualizado.", "success");
    };
    return (<div className="flex flex-col h-full">
      <TopBar title="PDV / Vendas" breadcrumbs={["Operação"]}/>

      {/* Tabs */}
      <div className="flex gap-0 px-6 pt-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        {["pdv", "historico"].map((t) => (<button key={t} onClick={() => setTabAtiva(t)} className="px-5 py-2.5 text-sm font-medium transition-colors border-b-2" style={{
                borderColor: tabAtiva === t ? "var(--primary)" : "transparent",
                color: tabAtiva === t ? "var(--primary)" : "var(--muted-foreground)",
                background: "transparent",
                marginBottom: -1,
            }}>
            {t === "pdv" ? "Nova Venda" : "Histórico do Dia"}
          </button>))}
      </div>

      {tabAtiva === "pdv" ? (<div className="flex flex-1 overflow-hidden">
          {/* Produtos */}
          <div className="flex flex-col flex-1 p-4 overflow-hidden">
            {/* Busca */}
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
              <Search size={15} style={{ color: "var(--muted-foreground)" }}/>
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto por nome ou SKU..." className="bg-transparent text-sm outline-none flex-1" style={{ color: "var(--foreground)" }}/>
              {busca && <button onClick={() => setBusca("")}><X size={13} style={{ color: "var(--muted-foreground)" }}/></button>}
            </div>

            {/* Categorias */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {categorias.map((c) => (<button key={c} onClick={() => setCatAtiva(c)} className="px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors" style={catAtiva === c
                    ? { background: "var(--primary)", color: "white" }
                    : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                  {c}
                </button>))}
            </div>

            {/* Grid de produtos */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
                {produtos.map((p) => {
                const critico = p.estoque <= p.estoqueMinimo;
                return (<button key={p.id} onClick={() => addToCart(p)} className="flex flex-col items-start p-4 rounded-xl text-left transition-all hover:shadow-md" style={{
                        background: "var(--card)",
                        border: `1px solid ${critico ? "#FCD34D" : "var(--border)"}`,
                    }}>
                      <div className="w-full h-10 rounded-lg mb-3 flex items-center justify-center" style={{ background: "var(--secondary)" }}>
                        <ShoppingBag size={18} style={{ color: "var(--primary)" }}/>
                      </div>
                      <p className="text-xs font-semibold leading-tight mb-1" style={{ color: "var(--foreground)" }}>{p.nome}</p>
                      <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>{p.categoria}</p>
                      <p className="text-sm font-bold" style={{ color: "var(--primary)" }}>{formatCurrency(p.preco)}</p>
                      {critico && <span className="text-xs mt-1" style={{ color: "var(--warning)" }}>Estoque baixo</span>}
                    </button>);
            })}
              </div>
            </div>
          </div>

          {/* Carrinho */}
          <div className="flex flex-col" style={{
                width: 320,
                borderLeft: "1px solid var(--border)",
                background: "var(--card)",
                flexShrink: 0,
            }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold">Carrinho</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{cart.length} {cart.length === 1 ? "item" : "itens"}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
              {cart.length === 0 ? (<div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: "var(--muted-foreground)" }}>
                  <ShoppingBag size={32} style={{ opacity: 0.3 }}/>
                  <p className="text-sm">Nenhum item adicionado</p>
                </div>) : (cart.map((item) => (<div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "var(--muted)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.nome}</p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{formatCurrency(item.preco)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="flex items-center justify-center rounded-md" style={{ width: 22, height: 22, background: "var(--border)" }}>
                        <Minus size={10}/>
                      </button>
                      <span className="text-xs font-semibold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="flex items-center justify-center rounded-md" style={{ width: 22, height: 22, background: "var(--primary)", color: "white" }}>
                        <Plus size={10}/>
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ color: "var(--muted-foreground)" }}>
                      <Trash2 size={14}/>
                    </button>
                  </div>)))}
            </div>

            {cart.length > 0 && (<div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--muted-foreground)" }}>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--muted-foreground)" }}>Desconto (R$)</span>
                    <input type="number" min="0" value={desconto} onChange={(e) => setDesconto(e.target.value)} className="w-20 text-right px-2 py-0.5 text-sm rounded-md outline-none" style={{ border: "1px solid var(--border)", color: "var(--foreground)", background: "var(--background)" }}/>
                  </div>
                  <div className="flex justify-between font-semibold pt-1.5" style={{ borderTop: "1px solid var(--border)" }}>
                    <span>Total</span>
                    <span style={{ color: "var(--primary)", fontSize: 16 }}>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Button variant="primary" size="md" className="w-full" onClick={() => setPagamentoModal(true)}>
                  Finalizar Venda
                </Button>
              </div>)}
          </div>
        </div>) : (<div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold mb-4">Vendas de 18/08/2026</h3>
          <div className="w-full overflow-x-auto" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Número", "Hora", "Operador", "Itens", "Pagamento", "Total", "Status"].map((h) => (<th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {mockVendas.map((v, i) => (<tr key={v.id} style={{ borderBottom: i < mockVendas.length - 1 ? "1px solid var(--border)" : undefined }}>
                    <td className="px-4 py-3 text-sm font-mono font-medium">{v.numero}</td>
                    <td className="px-4 py-3 text-sm">{v.hora}</td>
                    <td className="px-4 py-3 text-sm">{v.operador}</td>
                    <td className="px-4 py-3 text-sm">{v.itens}</td>
                    <td className="px-4 py-3 text-sm">{v.pagamento}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(v.total)}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status}/></td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Modal de pagamento */}
      <Modal open={pagamentoModal} onClose={() => setPagamentoModal(false)} title="Finalizar Venda" size="sm" footer={<>
            <Button variant="ghost" onClick={() => setPagamentoModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={finalizarVenda}>Confirmar Venda</Button>
          </>}>
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl text-center" style={{ background: "var(--secondary)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Total a pagar</p>
            <p className="text-3xl font-bold" style={{ color: "var(--primary)" }}>{formatCurrency(total)}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Forma de pagamento</p>
            <div className="grid grid-cols-3 gap-2">
              {["PIX", "Cartão", "Dinheiro"].map((f) => (<button key={f} onClick={() => setFormaPag(f)} className="py-2.5 text-sm font-medium rounded-lg transition-all" style={formaPag === f
                ? { background: "var(--primary)", color: "white" }
                : { background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                  {f}
                </button>))}
            </div>
          </div>
          {formaPag === "Dinheiro" && (<>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Valor recebido</label>
                <input type="number" value={valorRecebido} onChange={(e) => setValorRecebido(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg outline-none" style={{ border: "1px solid var(--border)", background: "var(--background)" }} placeholder="R$ 0,00"/>
              </div>
              {troco > 0 && (<div className="flex justify-between text-sm font-semibold p-3 rounded-lg" style={{ background: "#DCFCE7" }}>
                  <span style={{ color: "#166534" }}>Troco</span>
                  <span style={{ color: "#166534" }}>{formatCurrency(troco)}</span>
                </div>)}
            </>)}
        </div>
      </Modal>
    </div>);
}
