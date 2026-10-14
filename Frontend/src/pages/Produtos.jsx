import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  ToggleLeft,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../data/mock";
import { toast } from "../components/ui/Toast";
import { produtosService } from "../services/produtosService";
// Mantém produtos e insumos na mesma tela, diferenciados pelo tipo persistido na API.
export default function Produtos() {
  const [tab, setTab] = useState("produtos");
  const [busca, setBusca] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDesativar, setConfirmDesativar] = useState(false);
  const [confirmExcluir, setConfirmExcluir] = useState(false);
  const [alergOpen, setAlergOpen] = useState(false);
  const [itemParaDesativar, setItemParaDesativar] = useState("");
  const [itemParaDesativarId, setItemParaDesativarId] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [produtoForm, setProdutoForm] = useState({
    sku: "",
    nome: "",
    categoria: "",
    preco: "",
    unidade: "UN",
    estoque: "",
    estoqueMinimo: "",
    alergenos: "",
  });
  const [insumoForm, setInsumoForm] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    unidade: "kg",
    quantidade: "",
    estoqueMinimo: "",
    fornecedor: "",
    lote: "",
    validade: "",
  });
  const [itens, setItens] = useState([]);
  const carregar = async () => {
    try {
      // Recarrega a lista após cada operação para refletir a fonte de dados do backend.
      setItens(await produtosService.listar());
    } catch (error) {
      toast(error.message, "error");
    }
  };
  useEffect(() => {
    carregar();
  }, []);
  const produtosFiltrados = itens.filter(
    (p) =>
      p.tipo === "PRODUTO" &&
      (p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.sku.toLowerCase().includes(busca.toLowerCase())),
  );
  const insumosFiltrados = itens.filter(
    (i) =>
      i.tipo === "INSUMO" &&
      (i.nome.toLowerCase().includes(busca.toLowerCase()) ||
        i.codigo.toLowerCase().includes(busca.toLowerCase())),
  );
  const colsProdutos = [
    {
      key: "sku",
      header: "SKU",
      width: "100px",
      render: (r) => <span className="font-mono text-xs">{r.sku}</span>,
    },
    { key: "nome", header: "Nome" },
    {
      key: "categoria",
      header: "Categoria",
      render: (r) => <Badge color="brand">{r.categoria}</Badge>,
    },
    {
      key: "preco",
      header: "Preço",
      render: (r) => (
        <span className="font-medium">{formatCurrency(r.preco)}</span>
      ),
    },
    { key: "unidade", header: "Und." },
    {
      key: "estoque",
      header: "Estoque",
      render: (r) => (
        <span
          className="font-medium"
          style={{
            color:
              r.estoque <= r.estoqueMinimo
                ? "var(--destructive)"
                : "var(--foreground)",
          }}
        >
          {r.estoque}
        </span>
      ),
    },
    { key: "estoqueMinimo", header: "Est. Mín." },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            className="flex items-center justify-center rounded-lg p-1.5 transition-colors hover:bg-muted"
            style={{ color: "var(--muted-foreground)" }}
            onClick={(e) => {
              e.stopPropagation();
              abrirEdicao(r);
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--muted-foreground)" }}
            onClick={(e) => {
              e.stopPropagation();
              setItemParaDesativar(r.nome);
              setItemParaDesativarId(r.id);
              setConfirmDesativar(true);
            }}
            title={r.status === "Ativo" ? "Desativar" : "Ativar"}
          >
            <ToggleLeft size={13} />
          </button>
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--destructive)" }}
            onClick={(e) => {
              e.stopPropagation();
              setItemParaDesativar(r.nome);
              setItemParaDesativarId(r.id);
              setConfirmExcluir(true);
            }}
            title="Excluir permanentemente"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];
  const colsInsumos = [
    {
      key: "codigo",
      header: "Código",
      width: "100px",
      render: (r) => <span className="font-mono text-xs">{r.codigo}</span>,
    },
    { key: "nome", header: "Nome" },
    {
      key: "categoria",
      header: "Categoria",
      render: (r) => <Badge color="brand">{r.categoria}</Badge>,
    },
    { key: "unidade", header: "Und." },
    {
      key: "quantidade",
      header: "Qtd Estoque",
      render: (r) => (
        <span
          className="font-medium"
          style={{
            color:
              r.quantidade <= r.estoqueMinimo
                ? "var(--destructive)"
                : "var(--foreground)",
          }}
        >
          {r.quantidade} {r.unidade}
        </span>
      ),
    },
    { key: "estoqueMinimo", header: "Est. Mín." },
    {
      key: "fornecedor",
      header: "Fornecedor",
      render: (r) => <span className="text-xs">{r.fornecedor}</span>,
    },
    { key: "validade", header: "Validade" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--muted-foreground)" }}
            onClick={(e) => {
              e.stopPropagation();
              abrirEdicao(r);
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--muted-foreground)" }}
            onClick={(e) => {
              e.stopPropagation();
              setItemParaDesativar(r.nome);
              setItemParaDesativarId(r.id);
              setConfirmDesativar(true);
            }}
            title={r.status === "Ativo" ? "Desativar" : "Ativar"}
          >
            <ToggleLeft size={13} />
          </button>
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--destructive)" }}
            onClick={(e) => {
              e.stopPropagation();
              setItemParaDesativar(r.nome);
              setItemParaDesativarId(r.id);
              setConfirmExcluir(true);
            }}
            title="Excluir permanentemente"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];
  const openNewDrawer = () => {
    setEditItem(null);
    setProdutoForm({
      sku: "",
      nome: "",
      categoria: "",
      preco: "",
      unidade: "UN",
      estoque: "",
      estoqueMinimo: "",
      alergenos: "",
    });
    setInsumoForm({
      codigo: "",
      nome: "",
      categoria: "",
      unidade: "kg",
      quantidade: "",
      estoqueMinimo: "",
      fornecedor: "",
      lote: "",
      validade: "",
    });
    setDrawer(true);
  };
  const abrirEdicao = (item) => {
    setEditItem(item);
    if (item.tipo === "PRODUTO") {
      setTab("produtos");
      setProdutoForm({
        sku: item.sku,
        nome: item.nome,
        categoria: item.categoria,
        preco: String(item.preco ?? ""),
        unidade: item.unidade,
        estoque: String(item.estoque ?? ""),
        estoqueMinimo: String(item.estoqueMinimo ?? ""),
        alergenos: item.alergenos || "",
      });
    } else {
      setTab("insumos");
      setInsumoForm({
        codigo: item.codigo,
        nome: item.nome,
        categoria: item.categoria,
        unidade: item.unidade,
        quantidade: String(item.quantidade ?? ""),
        estoqueMinimo: String(item.estoqueMinimo ?? ""),
        fornecedor: item.fornecedor || "",
        fornecedorId: item.fornecedorId || "",
        lote: item.lote || "",
        validade: item.validade || "",
      });
    }
    setDrawer(true);
  };
  const salvar = async () => {
    const atual = tab === "produtos" ? produtoForm : insumoForm;
    if (!(atual.sku || atual.codigo) || !atual.nome || !atual.categoria)
      return toast("Preencha os campos obrigatórios.", "error");
    try {
      setSalvando(true);
      if (editItem)
        await produtosService.atualizar(
          editItem.id,
          atual,
          tab === "produtos" ? "PRODUTO" : "INSUMO",
        );
      else
        await produtosService.criar(
          atual,
          tab === "produtos" ? "PRODUTO" : "INSUMO",
        );
      await carregar();
      setDrawer(false);
      toast(
        `${tab === "produtos" ? "Produto" : "Insumo"} salvo com sucesso.`,
        "success",
      );
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSalvando(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Produtos e Insumos" breadcrumbs={["Estoque e Compras"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Produtos e Insumos"
          subtitle="Gerencie produtos para venda e insumos de produção"
          actions={
            <Button
              variant="primary"
              icon={<Plus size={15} />}
              onClick={openNewDrawer}
            >
              {tab === "produtos" ? "Novo Produto" : "Novo Insumo"}
            </Button>
          }
        />

        <Tabs
          tabs={[
            { key: "produtos", label: "Produtos" },
            { key: "insumos", label: "Insumos" },
          ]}
          active={tab}
          onChange={setTab}
        />

        <FilterBar
          search={busca}
          onSearchChange={setBusca}
          placeholder={
            tab === "produtos"
              ? "Buscar por nome ou SKU..."
              : "Buscar por nome ou código..."
          }
        />

        {tab === "produtos" ? (
          <DataTable
            columns={colsProdutos}
            data={produtosFiltrados}
            emptyMessage="Nenhum produto encontrado."
          />
        ) : (
          <DataTable
            columns={colsInsumos}
            data={insumosFiltrados}
            emptyMessage="Nenhum insumo encontrado."
          />
        )}
      </div>

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={
          editItem
            ? tab === "produtos"
              ? "Editar Produto"
              : "Editar Insumo"
            : tab === "produtos"
              ? "Novo Produto"
              : "Novo Insumo"
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawer(false)}>
              Cancelar
            </Button>
            <Button variant="primary" disabled={salvando} onClick={salvar}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </>
        }
      >
        {tab === "produtos" ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="SKU / Código"
                placeholder="CAF-001"
                value={produtoForm.sku}
                onChange={(e) =>
                  setProdutoForm({ ...produtoForm, sku: e.target.value })
                }
              />
              <Select
                label="Unidade"
                value={produtoForm.unidade}
                onChange={(e) =>
                  setProdutoForm({ ...produtoForm, unidade: e.target.value })
                }
                options={[
                  { value: "UN", label: "UN" },
                  { value: "kg", label: "kg" },
                  { value: "L", label: "L" },
                  { value: "g", label: "g" },
                ]}
              />
            </div>
            <Input
              label="Nome do Produto"
              placeholder="Ex: Cappuccino 300ml"
              value={produtoForm.nome}
              onChange={(e) =>
                setProdutoForm({ ...produtoForm, nome: e.target.value })
              }
            />
            <Select
              label="Categoria"
              value={produtoForm.categoria}
              onChange={(e) =>
                setProdutoForm({ ...produtoForm, categoria: e.target.value })
              }
              placeholder="Selecionar..."
              options={[
                { value: "Bebidas", label: "Bebidas" },
                { value: "Padaria", label: "Padaria" },
                { value: "Doces", label: "Doces" },
                { value: "Salgados", label: "Salgados" },
              ]}
            />
            <Input
              label="Preço de Venda (R$)"
              placeholder="0,00"
              value={produtoForm.preco}
              onChange={(e) =>
                setProdutoForm({ ...produtoForm, preco: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Estoque Atual"
                placeholder="0"
                value={produtoForm.estoque}
                onChange={(e) =>
                  setProdutoForm({ ...produtoForm, estoque: e.target.value })
                }
              />
              <Input
                label="Estoque Mínimo"
                placeholder="0"
                value={produtoForm.estoqueMinimo}
                onChange={(e) =>
                  setProdutoForm({
                    ...produtoForm,
                    estoqueMinimo: e.target.value,
                  })
                }
              />
            </div>

            {/* Alergênicos accordion */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border)" }}
            >
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
                onClick={() => setAlergOpen(!alergOpen)}
                style={{ background: "var(--muted)" }}
              >
                <span>Ingredientes e Alergênicos (opcional)</span>
                {alergOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              {alergOpen && (
                <div className="px-4 py-3">
                  <Input
                    label="Alergênicos"
                    placeholder="Ex: Leite, Glúten, Ovo"
                    value={produtoForm.alergenos}
                    onChange={(e) =>
                      setProdutoForm({
                        ...produtoForm,
                        alergenos: e.target.value,
                      })
                    }
                  />
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Informe os alergênicos separados por vírgula.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Código"
                placeholder="INS-001"
                value={insumoForm.codigo}
                onChange={(e) =>
                  setInsumoForm({ ...insumoForm, codigo: e.target.value })
                }
              />
              <Select
                label="Unidade de Medida"
                value={insumoForm.unidade}
                onChange={(e) =>
                  setInsumoForm({ ...insumoForm, unidade: e.target.value })
                }
                options={[
                  { value: "kg", label: "kg" },
                  { value: "L", label: "L" },
                  { value: "g", label: "g" },
                  { value: "UN", label: "UN" },
                ]}
              />
            </div>
            <Input
              label="Nome do Insumo"
              placeholder="Ex: Café em Grãos"
              value={insumoForm.nome}
              onChange={(e) =>
                setInsumoForm({ ...insumoForm, nome: e.target.value })
              }
            />
            <Select
              label="Categoria"
              value={insumoForm.categoria}
              onChange={(e) =>
                setInsumoForm({ ...insumoForm, categoria: e.target.value })
              }
              placeholder="Selecionar..."
              options={[
                { value: "Matéria-Prima", label: "Matéria-Prima" },
                { value: "Laticínios", label: "Laticínios" },
                { value: "Embalagem", label: "Embalagem" },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Qtd em Estoque"
                placeholder="0"
                value={insumoForm.quantidade}
                onChange={(e) =>
                  setInsumoForm({ ...insumoForm, quantidade: e.target.value })
                }
              />
              <Input
                label="Estoque Mínimo"
                placeholder="0"
                value={insumoForm.estoqueMinimo}
                onChange={(e) =>
                  setInsumoForm({
                    ...insumoForm,
                    estoqueMinimo: e.target.value,
                  })
                }
              />
            </div>
            <Input
              label="Fornecedor Preferencial"
              placeholder="Nome do fornecedor"
              value={insumoForm.fornecedor}
              onChange={(e) =>
                setInsumoForm({ ...insumoForm, fornecedor: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Lote"
                placeholder="L2026-08"
                value={insumoForm.lote}
                onChange={(e) =>
                  setInsumoForm({ ...insumoForm, lote: e.target.value })
                }
              />
              <Input
                label="Validade (opcional)"
                placeholder="DD/MM/AAAA"
                value={insumoForm.validade}
                onChange={(e) =>
                  setInsumoForm({ ...insumoForm, validade: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={confirmDesativar}
        onClose={() => setConfirmDesativar(false)}
        onConfirm={async () => {
          try {
            const item = itens.find((p) => p.id === itemParaDesativarId);
            const ativo = item?.status !== "Ativo";
            await produtosService.alterarStatus(itemParaDesativarId, ativo);
            await carregar();
            setConfirmDesativar(false);
            toast(
              `"${itemParaDesativar}" ${ativo ? "ativado" : "desativado"}.`,
              "success",
            );
          } catch (error) {
            toast(error.message, "error");
          }
        }}
        title="Alterar status do produto"
        message={`Tem certeza que deseja alterar o status de "${itemParaDesativar}"?`}
        confirmLabel="Confirmar"
      />
      <ConfirmDialog
        open={confirmExcluir}
        onClose={() => setConfirmExcluir(false)}
        loading={excluindo}
        onConfirm={async () => {
          try {
            setExcluindo(true);
            await produtosService.excluir(itemParaDesativarId);
            await carregar();
            setConfirmExcluir(false);
            toast(
              `"${itemParaDesativar}" excluído permanentemente.`,
              "success",
            );
          } catch (error) {
            toast(error.message, "error");
          } finally {
            setExcluindo(false);
          }
        }}
        title="Excluir produto permanentemente"
        message={`Tem certeza de que deseja excluir permanentemente "${itemParaDesativar}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir permanentemente"
      />
    </div>
  );
}
