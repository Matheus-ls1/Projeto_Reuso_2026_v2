import { request } from "./api";
// Faz a ponte entre documento/ativo da API e CNPJ/status exibidos no formulário.
const map = (f) => ({
  ...f,
  cnpj: f.documento,
  status: f.ativo ? "Ativo" : "Inativo",
});
const payload = (f) => ({
  nome: f.nome,
  documento: f.cnpj,
  contato: f.contato,
  telefone: f.telefone,
  email: f.email,
  ativo: f.status === "Ativo",
});
export const fornecedoresService = {
  // Reúne as operações HTTP para que a tela não conheça detalhes das rotas REST.
  listar: async () => (await request("/fornecedores")).map(map),
  criar: async (f) => map(await request("/fornecedores", { method: "POST", body: payload(f) })),
  atualizar: async (id, f) =>
    map(
      await request(`/fornecedores/${id}`, { method: "PUT", body: payload(f) }),
    ),
  alterarStatus: async (id, ativo) =>
    map(
      await request(`/fornecedores/${id}/ativo`, {
        method: "PATCH",
        body: { ativo },
      }),
    ),
  excluir: (id) => request(`/fornecedores/${id}`, { method: "DELETE" }),
};
