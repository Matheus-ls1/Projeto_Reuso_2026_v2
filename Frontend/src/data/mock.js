// Mock data realístico em português brasileiro
export const mockProdutos = [
    { id: "P001", sku: "CAF-001", nome: "Cappuccino 300ml", categoria: "Bebidas", preco: 12.50, unidade: "UN", estoque: 0, estoqueMinimo: 10, status: "Ativo", alergenos: "Leite" },
    { id: "P002", sku: "CAF-002", nome: "Latte Macchiato", categoria: "Bebidas", preco: 14.00, unidade: "UN", estoque: 18, estoqueMinimo: 10, status: "Ativo", alergenos: "Leite" },
    { id: "P003", sku: "PAD-001", nome: "Pão de Queijo", categoria: "Padaria", preco: 4.50, unidade: "UN", estoque: 45, estoqueMinimo: 20, status: "Ativo", alergenos: "Leite, Glúten" },
    { id: "P004", sku: "DOC-001", nome: "Brownie de Chocolate", categoria: "Doces", preco: 8.00, unidade: "UN", estoque: 5, estoqueMinimo: 12, status: "Ativo", alergenos: "Leite, Glúten, Ovo" },
    { id: "P005", sku: "BEB-001", nome: "Suco de Laranja 300ml", categoria: "Bebidas", preco: 9.00, unidade: "UN", estoque: 30, estoqueMinimo: 15, status: "Ativo", alergenos: "" },
    { id: "P006", sku: "CAF-003", nome: "Espresso Duplo", categoria: "Bebidas", preco: 7.00, unidade: "UN", estoque: 50, estoqueMinimo: 20, status: "Ativo", alergenos: "" },
    { id: "P007", sku: "SNK-001", nome: "Croissant de Presunto", categoria: "Salgados", preco: 11.00, unidade: "UN", estoque: 8, estoqueMinimo: 10, status: "Ativo", alergenos: "Glúten, Leite" },
    { id: "P008", sku: "DOC-002", nome: "Fatia de Bolo de Cenoura", categoria: "Doces", preco: 6.50, unidade: "UN", estoque: 12, estoqueMinimo: 8, status: "Ativo", alergenos: "Glúten, Ovo" },
];
export const mockInsumos = [
    { id: "I001", codigo: "INS-001", nome: "Café em Grãos", categoria: "Matéria-Prima", unidade: "kg", quantidade: 15, estoqueMinimo: 10, fornecedor: "Café Brasil Ltda", lote: "L2026-08", validade: "31/12/2026", status: "Ativo" },
    { id: "I002", codigo: "INS-002", nome: "Leite Integral", categoria: "Laticínios", unidade: "L", quantidade: 3, estoqueMinimo: 20, fornecedor: "Laticínios Norte", lote: "L2026-08B", validade: "25/08/2026", status: "Ativo" },
    { id: "I003", codigo: "INS-003", nome: "Farinha de Trigo", categoria: "Matéria-Prima", unidade: "kg", quantidade: 25, estoqueMinimo: 15, fornecedor: "Moinho São Paulo", lote: "L2026-07", validade: "01/03/2027", status: "Ativo" },
    { id: "I004", codigo: "INS-004", nome: "Açúcar Refinado", categoria: "Matéria-Prima", unidade: "kg", quantidade: 18, estoqueMinimo: 10, fornecedor: "Usina Central", lote: "L2026-06", validade: "30/06/2027", status: "Ativo" },
    { id: "I005", codigo: "INS-005", nome: "Chocolate em Pó", categoria: "Matéria-Prima", unidade: "kg", quantidade: 4, estoqueMinimo: 5, fornecedor: "Cacau Premium", lote: "L2026-08", validade: "15/08/2027", status: "Ativo" },
];
export const mockFornecedores = [
    { id: "F001", nome: "Café Brasil Ltda", cnpj: "12.345.678/0001-90", contato: "Carlos Mendes", telefone: "(11) 98765-4321", email: "comercial@cafebrasil.com.br", status: "Ativo" },
    { id: "F002", nome: "Laticínios Norte S/A", cnpj: "23.456.789/0001-01", contato: "Ana Paula Costa", telefone: "(21) 97654-3210", email: "vendas@laticiniosnorte.com.br", status: "Ativo" },
    { id: "F003", nome: "Moinho São Paulo", cnpj: "34.567.890/0001-12", contato: "Roberto Lima", telefone: "(11) 96543-2109", email: "pedidos@moinhosaopaulo.com.br", status: "Ativo" },
    { id: "F004", nome: "Usina Central Açúcar", cnpj: "45.678.901/0001-23", contato: "Fernanda Alves", telefone: "(19) 95432-1098", email: "comercial@usinacentral.com.br", status: "Ativo" },
    { id: "F005", nome: "Cacau Premium Ltda", cnpj: "56.789.012/0001-34", contato: "Marcelo Torres", telefone: "(11) 94321-0987", email: "vendas@cacaupremium.com.br", status: "Inativo" },
];
export const mockPedidos = [
    { id: "PC001", numero: "PC-2026-047", fornecedor: "Laticínios Norte S/A", data: "15/08/2026", previsao: "18/08/2026", valorTotal: 420.00, status: "Em Trânsito", itens: [
            { produto: "Leite Integral", qtdPedida: 40, qtdRecebida: 0, unidade: "L", precoUn: 5.50, lote: "", validade: "" },
            { produto: "Queijo Minas", qtdPedida: 5, qtdRecebida: 0, unidade: "kg", precoUn: 36.00, lote: "", validade: "" },
        ] },
    { id: "PC002", numero: "PC-2026-046", fornecedor: "Café Brasil Ltda", data: "12/08/2026", previsao: "16/08/2026", valorTotal: 780.00, status: "Recebido", itens: [
            { produto: "Café em Grãos", qtdPedida: 20, qtdRecebida: 20, unidade: "kg", precoUn: 39.00, lote: "L2026-08", validade: "31/12/2026" },
        ] },
    { id: "PC003", numero: "PC-2026-045", fornecedor: "Moinho São Paulo", data: "10/08/2026", previsao: "14/08/2026", valorTotal: 275.00, status: "Parcialmente Recebido", itens: [
            { produto: "Farinha de Trigo", qtdPedida: 50, qtdRecebida: 30, unidade: "kg", precoUn: 5.50, lote: "L2026-07", validade: "01/03/2027" },
        ] },
    { id: "PC004", numero: "PC-2026-044", fornecedor: "Cacau Premium Ltda", data: "08/08/2026", previsao: "12/08/2026", valorTotal: 320.00, status: "Cancelado", itens: [
            { produto: "Chocolate em Pó", qtdPedida: 10, qtdRecebida: 0, unidade: "kg", precoUn: 32.00, lote: "", validade: "" },
        ] },
];
export const mockVendas = [
    { id: "V001", numero: "V-2026-1089", data: "18/08/2026", hora: "09:32", operador: "Beatriz Santos", itens: 3, total: 34.50, pagamento: "PIX", status: "Concluída" },
    { id: "V002", numero: "V-2026-1088", data: "18/08/2026", hora: "09:15", operador: "Beatriz Santos", itens: 1, total: 12.50, pagamento: "Cartão", status: "Concluída" },
    { id: "V003", numero: "V-2026-1087", data: "18/08/2026", hora: "08:58", operador: "Beatriz Santos", itens: 4, total: 47.00, pagamento: "Dinheiro", status: "Concluída" },
    { id: "V004", numero: "V-2026-1086", data: "18/08/2026", hora: "08:40", operador: "Beatriz Santos", itens: 2, total: 23.00, pagamento: "PIX", status: "Concluída" },
    { id: "V005", numero: "V-2026-1085", data: "17/08/2026", hora: "16:22", operador: "Paulo Rodrigues", itens: 2, total: 28.50, pagamento: "Cartão", status: "Cancelada" },
];
export const mockContasPagar = [
    { id: "CP001", descricao: "Aluguel — Agosto 2026", categoria: "Aluguel", fornecedor: "", vencimento: "20/08/2026", valor: 3800.00, status: "Pendente" },
    { id: "CP002", descricao: "Fornecimento de Leite — Laticínios Norte", categoria: "Insumos", fornecedor: "Laticínios Norte S/A", vencimento: "18/08/2026", valor: 420.00, status: "Vencido" },
    { id: "CP003", descricao: "Energia Elétrica — Julho 2026", categoria: "Utilidades", fornecedor: "", vencimento: "10/08/2026", valor: 680.00, status: "Pago" },
    { id: "CP004", descricao: "Café em Grãos — Café Brasil", categoria: "Insumos", fornecedor: "Café Brasil Ltda", vencimento: "25/08/2026", valor: 780.00, status: "Pendente" },
    { id: "CP005", descricao: "Internet e Telefone — Agosto", categoria: "Utilidades", fornecedor: "", vencimento: "22/08/2026", valor: 189.90, status: "Pendente" },
    { id: "CP006", descricao: "Sistema ERP — Licença Mensal", categoria: "Tecnologia", fornecedor: "", vencimento: "05/08/2026", valor: 299.00, status: "Pago" },
];
export const mockContasReceber = [
    { id: "CR001", descricao: "Evento Corporativo — Empresa ABC", categoria: "Serviços", cliente: "Empresa ABC Ltda", vencimento: "20/08/2026", valor: 1200.00, status: "Pendente" },
    { id: "CR002", descricao: "Catering — Evento XYZ", categoria: "Catering", cliente: "XYZ Eventos", vencimento: "15/08/2026", valor: 850.00, status: "Recebido" },
    { id: "CR003", descricao: "Contrato Mensal — Escritório Oliveira", categoria: "Contrato", cliente: "Escritório Oliveira & Associados", vencimento: "28/08/2026", valor: 600.00, status: "Pendente" },
    { id: "CR004", descricao: "Catering — Aniversário Silva", categoria: "Catering", cliente: "Família Silva", vencimento: "10/08/2026", valor: 320.00, status: "Vencido" },
];
export const mockMovEstoque = [
    { id: "ME001", data: "18/08/2026", hora: "09:32", produto: "Cappuccino 300ml", tipo: "Saída", quantidade: 3, lote: "", responsavel: "Sistema (Venda V-2026-1089)", motivo: "Venda" },
    { id: "ME002", data: "16/08/2026", hora: "14:10", produto: "Café em Grãos", tipo: "Entrada", quantidade: 20, lote: "L2026-08", responsavel: "Roberto Silva", motivo: "Recebimento PC-2026-046" },
    { id: "ME003", data: "15/08/2026", hora: "08:00", produto: "Leite Integral", tipo: "Ajuste", quantidade: -2, lote: "", responsavel: "Maria Costa", motivo: "Perda por vencimento" },
    { id: "ME004", data: "14/08/2026", hora: "11:30", produto: "Farinha de Trigo", tipo: "Entrada", quantidade: 30, lote: "L2026-07", responsavel: "Roberto Silva", motivo: "Recebimento parcial PC-2026-045" },
];
export const mockAvisos = [
    { id: "AV001", titulo: "Fechamento antecipado — 20/08", corpo: "Informamos que no dia 20/08/2026 (quinta-feira) o estabelecimento fechará às 16h em razão de manutenção preventiva dos equipamentos.", prioridade: "Alta", publico: "Todos", inicio: "17/08/2026", fim: "20/08/2026", status: "Publicado" },
    { id: "AV002", titulo: "Novo cardápio de outono a partir de setembro", corpo: "A partir de 01/09/2026 novos produtos serão disponibilizados no cardápio. Confira a lista atualizada com a gerência.", prioridade: "Média", publico: "Operação", inicio: "18/08/2026", fim: "31/08/2026", status: "Publicado" },
    { id: "AV003", titulo: "Reunião de equipe — 22/08 às 09h", corpo: "Todos os colaboradores estão convocados para a reunião mensal de alinhamento.", prioridade: "Alta", publico: "Todos", inicio: "18/08/2026", fim: "22/08/2026", status: "Publicado" },
    { id: "AV004", titulo: "Política de uniformes atualizada", corpo: "A partir de setembro, o uso do crachá passa a ser obrigatório durante todo o turno.", prioridade: "Baixa", publico: "Todos", inicio: "01/09/2026", fim: "30/09/2026", status: "Rascunho" },
];
export const mockUsuarios = [
    { id: "U001", nome: "João Alves", email: "joao.alves@amtsolution.com.br", cargo: "Proprietário", perfil: "Administrador", status: "Ativo", iniciais: "JA" },
    { id: "U002", nome: "Carla Mendonça", email: "carla.m@amtsolution.com.br", cargo: "Gerente de Operações", perfil: "Gerente", status: "Ativo", iniciais: "CM" },
    { id: "U003", nome: "Beatriz Santos", email: "beatriz.s@amtsolution.com.br", cargo: "Atendente", perfil: "Operador de Caixa", status: "Ativo", iniciais: "BS" },
    { id: "U004", nome: "Roberto Silva", email: "roberto.s@amtsolution.com.br", cargo: "Auxiliar de Estoque", perfil: "Estoque/Compras", status: "Ativo", iniciais: "RS" },
    { id: "U005", nome: "Fernanda Lopes", email: "fernanda.l@amtsolution.com.br", cargo: "Analista Financeiro", perfil: "Financeiro", status: "Ativo", iniciais: "FL" },
    { id: "U006", nome: "Paulo Rodrigues", email: "paulo.r@amtsolution.com.br", cargo: "Atendente", perfil: "Operador de Caixa", status: "Inativo", iniciais: "PR" },
];
// Dados para gráficos
export const mockFaturamentoSemanal = [
    { dia: "Seg", valor: 1820 },
    { dia: "Ter", valor: 2100 },
    { dia: "Qua", valor: 1750 },
    { dia: "Qui", valor: 2430 },
    { dia: "Sex", valor: 3200 },
    { dia: "Sáb", valor: 3850 },
    { dia: "Dom", valor: 2900 },
];
export const mockFluxoCaixa = Array.from({ length: 30 }, (_, i) => ({
    dia: `${String(i + 1).padStart(2, "0")}/08`,
    receitas: Math.round(1500 + Math.random() * 2500),
    despesas: Math.round(800 + Math.random() * 1200),
}));
export const mockReceitasDespesas = [
    { mes: "Set/25", receitas: 32400, despesas: 24100 },
    { mes: "Out/25", receitas: 34800, despesas: 25200 },
    { mes: "Nov/25", receitas: 41200, despesas: 27800 },
    { mes: "Dez/25", receitas: 58900, despesas: 32100 },
    { mes: "Jan/26", receitas: 29400, despesas: 22700 },
    { mes: "Fev/26", receitas: 31100, despesas: 23400 },
    { mes: "Mar/26", receitas: 35600, despesas: 24800 },
    { mes: "Abr/26", receitas: 33200, despesas: 24100 },
    { mes: "Mai/26", receitas: 37800, despesas: 25900 },
    { mes: "Jun/26", receitas: 39100, despesas: 27200 },
    { mes: "Jul/26", receitas: 42300, despesas: 28700 },
    { mes: "Ago/26", receitas: 44600, despesas: 29800 },
];
export const mockDespesasCat = [
    { name: "Insumos", value: 12400 },
    { name: "Pessoal", value: 8900 },
    { name: "Aluguel", value: 3800 },
    { name: "Utilidades", value: 1870 },
    { name: "Tecnologia", value: 899 },
    { name: "Outros", value: 1931 },
];
export const formatCurrency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
