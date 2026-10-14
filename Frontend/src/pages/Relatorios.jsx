import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import TopBar from "../components/layout/TopBar";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import {
  mockVendas,
  mockMovEstoque,
  mockPedidos,
  mockContasPagar,
  mockContasReceber,
  formatCurrency,
} from "../data/mock";
import { toast } from "../components/ui/Toast";
export default function Relatorios() {
  const [tab, setTab] = useState("vendas");
  const [periodoInicio, setPeriodoInicio] = useState("01/08/2026");
  const [periodoFim, setPeriodoFim] = useState("19/08/2026");
  const exportar = (tipo) => {
    toast(
      `Relatório exportado em ${tipo === "pdf" ? "PDF" : "Excel"}.`,
      "success",
    );
  };
  const colsVendas = [
    {
      key: "numero",
      header: "Número",
      render: (r) => <span className="font-mono text-xs">{r.numero}</span>,
    },
    { key: "data", header: "Data" },
    { key: "hora", header: "Hora" },
    { key: "operador", header: "Operador" },
    { key: "itens", header: "Itens" },
    { key: "pagamento", header: "Pagamento" },
    {
      key: "total",
      header: "Total",
      render: (r) => (
        <span className="font-semibold">{formatCurrency(r.total)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];
  const colsMov = [
    {
      key: "data",
      header: "Data",
      render: (r) => <span className="font-mono text-xs">{r.data}</span>,
    },
    { key: "produto", header: "Produto" },
    {
      key: "tipo",
      header: "Tipo",
      render: (r) => (
        <span
          className="text-xs font-medium"
          style={{
            color:
              r.tipo === "Entrada"
                ? "var(--success)"
                : r.tipo === "Saída"
                  ? "var(--destructive)"
                  : "var(--warning)",
          }}
        >
          {r.tipo}
        </span>
      ),
    },
    { key: "quantidade", header: "Quantidade" },
    { key: "responsavel", header: "Responsável" },
    { key: "motivo", header: "Motivo" },
  ];
  const colsPedidos = [
    {
      key: "numero",
      header: "Número",
      render: (r) => <span className="font-mono text-xs">{r.numero}</span>,
    },
    { key: "fornecedor", header: "Fornecedor" },
    { key: "data", header: "Data" },
    {
      key: "valorTotal",
      header: "Valor",
      render: (r) => (
        <span className="font-semibold">{formatCurrency(r.valorTotal)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />,
    },
  ];
  const financeiroData = [
    ...mockContasPagar.map((c) => ({
      tipo: "Despesa",
      descricao: c.descricao,
      data: c.vencimento,
      valor: -c.valor,
      status: c.status,
    })),
    ...mockContasReceber.map((c) => ({
      tipo: "Receita",
      descricao: c.descricao,
      data: c.vencimento,
      valor: c.valor,
      status: c.status,
    })),
  ].sort((a, b) => a.data.localeCompare(b.data));
  const tabsConfig = [
    { key: "vendas", label: "Vendas" },
    { key: "estoque", label: "Estoque" },
    { key: "compras", label: "Compras" },
    { key: "financeiro", label: "Financeiro" },
  ];
  return (
    <div className="flex flex-col h-full">
      <TopBar title="Relatórios" breadcrumbs={["Gestão"]} />
      <div className="flex-1 overflow-y-auto p-6">
        <PageHeader
          title="Relatórios"
          subtitle="Consulte e exporte relatórios por módulo e período"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<FileText size={14} />}
                onClick={() => exportar("pdf")}
              >
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<FileSpreadsheet size={14} />}
                onClick={() => exportar("excel")}
              >
                Excel
              </Button>
            </div>
          }
        />

        {/* Filtros de período */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl mb-5"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-2">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--muted-foreground)" }}
            >
              Período:
            </label>
            <input
              type="text"
              value={periodoInicio}
              onChange={(e) => setPeriodoInicio(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg outline-none"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                width: 120,
              }}
            />
            <span
              className="text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              até
            </span>
            <input
              type="text"
              value={periodoFim}
              onChange={(e) => setPeriodoFim(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg outline-none"
              style={{
                border: "1px solid var(--border)",
                background: "var(--background)",
                width: 120,
              }}
            />
          </div>
          <Button variant="primary" size="sm">
            Aplicar
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Download size={14} style={{ color: "var(--muted-foreground)" }} />
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Exportar resultado filtrado:
            </span>
            <Button variant="ghost" size="sm" onClick={() => exportar("pdf")}>
              PDF
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportar("excel")}>
              Excel
            </Button>
          </div>
        </div>

        <Tabs tabs={tabsConfig} active={tab} onChange={setTab} />

        {tab === "vendas" && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Total de Vendas
                </p>
                <p className="text-lg font-bold">
                  {mockVendas.filter((v) => v.status === "Concluída").length}
                </p>
              </div>
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Faturamento Total
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {formatCurrency(
                    mockVendas
                      .filter((v) => v.status === "Concluída")
                      .reduce((s, v) => s + v.total, 0),
                  )}
                </p>
              </div>
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Ticket Médio
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(
                    mockVendas
                      .filter((v) => v.status === "Concluída")
                      .reduce((s, v) => s + v.total, 0) /
                      Math.max(
                        1,
                        mockVendas.filter((v) => v.status === "Concluída")
                          .length,
                      ),
                  )}
                </p>
              </div>
            </div>
            <DataTable columns={colsVendas} data={mockVendas} />
          </>
        )}

        {tab === "estoque" && (
          <DataTable
            columns={colsMov}
            data={mockMovEstoque}
            emptyMessage="Nenhuma movimentação no período."
          />
        )}

        {tab === "compras" && (
          <DataTable
            columns={colsPedidos}
            data={mockPedidos}
            emptyMessage="Nenhum pedido no período."
          />
        )}

        {tab === "financeiro" && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Total Receitas
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--success)" }}
                >
                  {formatCurrency(
                    mockContasReceber.reduce((s, c) => s + c.valor, 0),
                  )}
                </p>
              </div>
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  Total Despesas
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--destructive)" }}
                >
                  {formatCurrency(
                    mockContasPagar.reduce((s, c) => s + c.valor, 0),
                  )}
                </p>
              </div>
            </div>
            <DataTable
              columns={[
                {
                  key: "tipo",
                  header: "Tipo",
                  render: (r) => (
                    <span
                      className="text-xs font-medium"
                      style={{
                        color:
                          r.tipo === "Receita"
                            ? "var(--success)"
                            : "var(--destructive)",
                      }}
                    >
                      {r.tipo}
                    </span>
                  ),
                },
                { key: "descricao", header: "Descrição" },
                { key: "data", header: "Data" },
                {
                  key: "valor",
                  header: "Valor",
                  render: (r) => (
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          r.valor >= 0
                            ? "var(--success)"
                            : "var(--destructive)",
                      }}
                    >
                      {formatCurrency(Math.abs(r.valor))}
                    </span>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => <StatusBadge status={r.status} />,
                },
              ]}
              data={financeiroData}
            />
          </>
        )}
      </div>
    </div>
  );
}
