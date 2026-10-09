import { useEffect, useState } from "react";
import { Plus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import Badge from "../components/ui/Badge";
import { toast } from "../components/ui/Toast";
import { usuariosService } from "../services/usuariosService";
const perfilModulos = {
    "Administrador": ["Dashboard", "Vendas", "Caixa", "Produtos e Insumos", "Estoque", "Fornecedores", "Pedidos de Compra", "Visão Financeira", "Contas a Pagar", "Contas a Receber", "Relatórios", "Avisos", "Usuários", "Permissões e Módulos"],
    "Gerente": ["Dashboard", "Vendas", "Caixa", "Produtos e Insumos", "Estoque", "Fornecedores", "Pedidos de Compra", "Visão Financeira", "Relatórios", "Avisos"],
    "Operador de Caixa": ["Vendas", "Caixa"],
    "Estoque/Compras": ["Produtos e Insumos", "Estoque", "Fornecedores", "Pedidos de Compra"],
    "Financeiro": ["Visão Financeira", "Contas a Pagar", "Contas a Receber", "Relatórios"],
};
export default function Usuarios() {
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [drawer, setDrawer] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [desativarModal, setDesativarModal] = useState(false);
    const [usuarioPara, setUsuarioPara] = useState(null);
    const [form, setForm] = useState({ nome: "", email: "", cargo: "", perfil: "Operador de Caixa", status: "Ativo", senha: "" });
    const [usuarios, setUsuarios] = useState([]);
    const carregar = async () => { try { setUsuarios(await usuariosService.listar()); } catch (error) { toast(error.message, "error"); } };
    useEffect(() => { carregar(); }, []);
    const dados = usuarios.filter((u) => u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase()));
    const modulosDoPerfilSelecionado = perfilModulos[form.perfil] || [];
    const cols = [
        { key: "nome", header: "Nome", render: (r) => (<div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center rounded-full text-xs font-semibold text-white flex-shrink-0" style={{ width: 30, height: 30, background: "var(--primary)" }}>
          {r.iniciais}
        </div>
        <div>
          <p className="text-sm font-medium">{r.nome}</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{r.email}</p>
        </div>
      </div>) },
        { key: "cargo", header: "Cargo" },
        { key: "perfil", header: "Perfil", render: (r) => <Badge color="brand">{r.perfil}</Badge> },
        { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status}/> },
        { key: "acoes", header: "Ações", render: (r) => (<div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditItem(r); setForm({ nome: r.nome, email: r.email, cargo: r.cargo, perfil: r.perfil, status: r.status }); setDrawer(true); }}>
          Editar
        </Button>
        {r.status === "Ativo" && (<Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setUsuarioPara(r); setDesativarModal(true); }}>
            Desativar
          </Button>)}
      </div>) },
    ];
    const salvar = async () => { if (!form.nome || !form.email || !form.cargo) return toast("Preencha os campos obrigatórios.", "error"); try { editItem ? await usuariosService.atualizar(editItem.id, form) : await usuariosService.criar(form); await carregar(); setDrawer(false); toast(`Usuário ${editItem ? "atualizado" : "criado"} com sucesso.`, "success"); } catch (error) { toast(error.message, "error"); } };
    return (<div className="flex flex-col h-full">
      <TopBar title="Usuários" breadcrumbs={["Administração"]}/>
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader title="Usuários" subtitle="Gerencie os usuários e perfis de acesso" actions={<Button variant="primary" icon={<Plus size={15}/>} onClick={() => { setEditItem(null); setForm({ nome: "", email: "", cargo: "", perfil: "Operador de Caixa", status: "Ativo" }); setDrawer(true); }}>
              Novo Usuário
            </Button>}/>
        <FilterBar search={busca} onSearchChange={setBusca} placeholder="Buscar por nome ou e-mail..."/>
        <DataTable columns={cols} data={dados} emptyMessage="Nenhum usuário encontrado."/>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title={editItem ? "Editar Usuário" : "Novo Usuário"} footer={<>
            <Button variant="ghost" onClick={() => setDrawer(false)}>Cancelar</Button>
            <Button variant="primary" onClick={salvar}>Salvar</Button>
          </>}>
        <div className="flex flex-col gap-4">
          <Input label="Nome completo" placeholder="Nome do usuário" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}/>
          <Input label="E-mail" type="email" placeholder="email@empresa.com.br" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          <Input label="Cargo" placeholder="Ex: Atendente, Gerente" value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })}/>
          <Select label="Perfil de Acesso" value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value })} options={[
            { value: "Administrador", label: "Administrador" },
            { value: "Gerente", label: "Gerente" },
            { value: "Operador de Caixa", label: "Operador de Caixa" },
            { value: "Estoque/Compras", label: "Estoque/Compras" },
            { value: "Financeiro", label: "Financeiro" },
        ]}/>
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={[{ value: "Ativo", label: "Ativo" }, { value: "Inativo", label: "Inativo" }]}/>

          {/* Módulos do perfil */}
          <div className="p-3 rounded-xl" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
              Módulos disponíveis para o perfil "{form.perfil}"
            </p>
            <div className="flex flex-wrap gap-1.5">
              {modulosDoPerfilSelecionado.map((m) => (<Badge key={m} color="blue" size="sm">{m}</Badge>))}
            </div>
          </div>

          {/* Botão permissões avançadas */}
          <Button variant="outline" icon={<Shield size={14}/>} onClick={() => { setDrawer(false); navigate("/permissoes"); }}>
            Configurar permissões avançadas
          </Button>
        </div>
      </Drawer>

      <ConfirmDialog open={desativarModal} onClose={() => setDesativarModal(false)} onConfirm={async () => { try { await usuariosService.desativar(usuarioPara.id); await carregar(); setDesativarModal(false); toast(`Usuário "${usuarioPara.nome}" desativado.`, "success"); } catch (error) { toast(error.message, "error"); } }} title="Desativar usuário" message={`Tem certeza que deseja desativar "${usuarioPara?.nome}"? O usuário perderá acesso ao sistema.`} confirmLabel="Desativar"/>
    </div>);
}
