import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Clock,
  User,
} from "lucide-react";
import TopBar from "../components/layout/TopBar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Drawer from "../components/ui/Drawer";
import StatusBadge from "../components/ui/StatusBadge";
import Input from "../components/ui/Input";
import { formatCurrency } from "../data/mock";
import { toast } from "../components/ui/Toast";
const movimentacoesIniciais = [
  {
    id: "1",
    hora: "08:20",
    tipo: "Abertura",
    descricao: "Abertura de caixa",
    valor: 200.0,
  },
  {
    id: "2",
    hora: "08:58",
    tipo: "Venda",
    descricao: "Venda V-2026-1087",
    valor: 47.0,
  },
  {
    id: "3",
    hora: "09:15",
    tipo: "Venda",
    descricao: "Venda V-2026-1088",
    valor: 12.5,
  },
  {
    id: "4",
    hora: "09:32",
    tipo: "Venda",
    descricao: "Venda V-2026-1089",
    valor: 34.5,
  },
  {
    id: "5",
    hora: "09:45",
    tipo: "Saída",
    descricao: "Sangria — pagamento fornecedor",
    valor: -46.0,
  },
];
export default function Caixa() {
  const [caixaAberto, setCaixaAberto] = useState(true);
  const [saldoInicial, setSaldoInicial] = useState("200,00");
  const [movs, setMovs] = useState(movimentacoesIniciais);
  const [drawerMov, setDrawerMov] = useState(false);
  const [tipoMov, setTipoMov] = useState("Entrada");
  const [valorMov, setValorMov] = useState("");
  const [motivoMov, setMotivoMov] = useState("");
  const [fecharModal, setFecharModal] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [saldoAbertura, setSaldoAbertura] = useState("");
  const saldoAtual = movs.reduce((s, m) => s + m.valor, 0);
  const totalEntradas = movs
    .filter((m) => m.valor > 0 && m.tipo !== "Abertura")
    .reduce((s, m) => s + m.valor, 0);
  const totalSaidas = movs
    .filter((m) => m.valor < 0)
    .reduce((s, m) => s + Math.abs(m.valor), 0);
  const registrarMov = () => {
    const val = parseFloat(valorMov.replace(",", "."));
    if (!val || !motivoMov) return;
    const novo = {
      id: String(Date.now()),
      hora: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tipo: tipoMov,
      descricao: motivoMov,
      valor: tipoMov === "Entrada" ? val : -val,
    };
    setMovs((prev) => [...prev, novo]);
    setValorMov("");
    setMotivoMov("");
    setDrawerMov(false);
    toast(`${tipoMov} registrada com sucesso.`, "success");
  };
  const abrirCaixa = () => {
    const val = parseFloat(saldoAbertura.replace(",", ".")) || 0;
    setMovs([
      {
        id: "1",
        hora: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tipo: "Abertura",
        descricao: "Abertura de caixa",
        valor: val,
      },
    ]);
    setCaixaAberto(true);
    setSaldoAbertura("");
    setAbrirModal(false);
    toast("Caixa aberto com sucesso!", "success");
  };
  const fecharCaixa = () => {
    setCaixaAberto(false);
    setFecharModal(false);
    toast("Caixa fechado. Resumo salvo.", "success");
  };
  const tipoColor = (tipo) => {
    if (tipo === "Venda" || tipo === "Entrada" || tipo === "Abertura")
      return "var(--success)";
    return "var(--destructive)";
  };
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Caixa" breadcrumbs={["Operação"]} />
      <div className="flex-1 overflow-y-auto p-6">
        {!caixaAberto ? (
          // Caixa fechado
          <div className="flex flex-col items-center justify-center min-h-96 gap-6">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 72, height: 72, background: "var(--muted)" }}
            >
              <DollarSign
                size={32}
                style={{ color: "var(--muted-foreground)" }}
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Caixa fechado</h2>
              <p
                className="text-sm"
                style={{ color: "var(--muted-foreground)" }}
              >
                Abra o caixa para começar a registrar movimentações e vendas.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setAbrirModal(true)}
            >
              Abrir Caixa
            </Button>
          </div>
        ) : (
          <>
            {/* Header do caixa aberto */}
            <div
              className="flex items-center justify-between p-5 rounded-xl mb-6"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width: 48, height: 48, background: "#DCFCE7" }}
                >
                  <DollarSign size={22} style={{ color: "var(--success)" }} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status="Aberto" />
                  </div>
                  <div
                    className="flex items-center gap-4 text-xs"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    <span className="flex items-center gap-1">
                      <User size={11} /> Beatriz Santos
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Abertura: 08:20
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p
                    className="text-xs font-medium mb-0.5"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Saldo Atual
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {formatCurrency(saldoAtual)}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setFecharModal(true)}
                >
                  Fechar Caixa
                </Button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                {
                  label: "Saldo Inicial",
                  value: formatCurrency(200),
                  icon: <DollarSign size={16} />,
                  color: "#6B7280",
                },
                {
                  label: "Total Entradas",
                  value: formatCurrency(totalEntradas + 200),
                  icon: <ArrowUpCircle size={16} />,
                  color: "var(--success)",
                },
                {
                  label: "Total Saídas",
                  value: formatCurrency(totalSaidas),
                  icon: <ArrowDownCircle size={16} />,
                  color: "var(--destructive)",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg"
                    style={{
                      width: 36,
                      height: 36,
                      background: "var(--muted)",
                      color: k.color,
                    }}
                  >
                    {k.icon}
                  </div>
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {k.label}
                    </p>
                    <p className="text-base font-semibold">{k.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ações */}
            <div className="flex gap-3 mb-5">
              <Button
                variant="outline"
                icon={<ArrowUpCircle size={15} />}
                onClick={() => {
                  setTipoMov("Entrada");
                  setDrawerMov(true);
                }}
              >
                Reforço
              </Button>
              <Button
                variant="outline"
                icon={<ArrowDownCircle size={15} />}
                onClick={() => {
                  setTipoMov("Saída");
                  setDrawerMov(true);
                }}
              >
                Sangria
              </Button>
            </div>

            {/* Movimentações */}
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
            >
              <div
                className="px-5 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h3 className="text-sm font-semibold">Movimentações do dia</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Hora", "Tipo", "Descrição", "Valor"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movs.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom:
                          i < movs.length - 1
                            ? "1px solid var(--border)"
                            : undefined,
                      }}
                    >
                      <td
                        className="px-4 py-3 text-sm font-mono"
                        style={{ color: "var(--muted-foreground)" }}
                      >
                        {m.hora}
                      </td>
                      <td className="px-4 py-3 text-sm">{m.tipo}</td>
                      <td className="px-4 py-3 text-sm">{m.descricao}</td>
                      <td
                        className="px-4 py-3 text-sm font-semibold"
                        style={{ color: tipoColor(m.tipo) }}
                      >
                        {m.valor >= 0 ? "+" : ""}
                        {formatCurrency(m.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Drawer de movimentação */}
      <Drawer
        open={drawerMov}
        onClose={() => setDrawerMov(false)}
        title={
          tipoMov === "Entrada" ? "Registrar Reforço" : "Registrar Sangria"
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerMov(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={registrarMov}>
              Registrar
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Valor (R$)"
            placeholder="0,00"
            value={valorMov}
            onChange={(e) => setValorMov(e.target.value)}
          />
          <Input
            label="Motivo / Descrição"
            placeholder="Descreva o motivo"
            value={motivoMov}
            onChange={(e) => setMotivoMov(e.target.value)}
          />
        </div>
      </Drawer>

      {/* Modal abrir caixa */}
      <Modal
        open={abrirModal}
        onClose={() => setAbrirModal(false)}
        title="Abrir Caixa"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAbrirModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={abrirCaixa}>
              Abrir Caixa
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Informe o saldo inicial em dinheiro para abertura do caixa.
          </p>
          <Input
            label="Saldo Inicial (R$)"
            placeholder="200,00"
            value={saldoAbertura}
            onChange={(e) => setSaldoAbertura(e.target.value)}
          />
        </div>
      </Modal>

      {/* Modal fechar caixa */}
      <Modal
        open={fecharModal}
        onClose={() => setFecharModal(false)}
        title="Fechar Caixa"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFecharModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={fecharCaixa}>
              Confirmar Fechamento
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p
            className="text-sm mb-2"
            style={{ color: "var(--muted-foreground)" }}
          >
            Resumo do período:
          </p>
          {[
            { label: "Saldo Inicial", value: formatCurrency(200) },
            { label: "Total Vendas", value: formatCurrency(totalEntradas) },
            { label: "Total Saídas", value: formatCurrency(totalSaidas) },
            {
              label: "Saldo Final",
              value: formatCurrency(saldoAtual),
              bold: true,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between text-sm py-2"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                {row.label}
              </span>
              <span className={row.bold ? "font-bold" : "font-medium"}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
