import { useState } from "react";
import { ShoppingCart, CreditCard, Package, Boxes, Truck, ClipboardList, TrendingUp, ArrowDownCircle, ArrowUpCircle, Bell, BarChart3, Users, Shield, LayoutDashboard, Lock, Construction } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import Badge from "../components/ui/Badge";
import { toast } from "../components/ui/Toast";
const perfis = ["Administrador", "Gerente", "Operador de Caixa", "Estoque/Compras", "Financeiro"];
const acoes = ["Visualizar", "Criar", "Editar", "Excluir", "Aprovar", "Exportar"];
const modulosPermissao = [
    "Dashboard", "Vendas", "Caixa", "Produtos e Insumos", "Estoque",
    "Fornecedores", "Pedidos de Compra", "Visão Financeira",
    "Contas a Pagar", "Contas a Receber", "Relatórios", "Avisos", "Usuários", "Permissões e Módulos"
];
const permissoesIniciais = {
    "Administrador": Object.fromEntries(modulosPermissao.map((m) => [m, Object.fromEntries(acoes.map((a) => [a, true]))])),
    "Gerente": Object.fromEntries(modulosPermissao.map((m) => {
        const semAdmin = ["Usuários", "Permissões e Módulos"].includes(m);
        return [m, Object.fromEntries(acoes.map((a) => [a, !semAdmin]))];
    })),
    "Operador de Caixa": Object.fromEntries(modulosPermissao.map((m) => {
        const permitido = ["Vendas", "Caixa"].includes(m);
        return [m, Object.fromEntries(acoes.map((a) => [a, permitido && ["Visualizar", "Criar"].includes(a)]))];
    })),
    "Estoque/Compras": Object.fromEntries(modulosPermissao.map((m) => {
        const permitido = ["Produtos e Insumos", "Estoque", "Fornecedores", "Pedidos de Compra"].includes(m);
        return [m, Object.fromEntries(acoes.map((a) => [a, permitido]))];
    })),
    "Financeiro": Object.fromEntries(modulosPermissao.map((m) => {
        const permitido = ["Visão Financeira", "Contas a Pagar", "Contas a Receber", "Relatórios"].includes(m);
        return [m, Object.fromEntries(acoes.map((a) => [a, permitido && a !== "Excluir"]))];
    })),
};
const modulosEmpresa = [
    { key: "dashboard", label: "Dashboard", descricao: "Painel geral com indicadores e resumos", icon: LayoutDashboard, ativo: true },
    { key: "vendas", label: "Vendas (PDV)", descricao: "Ponto de venda e registro de transações", icon: ShoppingCart, ativo: true },
    { key: "caixa", label: "Caixa", descricao: "Abertura, movimentações e fechamento de caixa", icon: CreditCard, ativo: true },
    { key: "produtos", label: "Produtos e Insumos", descricao: "Cadastro de produtos para venda e insumos de produção", icon: Package, ativo: true },
    { key: "estoque", label: "Estoque", descricao: "Controle de saldo, movimentações e alertas", icon: Boxes, ativo: true },
    { key: "fornecedores", label: "Fornecedores", descricao: "Cadastro e histórico de fornecedores", icon: Truck, ativo: true },
    { key: "pedidos", label: "Pedidos de Compra", descricao: "Criação e acompanhamento de pedidos", icon: ClipboardList, ativo: true },
    { key: "financeiro", label: "Visão Financeira", descricao: "Dashboard financeiro com receitas, despesas e fluxo de caixa", icon: TrendingUp, ativo: true },
    { key: "contas-pagar", label: "Contas a Pagar", descricao: "Gerenciamento de obrigações financeiras", icon: ArrowDownCircle, ativo: true },
    { key: "contas-receber", label: "Contas a Receber", descricao: "Gerenciamento de recebíveis", icon: ArrowUpCircle, ativo: true },
    { key: "relatorios", label: "Relatórios", descricao: "Consulta e exportação de relatórios por módulo", icon: BarChart3, ativo: true },
    { key: "avisos", label: "Avisos", descricao: "Comunicados internos para a equipe", icon: Bell, ativo: true },
    { key: "usuarios", label: "Usuários", descricao: "Cadastro e gestão de usuários", icon: Users, ativo: true },
    { key: "permissoes", label: "Permissões e Módulos", descricao: "Configuração de acessos e ativação de módulos", icon: Shield, ativo: true },
    { key: "producao", label: "Produção", descricao: "Gestão de fichas técnicas e ordens de produção", icon: Construction, ativo: false, futuro: true },
];
export default function PermissoesModulos() {
    const [tab, setTab] = useState("permissoes");
    const [perfilSelecionado, setPerfilSelecionado] = useState("Gerente");
    const [permissoes, setPermissoes] = useState(permissoesIniciais);
    const [modulos, setModulos] = useState(modulosEmpresa);
    const togglePerm = (modulo, acao) => {
        if (perfilSelecionado === "Administrador")
            return;
        setPermissoes((prev) => ({
            ...prev,
            [perfilSelecionado]: {
                ...prev[perfilSelecionado],
                [modulo]: {
                    ...prev[perfilSelecionado][modulo],
                    [acao]: !prev[perfilSelecionado][modulo][acao],
                },
            },
        }));
    };
    const toggleModulo = (key) => {
        const mod = modulos.find((m) => m.key === key);
        if (!mod || mod.futuro)
            return;
        const novoAtivo = !mod.ativo;
        setModulos((prev) => prev.map((m) => m.key === key ? { ...m, ativo: novoAtivo } : m));
        toast(novoAtivo ? `Módulo "${mod.label}" ativado.` : `Módulo "${mod.label}" desativado. Usuários perderão acesso.`, novoAtivo ? "success" : "warning");
    };
    const salvarPermissoes = () => {
        toast("Permissões salvas com sucesso.", "success");
    };
    return (<div className="flex flex-col h-full">
      <TopBar title="Permissões e Módulos" breadcrumbs={["Administração"]}/>
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader title="Permissões e Módulos" subtitle="Configure permissões por perfil e gerencie os módulos ativos"/>

        <Tabs tabs={[{ key: "permissoes", label: "Perfis e Permissões" }, { key: "modulos", label: "Módulos da Empresa" }]} active={tab} onChange={setTab}/>

        {tab === "permissoes" && (<div>
            {/* Seletor de perfil */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {perfis.map((p) => (<button key={p} onClick={() => setPerfilSelecionado(p)} className="px-4 py-2 text-sm font-medium rounded-lg transition-all" style={perfilSelecionado === p
                    ? { background: "var(--brand)", color: "white" }
                    : { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                  {p}
                </button>))}
            </div>

            {perfilSelecionado === "Administrador" && (<div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" }}>
                <Shield size={15}/>
                O perfil Administrador possui acesso total e não pode ter permissões restringidas.
              </div>)}

            {/* Matriz de permissões */}
            <div className="overflow-x-auto" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)", minWidth: 180 }}>Módulo</th>
                    {acoes.map((a) => (<th key={a} className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>{a}</th>))}
                  </tr>
                </thead>
                <tbody>
                  {modulosPermissao.map((mod, i) => (<tr key={mod} style={{ borderBottom: i < modulosPermissao.length - 1 ? "1px solid var(--border)" : undefined }}>
                      <td className="px-4 py-2.5 text-sm font-medium">{mod}</td>
                      {acoes.map((acao) => {
                    const checked = permissoes[perfilSelecionado]?.[mod]?.[acao] ?? false;
                    const isAdmin = perfilSelecionado === "Administrador";
                    return (<td key={acao} className="text-center px-3 py-2.5">
                            {isAdmin ? (<div className="flex items-center justify-center">
                                <div className="flex items-center justify-center rounded" style={{ width: 18, height: 18, background: "var(--success)", opacity: 0.9 }}>
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              </div>) : (<button onClick={() => togglePerm(mod, acao)} className="flex items-center justify-center mx-auto rounded transition-all" style={{
                                width: 18, height: 18,
                                background: checked ? "var(--primary)" : "transparent",
                                border: `1.5px solid ${checked ? "var(--primary)" : "var(--border)"}`,
                            }}>
                                {!checked && (<Lock size={9} style={{ color: "var(--muted-foreground)" }}/>)}
                                {checked && <span className="text-white" style={{ fontSize: 10 }}>✓</span>}
                              </button>)}
                          </td>);
                })}
                    </tr>))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="primary" onClick={salvarPermissoes}>Salvar Alterações</Button>
            </div>
          </div>)}

        {tab === "modulos" && (<div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {modulos.map((mod) => {
                const Icon = mod.icon;
                return (<div key={mod.key} className="flex items-center gap-4 p-4 rounded-xl" style={{
                        background: "var(--card)",
                        border: `1px solid ${mod.ativo && !mod.futuro ? "var(--border)" : "#E5E7EB"}`,
                        opacity: mod.futuro ? 0.75 : 1,
                    }}>
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{
                        width: 42, height: 42,
                        background: mod.ativo && !mod.futuro ? "var(--secondary)" : "var(--muted)",
                        color: mod.ativo && !mod.futuro ? "var(--primary)" : "var(--muted-foreground)",
                    }}>
                    <Icon size={20}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold">{mod.label}</p>
                      {mod.futuro && <Badge color="purple">Disponível futuramente</Badge>}
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{mod.descricao}</p>
                  </div>
                  <button onClick={() => toggleModulo(mod.key)} disabled={mod.futuro} className="relative rounded-full transition-colors flex-shrink-0" style={{
                        width: 42, height: 24,
                        background: mod.futuro ? "var(--muted)" : mod.ativo ? "var(--primary)" : "var(--border)",
                        cursor: mod.futuro ? "not-allowed" : "pointer",
                    }} title={mod.futuro ? "Módulo não disponível" : mod.ativo ? "Desativar módulo" : "Ativar módulo"}>
                    <span className="absolute top-0.5 rounded-full bg-white transition-transform" style={{
                        width: 20, height: 20,
                        left: 2,
                        transform: mod.ativo && !mod.futuro ? "translateX(18px)" : "translateX(0)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}/>
                  </button>
                </div>);
            })}
          </div>)}
      </div>
    </div>);
}
