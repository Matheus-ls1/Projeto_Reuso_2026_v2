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
import { contasPagarService } from "../services/contasPagarService";
// Gerencia lançamentos a pagar, pagamento e exclusão usando a API financeira.
export default function ContasPagar() {
  const [busca, setBusca] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [pagamentoModal, setPagamentoModal] = useState(false);
  const [cancelarModal, setCancelarModal] = useState(false);
  const [simulacaoModal, setSimulacaoModal] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [jaPago, setJaPago] = useState(false);
  const [form, setForm] = useState({
    descricao: "",
    categoria: "Insumos",
    fornecedor: "",
    valor: "",
    vencimento: "",
    formaPag: "PIX",
    observacao: "",
    dataPagamento: "",
  });
  const [pagForm, setPagForm] = useState({
    data: "19/08/2026",
    valor: "",
    formaPag: "PIX",
  });
  const [contas, setContas] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [simulacao, setSimulacao] = useState({
    estrategia: "JUROS_DIARIOS",
    percentual: "",
    dias: "0",
    resultado: null,
  });
  const carregar = async () => {
    try {
      // A listagem vem da API para substituir os dados locais após cada alteração.
      setContas(await contasPagarService.listar());
    } catch (error) {
      toast(error.message, "error");
    }
  };
  useEffect(() => {
    carregar();
  }, []);
  const dados = contas.filter(
    (c) =>
      c.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      c.categoria.toLowerCase().includes(busca.toLowerCase()),
  );
  const cols = [
    {
      key: "descricao",
      header: "Descrição",
      render: (r) => <span className="font-medium">{r.descricao}</span>,
    },
    { key: "categoria", header: "Categoria" },
    {
      key: "fornecedor",
      header: "Fornecedor",
      render: (r) => <span>{r.fornecedor || "—"}</span>,
    },
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
                setPagForm({ ...pagForm, valor: String(r.valor) });
                setPagamentoModal(true);
              }}
            >
              Pagar
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
              setSimulacao({
                estrategia: "JUROS_DIARIOS",
                percentual: "",
                dias: "0",
                resultado: null,
              });
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
  const salvar = async () => {
    if (!form.descricao || !form.valor || !form.vencimento)
      return toast("Preencha descrição, valor e vencimento.", "error");
    try {
      setSalvando(true);
      // Monta os campos de pagamento quando o formulário indica que a conta já foi quitada.
      const dadosConta = {
        ...form,
        situacao: jaPago ? "PAGO" : form.situacao || "PENDENTE",
        dataPagamento: jaPago ? form.dataPagamento : form.dataPagamento || null,
        valorPago: jaPago ? form.valor : form.valorPago || null,
      };
      if (editItem) await contasPagarService.atualizar(editItem.id, dadosConta);
      else await contasPagarService.criar(dadosConta);
      await carregar();
      setDrawer(false);
      toast(
        editItem
          ? "Conta atualizada."
          : jaPago
            ? "Despesa registrada como paga."
            : "Conta a pagar criada.",
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
      <TopBar title="Contas a Pagar" breadcrumbs={["Financeiro"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Contas a Pagar"
          subtitle="Gerencie obrigações financeiras e despesas"
          actions={
            <>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  const resultado = await contasPagarService.verificarVencimentos();
                  toast(
                    `${resultado.contasVerificadas} conta(s) verificadas para vencimento próximo.`,
                    "success",
                  );
                } catch (error) {
                  toast(error.message, "error");
                }
              }}
            >
              Verificar vencimentos
            </Button>
            <Button
              variant="primary"
              icon={<Plus size={15} />}
              onClick={() => {
                setEditItem(null);
                setJaPago(false);
                setForm({
                  descricao: "",
                  categoria: "Insumos",
                  fornecedor: "",
                  valor: "",
                  vencimento: "",
                  formaPag: "PIX",
                  observacao: "",
                  dataPagamento: "",
                });
                setDrawer(true);
              }}
            >
              + Nova Conta / Despesa
            </Button>
            </>
          }
        />

        {/* Totalizadores rápidos */}
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
              label: "Pago este mês",
              value: contas
                .filter((c) => c.status === "Pago")
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
          placeholder="Buscar descrição ou categoria..."
        />
        <DataTable
          columns={cols}
          data={dados}
          emptyMessage="Nenhuma conta encontrada."
        />
      </div>

      {/* Drawer */}
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={editItem ? "Editar Conta / Despesa" : "Nova Conta / Despesa"}
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
            label="Descrição"
            placeholder="Ex: Aluguel — Setembro 2026"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          <Select
            label="Categoria Financeira"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            options={[
              { value: "Insumos", label: "Insumos" },
              { value: "Aluguel", label: "Aluguel" },
              { value: "Utilidades", label: "Utilidades" },
              { value: "Pessoal", label: "Pessoal" },
              { value: "Tecnologia", label: "Tecnologia" },
              { value: "Outros", label: "Outros" },
            ]}
          />
          <Input
            label="Fornecedor (opcional)"
            placeholder="Nome do fornecedor"
            value={form.fornecedor}
            onChange={(e) => setForm({ ...form, fornecedor: e.target.value })}
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
          <Select
            label="Forma de Pagamento"
            value={form.formaPag}
            onChange={(e) => setForm({ ...form, formaPag: e.target.value })}
            options={[
              { value: "PIX", label: "PIX" },
              { value: "Boleto", label: "Boleto" },
              { value: "Cartão", label: "Cartão" },
              { value: "Transferência", label: "Transferência" },
            ]}
          />
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

          {/* Toggle "Já foi pago" */}
          <div
            className="flex items-center justify-between p-3 rounded-xl"
            style={{
              background: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <p className="text-sm font-medium">Já foi pago</p>
              <p
                className="text-xs"
                style={{ color: "var(--muted-foreground)" }}
              >
                Registrar como despesa já liquidada
              </p>
            </div>
            <button
              onClick={() => setJaPago(!jaPago)}
              className="relative rounded-full transition-colors"
              style={{
                width: 40,
                height: 22,
                background: jaPago ? "var(--success)" : "var(--border)",
              }}
            >
              <span
                className="absolute top-0.5 rounded-full bg-white transition-transform"
                style={{
                  width: 18,
                  height: 18,
                  left: 2,
                  transform: jaPago ? "translateX(18px)" : "translateX(0)",
                }}
              />
            </button>
          </div>
          {jaPago && (
            <Input
              label="Data do Pagamento"
              placeholder="DD/MM/AAAA"
              value={form.dataPagamento}
              onChange={(e) =>
                setForm({ ...form, dataPagamento: e.target.value })
              }
            />
          )}
        </div>
      </Drawer>

      {/* Modal pagamento */}
      <Modal
        open={pagamentoModal}
        onClose={() => setPagamentoModal(false)}
        title="Registrar Pagamento"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPagamentoModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await contasPagarService.situacao(
                    contaSelecionada.id,
                    "PAGO",
                  );
                  await carregar();
                  setPagamentoModal(false);
                  toast("Pagamento registrado com sucesso.", "success");
                } catch (error) {
                  toast(error.message, "error");
                }
              }}
            >
              Confirmar Pagamento
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
                Vencimento: {contaSelecionada.vencimento}
              </p>
            </div>
          )}
          <Input
            label="Data do Pagamento"
            value={pagForm.data}
            onChange={(e) => setPagForm({ ...pagForm, data: e.target.value })}
          />
          <Input
            label="Valor Pago (R$)"
            value={pagForm.valor}
            onChange={(e) => setPagForm({ ...pagForm, valor: e.target.value })}
          />
          <Select
            label="Forma de Pagamento"
            value={pagForm.formaPag}
            onChange={(e) =>
              setPagForm({ ...pagForm, formaPag: e.target.value })
            }
            options={[
              { value: "PIX", label: "PIX" },
              { value: "Boleto", label: "Boleto" },
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
        title="Simular encargos"
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
                  const resultado = await contasPagarService.simularEncargos(
                    contaSelecionada.id,
                    simulacao.estrategia,
                    simulacao.percentual,
                    simulacao.dias,
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
              { value: "JUROS_DIARIOS", label: "Juros diários" },
              { value: "MULTA_PERCENTUAL", label: "Multa percentual" },
            ]}
          />
          <Input
            label="Percentual (%)"
            placeholder="0,00"
            value={simulacao.percentual}
            onChange={(e) => setSimulacao({ ...simulacao, percentual: e.target.value, resultado: null })}
          />
          {simulacao.estrategia === "JUROS_DIARIOS" && (
            <Input
              label="Dias"
              value={simulacao.dias}
              onChange={(e) => setSimulacao({ ...simulacao, dias: e.target.value, resultado: null })}
            />
          )}
          {simulacao.resultado && (
            <div className="p-3 rounded-xl" style={{ background: "var(--muted)" }}>
              <p className="text-sm">Encargos: {formatCurrency(Number(simulacao.resultado.ajuste))}</p>
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
            await contasPagarService.excluir(contaSelecionada.id);
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
