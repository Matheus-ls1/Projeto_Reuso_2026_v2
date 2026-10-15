import { request } from "./api";

// Reúne o CRUD que é igual para contas a pagar e a receber.
export const criarOperacoesFinanceirasComuns = (recurso, map, payload) => ({
  // [INFRA:HTTP] ContasPagar/ContasReceber reutilizam estas operações, que encaminham cada rota ao request().
  listar: async () => (await request(recurso)).map(map),
  criar: async (conta) =>
    map(await request(recurso, { method: "POST", body: payload(conta) })),
  atualizar: async (id, conta) =>
    map(
      await request(`${recurso}/${id}`, {
        method: "PUT",
        body: payload(conta),
      }),
    ),
  situacao: async (id, situacao) =>
    map(
      await request(`${recurso}/${id}/situacao`, {
        method: "PATCH",
        body: { situacao },
      }),
    ),
  excluir: (id) => request(`${recurso}/${id}`, { method: "DELETE" }),
});
