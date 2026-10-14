import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import FilterBar from "../components/ui/FilterBar";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import Drawer from "../components/ui/Drawer";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { formatCurrency } from "../data/mock";
import { toast } from "../components/ui/Toast";
import { contasReceberService } from "../services/contasReceberService";
// Gerencia recebíveis e atualiza a listagem com os dados persistidos pela API.
export default function ContasReceber() {
  const [busca, setBusca] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [recebimentoModal, setRecebimentoModal] = useState(false);
  const [cancelarModal, setCancelarModal] = useState(false);
  const [simulacaoModal, setSimulacaoModal] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [recForm, setRecForm] = useState({
    data: "19/08/2026",
    valor: "",
    formaPag: "PIX",
  });
  const [form, setForm] = useState({
    descricao: "",
    categoria: "Serviços",
    cliente: "",
    valor: "",
    vencimento: "",
    observacao: "",
  });
  const [contas, setContas] = useState([]);
  const [excluindo, setExcluindo] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [simulacao, setSimulacao] = useState({
    estrategia: "PERCENTUAL",
    parametro: "",
    resultado: null,
  });
  const carregar = async () => {
    try {
      // Centraliza a atualização da tabela após cadastro, edição ou recebimento.
      setContas(await contasReceberService.listar());
    } catch (error) {
      toast(error.message, "error");
    }
  };
  useEffect(() => {
    carregar();
  }, []);
  const dados = contas.filter((c) =>
    c.descricao.toLowerCase().includes(busca.toLowerCase()),
  );
  const cols = [
    {
      key: "descricao",
      header: "Descrição",
      render: (r) => <span className="font-medium">{r.descricao}</span>,
    },
    { key: "categoria", header: "Categoria" },
    { key: "cliente", header: "Cliente" },
    { key: "vencimento", header: "Vencimento" },
    {
      key: "valor",
      header: "Valor",
      render: (r) => (
        <span className="font-semibold">{formatCurrency(r.valor)}</span>
      ),
    },
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
          {(r.status === "Pendente" || r.status === "Vencido") && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setContaSelecionada(r);
                setRecForm({ ...recForm, valor: String(r.valor) });
                setRecebimentoModal(true);
              }}
            >
              Receber
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setEditItem(r);
              setForm({ ...r });
              setDrawer(true);
            }}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setContaSelecionada(r);
              setSimulacao({ estrategia: "PERCENTUAL", parametro: "", resultado: null });
              setSimulacaoModal(true);
            }}
          >
            Simular
          </Button>
          <button
            className="flex items-center justify-center rounded-lg p-1.5"
            style={{ color: "var(--destructive)" }}
            onClick={(e) => {
              e.stopPropagation();
              setContaSelecionada(r);
              setCancelarModal(true);
            }}
            title="Excluir permanentemente"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Contas a Receber" breadcrumbs={["Financeiro"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Contas a Receber"
          subtitle="Gerencie recebíveis e receitas esperadas"
          actions={
            <Button
              variant="primary"
              icon={<Plus size={15} />}
              onClick={() => {
                setEditItem(null);
                setForm({
                  descricao: "",
                  categoria: "Serviços",
                  cliente: "",
                  valor: "",
                  vencimento: "",
                  observacao: "",
                });
                setDrawer(true);
              }}
            >
              + Nova Conta a Receber
            </Button>
          }
        />

        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            {
              label: "Total Pendente",
              value: contas
                .filter((c) => c.status === "Pendente")
                .reduce((s, c) => s + c.valor, 0),
              color: "var(--warning)",
            },
            {
              label: "Total Vencido",
              value: contas
                .filter((c) => c.status === "Vencido")
                .reduce((s, c) => s + c.valor, 0),
              color: "var(--destructive)",
            },
            {
              label: "Recebido este mês",
              value: contas
                .filter((c) => c.status === "Recebido")
                .reduce((s, c) => s + c.valor, 0),
              color: "var(--success)",
            },
            {
              label: "Total do mês",
              value: contas.reduce((s, c) => s + c.valor, 0),
              color: "var(--primary)",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="p-3 rounded-xl text-center"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs mb-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                {k.label}
              </p>
              <p className="text-base font-semibold" style={{ color: k.color }}>
                {formatCurrency(k.value)}
              </p>
            </div>
          ))}
        </div>

        <FilterBar
          search={busca}
          onSearchChange={setBusca}
          placeholder="Buscar descrição ou cliente..."
        />
        <DataTable
          columns={cols}
          data={dados}
          emptyMessage="Nenhuma conta encontrada."
        />
      </div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editItem ? "Editar Conta a Receber" : "Nova Conta a Receber"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawer(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              disabled={salvando}
              onClick={async () => {
                if (
                  !form.descricao ||
                  !form.cliente ||
                  !form.valor ||
                  !form.vencimento
                )
                  return toast("Preencha os campos obrigatórios.", "error");
                try {
                  setSalvando(true);
                  if (editItem)
                    await contasReceberService.atualizar(editItem.id, form);
                  else await contasReceberService.criar(form);
                  await carregar();
                  setDrawer(false);
                  toast(
                    editItem ? "Conta atualizada." : "Conta a receber criada.",
                    "success",
                  );
                } catch (error) {
                  toast(error.message, "error");
                } finally {
                  setSalvando(false);
                }
              }}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Descrição"
            placeholder="Ex: Evento Corporativo — Empresa ABC"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          <Select
            label="Categoria"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            options={[
              { value: "Serviços", label: "Serviços" },
              { value: "Catering", label: "Catering" },
              { value: "Contrato", label: "Contrato" },
              { value: "Outros", label: "Outros" },
            ]}
          />
          <Input
            label="Cliente"
            placeholder="Nome do cliente"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Valor (R$)"
              placeholder="0,00"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
            <Input
              label="Vencimento"
              placeholder="DD/MM/AAAA"
              value={form.vencimento}
              onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Observação</label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg outline-none resize-none"
              rows={2}
              style={{
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--foreground)",
              }}
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
            />
          </div>
        </div>
      </Drawer>

      <Modal
        open={recebimentoModal}
        onClose={() => setRecebimentoModal(false)}
        title="Registrar Recebimento"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRecebimentoModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await contasReceberService.situacao(
                    contaSelecionada.id,
                    "RECEBIDO",
                  );
                  await carregar();
                  setRecebimentoModal(false);
                  toast("Recebimento registrado com sucesso.", "success");
                } catch (error) {
                  toast(error.message, "error");
                }
              }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {contaSelecionada && (
            <div
              className="p-3 rounded-xl"
              style={{ background: "var(--muted)" }}
            >
              <p className="text-sm font-semibold">
                {contaSelecionada.descricao}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                Cliente: {contaSelecionada.cliente}
              </p>
            </div>
          )}
          <Input
            label="Data do Recebimento"
            value={recForm.data}
            onChange={(e) => setRecForm({ ...recForm, data: e.target.value })}
          />
          <Input
            label="Valor Recebido (R$)"
            value={recForm.valor}
            onChange={(e) => setRecForm({ ...recForm, valor: e.target.value })}
          />
          <Select
            label="Forma de Recebimento"
            value={recForm.formaPag}
            onChange={(e) =>
              setRecForm({ ...recForm, formaPag: e.target.value })
            }
            options={[
              { value: "PIX", label: "PIX" },
              { value: "Cartão", label: "Cartão" },
              { value: "Transferência", label: "Transferência" },
              { value: "Dinheiro", label: "Dinheiro" },
            ]}
          />
        </div>
      </Modal>

      <Modal
        open={simulacaoModal}
        onClose={() => setSimulacaoModal(false)}
        title="Simular desconto"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSimulacaoModal(false)}>
              Fechar
            </Button>
            <Button
              variant="primary"
              disabled={simulando}
              onClick={async () => {
                try {
                  setSimulando(true);
                  const resultado = await contasReceberService.simularDescontos(
                    contaSelecionada.id,
                    simulacao.estrategia,
                    simulacao.parametro,
                    0,
                  );
                  setSimulacao({ ...simulacao, resultado });
                } catch (error) {
                  toast(error.message, "error");
                } finally {
                  setSimulando(false);
                }
              }}
            >
              {simulando ? "Simulando..." : "Simular"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {contaSelecionada?.descricao} · Valor original: {formatCurrency(contaSelecionada?.valor || 0)}
          </p>
          <Select
            label="Estratégia"
            value={simulacao.estrategia}
            onChange={(e) => setSimulacao({ ...simulacao, estrategia: e.target.value, resultado: null })}
            options={[
              { value: "PERCENTUAL", label: "Desconto percentual" },
              { value: "VALOR_FIXO", label: "Desconto fixo" },
            ]}
          />
          <Input
            label={simulacao.estrategia === "PERCENTUAL" ? "Percentual (%)" : "Valor do desconto (R$)"}
            placeholder="0,00"
            value={simulacao.parametro}
            onChange={(e) => setSimulacao({ ...simulacao, parametro: e.target.value, resultado: null })}
          />
          {simulacao.resultado && (
            <div className="p-3 rounded-xl" style={{ background: "var(--muted)" }}>
              <p className="text-sm">Desconto: {formatCurrency(Number(simulacao.resultado.ajuste))}</p>
              <p className="text-sm font-semibold">Total calculado: {formatCurrency(Number(simulacao.resultado.valorCalculado))}</p>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={cancelarModal}
        onClose={() => setCancelarModal(false)}
        loading={excluindo}
        onConfirm={async () => {
          try {
            setExcluindo(true);
            await contasReceberService.excluir(contaSelecionada.id);
            await carregar();
            setCancelarModal(false);
            toast(
              `Conta "${contaSelecionada.descricao}" excluída permanentemente.`,
              "success",
            );
          } catch (error) {
            toast(error.message, "error");
          } finally {
            setExcluindo(false);
          }
        }}
        title="Excluir conta permanentemente"
        message={`Tem certeza de que deseja excluir permanentemente "${contaSelecionada?.descricao}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir permanentemente"
      />
    </div>
  );
}
