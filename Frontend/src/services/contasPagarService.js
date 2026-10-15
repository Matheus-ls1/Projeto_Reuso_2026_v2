import {
  request,
  toApiDate,
  toDisplayDate,
  toNumber,
  statusLabel,
} from "./api";
import { criarOperacoesFinanceirasComuns } from "./operacoesFinanceirasComuns";
// Converte a conta persistida para os nomes usados no formulário financeiro.
const map = (c) => ({
  ...c,
  fornecedor: c.fornecedor?.nome || "",
  fornecedorId: c.fornecedor?.id || "",
  valor: c.valorOriginal,
  vencimento: toDisplayDate(c.vencimento),
  dataPagamento: toDisplayDate(c.dataPagamento),
  formaPag: c.formaPagamento || "PIX",
  status: statusLabel(c.situacao),
});
const payload = (c) => ({
  // Normaliza valores monetários, datas e fornecedor antes da requisição.
  descricao: c.descricao,
  categoria: c.categoria,
  fornecedorId: c.fornecedorId ? Number(c.fornecedorId) : null,
  vencimento: toApiDate(c.vencimento),
  valorOriginal: toNumber(c.valor),
  estrategiaEncargo: c.estrategiaEncargo || "SEM_ENCARGO",
  percentualJuros: toNumber(c.percentualJuros),
  percentualMulta: toNumber(c.percentualMulta),
  valorEncargos: toNumber(c.valorEncargos),
  situacao: c.situacao || (c.status === "Pago" ? "PAGO" : "PENDENTE"),
  dataPagamento: toApiDate(c.dataPagamento),
  valorPago: c.valorPago ? toNumber(c.valorPago) : null,
  formaPagamento: c.formaPag || null,
  observacao: c.observacao || null,
});
export const contasPagarService = {
  ...criarOperacoesFinanceirasComuns("/contas-pagar", map, payload),
  simularEncargos: (id, estrategia, percentual, dias) =>
    request(
      `/contas-pagar/${id}/simulacao-encargos?${new URLSearchParams({ estrategia, percentual: toNumber(percentual), dias: Number(dias) })}`,
    ),
  verificarVencimentos: () =>
    request("/contas-pagar/verificar-vencimentos", { method: "POST" }),
};
