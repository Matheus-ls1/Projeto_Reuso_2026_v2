import { useCallback, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Clock, DollarSign } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Drawer from "../components/ui/Drawer";
import StatusBadge from "../components/ui/StatusBadge";
import Input from "../components/ui/Input";
import { toast } from "../components/ui/Toast";
import { caixaService } from "../services/caixaService";
import { toNumber } from "../services/api";

const dinheiro = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
const hora = (v) => v ? new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(v)) : "—";
const dataHora = (v) => v ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(v)) : "—";

export default function Caixa() {
  const [caixa, setCaixa] = useState(null);
  const [movs, setMovs] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [drawerMov, setDrawerMov] = useState(false);
  const [tipoMov, setTipoMov] = useState("ENTRADA");
  const [valorMov, setValorMov] = useState("");
  const [motivoMov, setMotivoMov] = useState("");
  const [fecharModal, setFecharModal] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [saldoAbertura, setSaldoAbertura] = useState("");
  const [ultimoFechamento, setUltimoFechamento] = useState(null);

  const carregar = useCallback(async (silencioso = false) => {
    setCarregando(true);
    try {
      const aberto = await caixaService.buscarAberto();
      const movimentos = await caixaService.listarMovimentacoes(aberto.id);
      setCaixa(aberto);
      setMovs(movimentos);
      setUltimoFechamento(null);
    } catch (erro) {
      if (erro.status === 404) {
        setCaixa(null);
        setMovs([]);
      } else if (!silencioso) toast(erro.message, "error");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const entradas = movs.filter((m) => m.tipo === "ENTRADA").reduce((s, m) => s + Number(m.valor), 0);
  const saidas = movs.filter((m) => m.tipo === "SAIDA").reduce((s, m) => s + Number(m.valor), 0);
  const saldoAtual = Number(caixa?.saldoAtual || 0);

  const abrir = async () => {
    const saldo = toNumber(saldoAbertura);
    if (!saldoAbertura.trim() || !Number.isFinite(saldo) || saldo < 0) return toast("Informe um saldo inicial válido.", "error");
    setSalvando(true);
    try {
      await caixaService.abrir(saldoAbertura);
      setSaldoAbertura(""); setAbrirModal(false);
      await carregar(true);
      toast("Caixa aberto com sucesso!", "success");
    } catch (erro) { toast(erro.message, "error"); }
    finally { setSalvando(false); }
  };

  const registrar = async () => {
    const valor = toNumber(valorMov);
    if (!Number.isFinite(valor) || valor <= 0 || !motivoMov.trim()) return toast("Informe um valor maior que zero e o motivo.", "error");
    setSalvando(true);
    try {
      if (tipoMov === "ENTRADA") await caixaService.registrarEntrada(caixa.id, valorMov, motivoMov.trim());
      else await caixaService.registrarSaida(caixa.id, valorMov, motivoMov.trim());
      setValorMov(""); setMotivoMov(""); setDrawerMov(false);
      await carregar(true);
      toast(tipoMov === "ENTRADA" ? "Reforço registrado." : "Sangria registrada.", "success");
    } catch (erro) { toast(erro.message, "error"); }
    finally { setSalvando(false); }
  };

  const fechar = async () => {
    setSalvando(true);
    try {
      const fechado = await caixaService.fechar(caixa.id);
      setUltimoFechamento(fechado); setCaixa(null); setFecharModal(false);
      toast("Caixa fechado. Resumo salvo.", "success");
    } catch (erro) { toast(erro.message, "error"); }
    finally { setSalvando(false); }
  };

  const resumo = [
    { label: "Saldo Inicial", value: dinheiro(caixa?.saldoInicial) },
    { label: "Total Entradas", value: dinheiro(entradas) },
    { label: "Total Saídas", value: dinheiro(saidas) },
    { label: "Saldo Final", value: dinheiro(saldoAtual), bold: true },
  ];

  return <div className="flex flex-col h-full">
    <TopBar title="Caixa" breadcrumbs={["Operação"]} />
    <div className="flex-1 overflow-y-auto p-6">
      {carregando ? <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Carregando caixa...</p> : !caixa ? <div className="flex flex-col items-center justify-center min-h-96 gap-6">
        <div className="flex items-center justify-center rounded-2xl" style={{ width: 72, height: 72, background: "var(--muted)" }}><DollarSign size={32} style={{ color: "var(--muted-foreground)" }} /></div>
        <div className="text-center"><h2 className="text-xl font-semibold mb-2">Caixa fechado</h2><p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Abra o caixa para começar a registrar movimentações.</p>{ultimoFechamento && <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>Último saldo final: {dinheiro(ultimoFechamento.saldoFinal)}</p>}</div>
        <Button variant="primary" size="lg" onClick={() => setAbrirModal(true)}>Abrir Caixa</Button>
      </div> : <>
        <div className="flex items-center justify-between p-5 rounded-xl mb-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4"><div className="flex items-center justify-center rounded-xl" style={{ width: 48, height: 48, background: "#DCFCE7" }}><DollarSign size={22} style={{ color: "var(--success)" }} /></div><div><div className="flex items-center gap-2 mb-1"><StatusBadge status="Aberto" /></div><div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted-foreground)" }}><span className="flex items-center gap-1"><Clock size={11} /> Abertura: {dataHora(caixa.abertoEm)}</span></div></div></div>
          <div className="flex items-center gap-6"><div className="text-right"><p className="text-xs font-medium mb-0.5" style={{ color: "var(--muted-foreground)" }}>Saldo Atual</p><p className="text-2xl font-bold">{dinheiro(saldoAtual)}</p></div><Button variant="destructive" disabled={salvando} onClick={() => setFecharModal(true)}>Fechar Caixa</Button></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">{[
          { label: "Saldo Inicial", value: dinheiro(caixa.saldoInicial), icon: <DollarSign size={16} />, color: "#6B7280" },
          { label: "Total Entradas", value: dinheiro(entradas), icon: <ArrowUpCircle size={16} />, color: "var(--success)" },
          { label: "Total Saídas", value: dinheiro(saidas), icon: <ArrowDownCircle size={16} />, color: "var(--destructive)" },
        ].map((k) => <div key={k.label} className="p-4 rounded-xl flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}><div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: "var(--muted)", color: k.color }}>{k.icon}</div><div><p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{k.label}</p><p className="text-base font-semibold">{k.value}</p></div></div>)}</div>
        <div className="flex gap-3 mb-5"><Button variant="outline" disabled={salvando} icon={<ArrowUpCircle size={15} />} onClick={() => { setTipoMov("ENTRADA"); setDrawerMov(true); }}>Reforço</Button><Button variant="outline" disabled={salvando} icon={<ArrowDownCircle size={15} />} onClick={() => { setTipoMov("SAIDA"); setDrawerMov(true); }}>Sangria</Button></div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}><div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}><h3 className="text-sm font-semibold">Movimentações do dia</h3></div><table className="w-full"><thead><tr style={{ borderBottom: "1px solid var(--border)" }}>{["Hora", "Tipo", "Descrição", "Valor"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>{h}</th>)}</tr></thead><tbody>{movs.length === 0 ? <tr><td colSpan="4" className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>Nenhuma movimentação registrada.</td></tr> : movs.map((m, i) => { const saida = m.tipo === "SAIDA"; return <tr key={m.id} style={{ borderBottom: i < movs.length - 1 ? "1px solid var(--border)" : undefined }}><td className="px-4 py-3 text-sm font-mono" style={{ color: "var(--muted-foreground)" }}>{hora(m.ocorridoEm)}</td><td className="px-4 py-3 text-sm">{saida ? "Saída" : "Entrada"}</td><td className="px-4 py-3 text-sm">{m.descricao}</td><td className="px-4 py-3 text-sm font-semibold" style={{ color: saida ? "var(--destructive)" : "var(--success)" }}>{saida ? "-" : "+"}{dinheiro(m.valor)}</td></tr>; })}</tbody></table></div>
      </>}
    </div>
    <Drawer open={drawerMov} onClose={() => !salvando && setDrawerMov(false)} title={tipoMov === "ENTRADA" ? "Registrar Reforço" : "Registrar Sangria"} footer={<><Button variant="ghost" disabled={salvando} onClick={() => setDrawerMov(false)}>Cancelar</Button><Button variant="primary" disabled={salvando} onClick={registrar}>{salvando ? "Registrando..." : "Registrar"}</Button></>}><div className="flex flex-col gap-4"><Input disabled={salvando} label="Valor (R$)" placeholder="0,00" value={valorMov} onChange={(e) => setValorMov(e.target.value)} /><Input disabled={salvando} label="Motivo / Descrição" placeholder="Descreva o motivo" value={motivoMov} onChange={(e) => setMotivoMov(e.target.value)} /></div></Drawer>
    <Modal open={abrirModal} onClose={() => !salvando && setAbrirModal(false)} title="Abrir Caixa" size="sm" footer={<><Button variant="ghost" disabled={salvando} onClick={() => setAbrirModal(false)}>Cancelar</Button><Button variant="primary" disabled={salvando} onClick={abrir}>{salvando ? "Abrindo..." : "Abrir Caixa"}</Button></>}><div className="flex flex-col gap-4"><p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Informe o saldo inicial em dinheiro para abertura do caixa.</p><Input disabled={salvando} label="Saldo Inicial (R$)" placeholder="0,00" value={saldoAbertura} onChange={(e) => setSaldoAbertura(e.target.value)} /></div></Modal>
    <Modal open={fecharModal} onClose={() => !salvando && setFecharModal(false)} title="Fechar Caixa" size="sm" footer={<><Button variant="ghost" disabled={salvando} onClick={() => setFecharModal(false)}>Cancelar</Button><Button variant="destructive" disabled={salvando} onClick={fechar}>{salvando ? "Fechando..." : "Confirmar Fechamento"}</Button></>}><div className="flex flex-col gap-4"><p className="text-sm mb-2" style={{ color: "var(--muted-foreground)" }}>Resumo do período:</p>{resumo.map((row) => <div key={row.label} className="flex justify-between text-sm py-2" style={{ borderBottom: "1px solid var(--border)" }}><span style={{ color: "var(--muted-foreground)" }}>{row.label}</span><span className={row.bold ? "font-bold" : "font-medium"}>{row.value}</span></div>)}</div></Modal>
  </div>;
}
