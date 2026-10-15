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
  // [FLUXO:FORNECEDOR_CRIAR] Fornecedores.jsx chama criar/atualizar; payload adapta os campos para FornecedorRequest.
  listar: async () => (await request("/fornecedores")).map(map),
  criar: async (f) => map(await request("/fornecedores", { method: "POST", body: payload(f) })),
  atualizar: async (id, f) =>
    map(
      await request(`/fornecedores/${id}`, { method: "PUT", body: payload(f) }),
    ),
  // [FLUXO:FORNECEDOR_DESATIVAR] PATCH preserva o cadastro e muda somente seu estado ativo.
  alterarStatus: async (id, ativo) =>
    map(
      await request(`/fornecedores/${id}/ativo`, {
        method: "PATCH",
        body: { ativo },
      }),
    ),
  // [FLUXO:FORNECEDOR_EXCLUIR] DELETE representa remoção permanente, diferente de alterarStatus.
  excluir: (id) => request(`/fornecedores/${id}`, { method: "DELETE" }),
};
