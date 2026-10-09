import Badge from "./Badge";
const statusMap = {
    ativo: { color: "green", label: "Ativo" },
    inativo: { color: "gray", label: "Inativo" },
    pendente: { color: "orange", label: "Pendente" },
    pago: { color: "green", label: "Pago" },
    recebido: { color: "green", label: "Recebido" },
    vencido: { color: "red", label: "Vencido" },
    cancelado: { color: "red", label: "Cancelado" },
    rascunho: { color: "gray", label: "Rascunho" },
    enviado: { color: "blue", label: "Enviado" },
    "em trânsito": { color: "purple", label: "Em Trânsito" },
    "parcialmente recebido": { color: "orange", label: "Parc. Recebido" },
    "recebido ": { color: "green", label: "Recebido" },
    aberto: { color: "green", label: "Aberto" },
    fechado: { color: "gray", label: "Fechado" },
    publicado: { color: "green", label: "Publicado" },
    arquivado: { color: "gray", label: "Arquivado" },
    ok: { color: "green", label: "OK" },
    baixo: { color: "orange", label: "Baixo" },
    "crítico": { color: "red", label: "Crítico" },
};
export default function StatusBadge({ status }) {
    const key = status.toLowerCase();
    const config = statusMap[key] || { color: "gray" };
    return <Badge color={config.color}>{config.label || status}</Badge>;
}
