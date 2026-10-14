import { request } from "./api";
// Traduz o status de persistência e deriva as iniciais usadas no avatar da tabela.
const map = (u) => ({
  ...u,
  status: u.ativo ? "Ativo" : "Inativo",
  iniciais: u.nome
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase(),
});
const payload = (u) => ({
  // Senha vazia é enviada como nula para que o backend preserve o hash existente na edição.
  nome: u.nome,
  email: u.email,
  cargo: u.cargo,
  perfil: u.perfil,
  senha: u.senha || null,
  ativo: u.status === "Ativo",
});
export const usuariosService = {
  listar: async () => (await request("/usuarios")).map(map),
  criar: async (u) =>
    map(await request("/usuarios", { method: "POST", body: payload(u) })),
  atualizar: async (id, u) =>
    map(await request(`/usuarios/${id}`, { method: "PUT", body: payload(u) })),
  alterarStatus: async (id, ativo) =>
    map(
      await request(`/usuarios/${id}/ativo`, {
        method: "PATCH",
        body: { ativo },
      }),
    ),
  excluir: (id) => request(`/usuarios/${id}`, { method: "DELETE" }),
};
