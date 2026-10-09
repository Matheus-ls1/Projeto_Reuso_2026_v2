import { request } from "./api";
const map = (f) => ({ ...f, cnpj: f.documento, status: f.ativo ? "Ativo" : "Inativo" });
const payload = (f) => ({ nome: f.nome, documento: f.cnpj, contato: f.contato, telefone: f.telefone, email: f.email, ativo: f.status === "Ativo" });
export const fornecedoresService = { listar: async () => (await request("/fornecedores")).map(map), criar: async (f) => map(await request("/fornecedores", { method: "POST", body: payload(f) })), atualizar: async (id, f) => map(await request(`/fornecedores/${id}`, { method: "PUT", body: payload(f) })), desativar: (id) => request(`/fornecedores/${id}`, { method: "DELETE" }) };
