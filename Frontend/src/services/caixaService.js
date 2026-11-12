import { request, toNumber } from "./api";

const valorMonetario = (valor) => toNumber(valor);

export const caixaService = {
  abrir: (saldoInicial) =>
    request("/caixas", {
      method: "POST",
      body: { saldoInicial: valorMonetario(saldoInicial) },
    }),
  buscarAberto: () => request("/caixas/aberto"),
  buscar: (id) => request(`/caixas/${id}`),
  registrarEntrada: (id, valor, descricao) =>
    request(`/caixas/${id}/entradas`, {
      method: "POST",
      body: { valor: valorMonetario(valor), descricao },
    }),
  registrarSaida: (id, valor, descricao) =>
    request(`/caixas/${id}/saidas`, {
      method: "POST",
      body: { valor: valorMonetario(valor), descricao },
    }),
  listarMovimentacoes: (id) => request(`/caixas/${id}/movimentacoes`),
  fechar: (id) => request(`/caixas/${id}/fechamento`, { method: "POST" }),
};
