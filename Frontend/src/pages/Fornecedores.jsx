import { useEffect, useState } from "react";
import { Plus, Pencil, ToggleLeft, Trash2 } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { toast } from "../components/ui/Toast";
import { fornecedoresService } from "../services/fornecedoresService";

const vazio = {
  nome: "",
  cnpj: "",
  contato: "",
  telefone: "",
  email: "",
  status: "Ativo",
};
// Controla o CRUD de fornecedores e separa a troca de status da exclusão permanente.
export default function Fornecedores() {
  const [busca, setBusca] = useState(""),
    [drawer, setDrawer] = useState(false),
    [editItem, setEditItem] = useState(null),
    [form, setForm] = useState(vazio),
    [dados, setDados] = useState([]),
    [salvando, setSalvando] = useState(false),
    [selecionado, setSelecionado] = useState(null),
    [statusModal, setStatusModal] = useState(false),
    [excluirModal, setExcluirModal] = useState(false),
    [excluindo, setExcluindo] = useState(false);
  const carregar = async () => {
    try {
      setDados(await fornecedoresService.listar());
    } catch (e) {
      toast(e.message, "error");
    }
  };
  useEffect(() => {
    carregar();
  }, []);
  const salvar = async () => {
    if (
      !form.nome ||
      !form.cnpj ||
      !form.contato ||
      !form.telefone ||
      !form.email
    )
      return toast("Preencha os campos obrigatórios.", "error");
    try {
      // A mesma ação atende inclusão e edição conforme exista um item selecionado.
      setSalvando(true);
      editItem ? await fornecedoresService.atualizar(editItem.id, form) : await fornecedoresService.criar(form);
      await carregar();
      setDrawer(false);
      toast("Fornecedor salvo com sucesso.", "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSalvando(false);
    }
  };
  const alterarStatus = async () => {
    try {
      // O PATCH altera somente ativo/inativo e mantém o registro no banco.
      const ativo = selecionado.status !== "Ativo";
      await fornecedoresService.alterarStatus(selecionado.id, ativo);
      await carregar();
      setStatusModal(false);
      toast(
        `Fornecedor "${selecionado.nome}" ${ativo ? "ativado" : "desativado"}.`,
        "success",
      );
    } catch (e) {
      toast(e.message, "error");
    }
  };
  const excluir = async () => {
    try {
      setExcluindo(true);
      await fornecedoresService.excluir(selecionado.id);
      await carregar();
      setExcluirModal(false);
      toast(
        `Fornecedor "${selecionado.nome}" excluído permanentemente.`,
        "success",
      );
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setExcluindo(false);
    }
  };
  const linhas = dados.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cnpj.includes(busca),
  );
  const cols = [
    { key: "nome", header: "Nome" },
    {
      key: "cnpj",
      header: "CNPJ/CPF",
      render: (r) => <span className="font-mono text-xs">{r.cnpj}</span>,
    },
    { key: "contato", header: "Contato" },
    { key: "telefone", header: "Telefone" },
    { key: "email", header: "E-mail" },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "acoes",
      header: "Ações",
      render: (r) => (
        <div className="flex gap-1">
          <button
            className="p-1.5"
            onClick={() => {
              setEditItem(r);
              setForm({ ...r });
              setDrawer(true);
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="p-1.5"
            onClick={() => {
              setSelecionado(r);
              setStatusModal(true);
            }}
            title={r.status === "Ativo" ? "Desativar" : "Ativar"}
          >
            <ToggleLeft size={13} />
          </button>
          <button
            className="p-1.5"
            style={{ color: "var(--destructive)" }}
            onClick={() => {
              setSelecionado(r);
              setExcluirModal(true);
            }}
            title="Excluir permanentemente"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Fornecedores" breadcrumbs={["Estoque e Compras"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Fornecedores"
          subtitle="Cadastro e gestão de fornecedores"
          actions={
            <Button
              variant="primary"
              icon={<Plus size={15} />}
              onClick={() => {
                setEditItem(null);
                setForm(vazio);
                setDrawer(true);
              }}
            >
              Novo Fornecedor
            </Button>
          }
        />
        <FilterBar
          search={busca}
          onSearchChange={setBusca}
          placeholder="Buscar por nome ou CNPJ..."
        />
        <DataTable
          columns={cols}
          data={linhas}
          emptyMessage="Nenhum fornecedor encontrado."
        />
      </div>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editItem ? "Editar Fornecedor" : "Novo Fornecedor"}
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
        <div className="flex flex-col gap-4">
          <Input
            label="Razão Social / Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <Input
            label="CNPJ / CPF"
            value={form.cnpj}
            onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
          />
          <Input
            label="Nome do Contato"
            value={form.contato}
            onChange={(e) => setForm({ ...form, contato: e.target.value })}
          />
          <Input
            label="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
          <Input
            label="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: "Ativo", label: "Ativo" },
              { value: "Inativo", label: "Inativo" },
            ]}
          />
        </div>
      </Drawer>
      <ConfirmDialog
        open={statusModal}
        onClose={() => setStatusModal(false)}
        onConfirm={alterarStatus}
        title="Alterar status"
        message={`Deseja alterar o status de "${selecionado?.nome}"?`}
        confirmLabel="Confirmar"
      />
      <ConfirmDialog
        open={excluirModal}
        onClose={() => setExcluirModal(false)}
        loading={excluindo}
        onConfirm={excluir}
        title="Excluir fornecedor permanentemente"
        message={`Tem certeza de que deseja excluir permanentemente "${selecionado?.nome}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir permanentemente"
      />
    </div>
  );
}
