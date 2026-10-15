import {
  request,
  toApiDate,
  toDisplayDate,
  toNumber,
  statusLabel,
} from "./api";
import { criarOperacoesFinanceirasComuns } from "./operacoesFinanceirasComuns";
// Converte a conta recebida da API para o formato apresentado pela tela.
const map = (c) => ({
  ...c,
  valor: c.valorOriginal,
  vencimento: toDisplayDate(c.vencimento),
  dataRecebimento: toDisplayDate(c.dataRecebimento),
  formaPag: c.formaRecebimento || "PIX",
  status: statusLabel(c.situacao),
});
const payload = (c) => ({
  // Mantém a conversão de valores e datas em um único ponto antes da persistência.
  descricao: c.descricao,
  categoria: c.categoria,
  cliente: c.cliente,
  vencimento: toApiDate(c.vencimento),
  valorOriginal: toNumber(c.valor),
  estrategiaDesconto: c.estrategiaDesconto || "SEM_DESCONTO",
  percentualDesconto: toNumber(c.percentualDesconto),
  valorDesconto: toNumber(c.valorDesconto),
  situacao: c.situacao || (c.status === "Recebido" ? "RECEBIDO" : "PENDENTE"),
  dataRecebimento: toApiDate(c.dataRecebimento),
  valorRecebido: c.valorRecebido ? toNumber(c.valorRecebido) : null,
  formaRecebimento: c.formaPag || null,
  observacao: c.observacao || null,
});
export const contasReceberService = {
  ...criarOperacoesFinanceirasComuns("/contas-receber", map, payload),
  simularDescontos: (id, estrategia, parametro, dias) =>
    request(
      `/contas-receber/${id}/simulacao-descontos?${new URLSearchParams({ estrategia, parametro: toNumber(parametro), dias: Number(dias) })}`,
    ),
};
