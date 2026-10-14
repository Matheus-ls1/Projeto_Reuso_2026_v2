import { useEffect, useState } from "react";
import { Plus, Pencil, Archive, Trash2 } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Badge from "../components/ui/Badge";
import { toast } from "../components/ui/Toast";
import { avisosService } from "../services/avisosService";
const prioridadeColor = (p) => {
  if (p === "Alta") return "red";
  if (p === "Média") return "orange";
  return "gray";
};
// Mantém o CRUD de avisos manuais; avisos automáticos também aparecem na mesma listagem.
export default function Avisos() {
  const [busca, setBusca] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [excluirModal, setExcluirModal] = useState(false);
  const [avisoPara, setAvisoPara] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    corpo: "",
    prioridade: "Média",
    publico: "Todos",
    inicio: "",
    fim: "",
  });
  const [avisos, setAvisos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const carregar = async () => {
    try {
      setAvisos(await avisosService.listar());
    } catch (error) {
      toast(error.message, "error");
    }
  };
  useEffect(() => {
    carregar();
  }, []);
  const dados = avisos.filter((a) =>
    a.titulo.toLowerCase().includes(busca.toLowerCase()),
  );
  const salvar = async () => {
    if (!form.titulo || !form.corpo || !form.inicio)
      return toast("Preencha título, conteúdo e data de início.", "error");
    try {
      setSalvando(true);
      // Na edição, preserva tipo e situação que podem ter sido definidos pela API ou por observadores.
      editItem
        ? await avisosService.atualizar(editItem.id, {
            ...form,
            tipo: editItem.tipo || "MANUAL",
            situacao: editItem.situacao || "RASCUNHO",
          })
        : await avisosService.criar(form);
      await carregar();
      setDrawer(false);
      toast(
        `Aviso ${editItem ? "atualizado" : "criado"} com sucesso.`,
        "success",
      );
    } catch (error) {
      toast(error.message, "error");
    } finally {
      setSalvando(false);
    }
  };
  const openEdit = (a) => {
    setEditItem(a);
    setForm({
      titulo: a.titulo,
      corpo: a.corpo,
      prioridade: a.prioridade,
      publico: a.publico,
      inicio: a.inicio,
      fim: a.fim,
    });
    setDrawer(true);
  };
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Avisos" breadcrumbs={["Gestão"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Avisos Internos"
          subtitle="Comunicados para a equipe"
          actions={
            <Button
              variant="primary"
              icon={<Plus size={15} />}
              onClick={() => {
                setEditItem(null);
                setForm({
                  titulo: "",
                  corpo: "",
                  prioridade: "Média",
                  publico: "Todos",
                  inicio: "",
                  fim: "",
                });
                setDrawer(true);
              }}
            >
              Novo Aviso
            </Button>
          }
        />

        <FilterBar
          search={busca}
          onSearchChange={setBusca}
          placeholder="Buscar por título..."
        />

        <div className="flex flex-col gap-3">
          {dados.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-xl"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold">{a.titulo}</h3>
                    <Badge color={prioridadeColor(a.prioridade)}>
                      {a.prioridade}
                    </Badge>
                    <StatusBadge status={a.status} />
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {a.corpo}
                  </p>
                  <div
                    className="flex items-center gap-4 text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span>
                      Público: <strong>{a.publico}</strong>
                    </span>
                    <span>
                      Período: {a.inicio} – {a.fim}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    className="flex items-center justify-center rounded-lg p-1.5"
                    style={{ color: "var(--muted-foreground)" }}
                    onClick={() => openEdit(a)}
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center rounded-lg p-1.5"
                    style={{ color: "var(--muted-foreground)" }}
                    onClick={async () => {
                      try {
                        await avisosService.atualizar(a.id, {
                          ...a,
                          situacao: "ARQUIVADO",
                        });
                        await carregar();
                        toast(`Aviso "${a.titulo}" arquivado.`, "success");
                      } catch (error) {
                        toast(error.message, "error");
                      }
                    }}
                    title="Arquivar"
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    className="flex items-center justify-center rounded-lg p-1.5"
                    style={{ color: "var(--destructive)" }}
                    onClick={() => {
                      setAvisoPara(a);
                      setExcluirModal(true);
                    }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {dados.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: "var(--muted-foreground)" }}
            >
              <p className="text-sm">Nenhum aviso encontrado.</p>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editItem ? "Editar Aviso" : "Novo Aviso"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawer(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={salvar}>
              {editItem?.status === "Rascunho" ? "Publicar" : "Salvar"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Título"
            placeholder="Título do aviso"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Conteúdo</label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none"
              rows={5}
              placeholder="Escreva o conteúdo do aviso..."
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              value={form.corpo}
              onChange={(e) => setForm({ ...form, corpo: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Prioridade"
              value={form.prioridade}
              onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
              options={[
                { value: "Alta", label: "Alta" },
                { value: "Média", label: "Média" },
                { value: "Baixa", label: "Baixa" },
              ]}
            />
            <Select
              label="Público"
              value={form.publico}
              onChange={(e) => setForm({ ...form, publico: e.target.value })}
              options={[
                { value: "Todos", label: "Todos" },
                { value: "Operação", label: "Operação" },
                { value: "Administrativo", label: "Administrativo" },
                { value: "Gerência", label: "Gerência" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data de Início"
              placeholder="DD/MM/AAAA"
              value={form.inicio}
              onChange={(e) => setForm({ ...form, inicio: e.target.value })}
            />
            <Input
              label="Data de Fim"
              placeholder="DD/MM/AAAA"
              value={form.fim}
              onChange={(e) => setForm({ ...form, fim: e.target.value })}
            />
          </div>
        </div>
      </Drawer>

      <ConfirmDialog
        open={excluirModal}
        onClose={() => setExcluirModal(false)}
        loading={excluindo}
        onConfirm={async () => {
          try {
            setExcluindo(true);
            await avisosService.excluir(avisoPara.id);
            await carregar();
            setExcluirModal(false);
            toast(
              `Aviso "${avisoPara.titulo}" excluído permanentemente.`,
              "success",
            );
          } catch (error) {
            toast(error.message, "error");
          } finally {
            setExcluindo(false);
          }
        }}
        title="Excluir aviso permanentemente"
        message={`Tem certeza de que deseja excluir permanentemente "${avisoPara?.titulo}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir permanentemente"
      />
    </div>
  );
}
