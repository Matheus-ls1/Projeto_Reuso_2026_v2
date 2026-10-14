import { request, toApiDate, toDisplayDate, toNumber } from "./api";
// Ajusta produto ou insumo para os nomes e formatos usados pela interface.
const map = (p) => ({
  ...p,
  sku: p.codigo,
  preco: p.precoVenda ?? 0,
  estoque: p.quantidadeEstoque,
  quantidade: p.quantidadeEstoque,
  estoqueMinimo: p.quantidadeMinima,
  fornecedor: p.fornecedor?.nome || "",
  fornecedorId: p.fornecedor?.id || "",
  validade: toDisplayDate(p.dataValidade),
  status: p.ativo ? "Ativo" : "Inativo",
});
const payload = (p, tipo) => ({
  // O tipo define se o preço de venda é aplicável antes de enviar o DTO.
  tipo,
  codigo: p.sku || p.codigo,
  nome: p.nome,
  categoria: p.categoria,
  unidade: p.unidade,
  precoVenda: tipo === "PRODUTO" ? toNumber(p.preco) : null,
  quantidadeEstoque: toNumber(p.estoque ?? p.quantidade),
  quantidadeMinima: toNumber(p.estoqueMinimo),
  alergenos: p.alergenos || null,
  lote: p.lote || null,
  dataValidade: toApiDate(p.validade),
  ativo: p.status !== "Inativo",
  fornecedorId: p.fornecedorId ? Number(p.fornecedorId) : null,
});
export const produtosService = {
  listar: async () => (await request("/produtos")).map(map),
  criar: async (p, tipo) =>
    map(await request("/produtos", { method: "POST", body: payload(p, tipo) })),
  atualizar: async (id, p, tipo) =>
    map(
      await request(`/produtos/${id}`, {
        method: "PUT",
        body: payload(p, tipo),
      }),
    ),
  alterarStatus: async (id, ativo) =>
    map(
      await request(`/produtos/${id}/ativo`, {
        method: "PATCH",
        body: { ativo },
      }),
    ),
  excluir: (id) => request(`/produtos/${id}`, { method: "DELETE" }),
};
