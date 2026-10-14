import { request, toApiDate, toDisplayDate, statusLabel } from "./api";
// Adapta nomes, prioridades e datas entre a resposta da API e os campos da tela de avisos.
const map = (a) => ({
  ...a,
  prioridade:
    { ALTA: "Alta", MEDIA: "Média", BAIXA: "Baixa" }[a.prioridade] ||
    a.prioridade,
  inicio: toDisplayDate(a.inicio),
  fim: toDisplayDate(a.fim),
  status: statusLabel(a.situacao),
});
const payload = (a) => ({
  // Envia ao backend apenas o formato esperado pelo DTO de aviso.
  titulo: a.titulo,
  corpo: a.corpo,
  tipo: a.tipo || "MANUAL",
  prioridade:
    { Alta: "ALTA", Média: "MEDIA", Baixa: "BAIXA" }[a.prioridade] ||
    a.prioridade,
  publico: a.publico,
  inicio: toApiDate(a.inicio),
  fim: toApiDate(a.fim),
  situacao:
    a.situacao ||
    { Rascunho: "RASCUNHO", Publicado: "PUBLICADO", Arquivado: "ARQUIVADO" }[
      a.status
    ] ||
    "RASCUNHO",
  chaveEvento: a.chaveEvento || null,
  produtoOrigemId: a.produtoOrigemId || null,
  contaPagarOrigemId: a.contaPagarOrigemId || null,
  criadoPorUsuarioId: a.criadoPorUsuarioId || null,
});
export const avisosService = {
  listar: async () => (await request("/avisos")).map(map),
  criar: async (a) =>
    map(await request("/avisos", { method: "POST", body: payload(a) })),
  atualizar: async (id, a) =>
    map(await request(`/avisos/${id}`, { method: "PUT", body: payload(a) })),
  excluir: (id) => request(`/avisos/${id}`, { method: "DELETE" }),
};
