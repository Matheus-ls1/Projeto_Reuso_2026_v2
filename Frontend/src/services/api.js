const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.erro || body.message || "Não foi possível concluir a operação.");
    }
    return response.status === 204 ? null : response.json();
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Não foi possível conectar ao backend. Verifique se ele está em execução.");
    throw error;
  }
}

export const toApiDate = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const [day, month, year] = value.split("/");
  return day && month && year ? `${year}-${month}-${day}` : value;
};

export const toDisplayDate = (value) => value ? value.split("-").reverse().join("/") : "";
export const toNumber = (value) => Number(String(value || "0").replace(".", "").replace(",", "."));
export const statusLabel = (value) => ({ PENDENTE: "Pendente", PAGO: "Pago", RECEBIDO: "Recebido", VENCIDO: "Vencido", CANCELADO: "Cancelado", RASCUNHO: "Rascunho", PUBLICADO: "Publicado", ARQUIVADO: "Arquivado" }[value] || value);
