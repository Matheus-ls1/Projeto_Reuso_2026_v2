# AMT Solution — Plano do Protótipo ERP

## Contexto

O usuário quer construir um protótipo navegável de um ERP modular chamado **AMT Solution** para pequenos negócios (cafeterias, restaurantes, padarias, lojas). A aplicação atual está completamente vazia (`App.tsx` retorna um `div` vazio). O objetivo é criar 15 telas principais com aparência sofisticada, profissional e moderna, inspiradas em SaaS B2B corporativos.

---

## A. Arquitetura — 15 Telas Principais

| # | Tela | Objetivo |
|---|------|----------|
| 1 | **Login** | Autenticação com e-mail/senha e link de recuperação |
| 2 | **Dashboard Geral** | Visão executiva com KPIs, gráficos, alertas e resumos |
| 3 | **PDV / Vendas** | Interface de ponto de venda rápida com busca de produtos e pagamento |
| 4 | **Caixa** | Abertura, movimentações, sangrias, reforços e fechamento de caixa |
| 5 | **Produtos e Insumos** | CRUD de produtos com SKU, categoria, preço, estoque e alergênicos |
| 6 | **Estoque** | Saldo, movimentações (entrada/saída/ajuste), lotes, validade, alertas |
| 7 | **Fornecedores** | CRUD de fornecedores com contatos e histórico de compras |
| 8 | **Pedidos de Compra** | Criar, consultar e acompanhar pedidos; recebimento gera entrada no estoque |
| 9 | **Dashboard Financeiro** | Visão de receitas, despesas, saldo, fluxo de caixa e resultado do período |
| 10 | **Contas a Pagar** | CRUD de obrigações financeiras com registro de pagamento |
| 11 | **Contas a Receber** | CRUD de recebíveis com registro de recebimento |
| 12 | **Relatórios** | Consulta de relatórios de vendas, estoque, compras, financeiro e caixa com filtros e exportação |
| 13 | **Avisos** | CRUD de comunicados internos com prioridade, público e período |
| 14 | **Usuários** | CRUD de usuários com perfil, cargo, status e módulos habilitados |
| 15 | **Permissões e Módulos** | Configuração de permissões por perfil e ativação/desativação de módulos |

---

## B. Estrutura de Navegação — Sidebar

```
🔷 AMT Solution  [logo + collapse toggle]

  Dashboard

  ─── OPERAÇÃO ───
  Vendas (PDV)
  Caixa

  ─── ESTOQUE E COMPRAS ───
  Produtos e Insumos
  Estoque
  Fornecedores
  Pedidos de Compra

  ─── FINANCEIRO ───
  Visão Financeira
  Contas a Pagar
  Contas a Receber

  ─── GESTÃO ───
  Avisos
  Relatórios

  ─── ADMINISTRAÇÃO ───
  Usuários
  Permissões e Módulos

  ─── (footer) ───
  Avatar + nome do usuário
  Configurações
  Sair
```

- Módulos desabilitados pelo administrador ficam **ocultos** na sidebar para todos os perfis.
- Itens sem permissão de acesso do usuário ficam ocultos.
- A sidebar tem modo **collapsed** (só ícones) e **expanded** (ícones + labels).

---

## C. Fluxos Principais

### Login → Dashboard
Login → validação → redirect para Dashboard Geral

### Dashboard → Módulos
Dashboard → cards e links rápidos → qualquer módulo na sidebar

### Fluxo de Venda Completo
Caixa aberto → PDV → busca produto → adiciona itens → aplica desconto (se permitido) → escolhe pagamento (PIX/Cartão/Dinheiro) → confirma venda → estoque atualizado automaticamente → volta ao PDV

### Venda → Atualização de Estoque
Após confirmação de venda, baixa automática é registrada em Estoque como movimentação de saída rastreável (não há edição manual necessária).

### Estoque Baixo → Pedido de Compra
Estoque (alerta badge vermelho) → botão "Gerar Pedido" no item crítico → drawer pré-preenchido com produto e estoque mínimo → seleção de fornecedor → confirmação → Pedido de Compra criado

### Pedido de Compra → Recebimento → Estoque
Pedido em aberto → botão "Registrar Recebimento" → modal de conferência de itens/quantidades → confirmação → entrada automática no Estoque

### Conta a Pagar → Pagamento
Lista de contas → linha vencida/próxima → botão "Registrar Pagamento" → modal com valor, data, forma de pagamento → confirmação → status muda para "Pago" (rastreável)

### Conta a Receber → Recebimento
Igual ao fluxo de conta a pagar, modal de recebimento → status "Recebido"

### Usuários → Permissões
Usuários → visualizar/editar usuário → botão "Configurar permissões avançadas" → tela 15 "Permissões e Módulos", já filtrada pelo usuário ou perfil selecionado. A matriz detalhada de permissões existe exclusivamente na tela 15.

### Admin → Módulos
Permissões e Módulos → aba Módulos → toggle habilitar/desabilitar → confirmação → módulo some da sidebar de todos os usuários

### Avisos → Publicação
Avisos → "Novo Aviso" → drawer com título, corpo, prioridade, público alvo, período → publicar → aparece no Dashboard e tela de Avisos

---

## D. Estratégia de CRUD e Rastreabilidade

| Entidade | Operação de remoção |
|----------|-------------------|
| Produtos, Fornecedores, Usuários, Avisos | CRUD completo (soft delete / desativar) |
| Vendas concluídas | Cancelamento/estorno (mantém histórico) |
| Movimentações de estoque | Ajuste ou cancelamento rastreável |
| Pedidos de compra enviados | Cancelamento com motivo |
| Contas a pagar/receber | Cancelamento (não exclusão) |
| Movimentações de caixa | Inativação + observação; fechamento é imutável |

---

## E. Componentes Reutilizáveis (Design System)

### Layout
- `AppShell` — sidebar + header + `<Outlet>` (área de conteúdo)
- `Sidebar` — logo, nav items agrupados, footer de usuário, modo collapsed
- `TopBar` — breadcrumb, busca global, notificações (badge), avatar

### Primitivos
- `Button` — variants: primary, secondary, ghost, destructive; sizes: sm, md, lg
- `Input`, `Select`, `Textarea`, `Checkbox`, `Toggle`
- `Badge` — colors: blue, green, orange, red, gray
- `Avatar`

### Compostos
- `KPICard` — ícone, label, valor principal, delta (positivo/negativo), tendência
- `DataTable` — cabeçalho ordenável, linhas, paginação, seleção múltipla, ações por linha
- `FilterBar` — busca, selects de filtro, date range, botão limpar
- `Modal` — header, body scrollable, footer com ações
- `Drawer` — slide da direita, formulários de criação/edição
- `StatusBadge` — mapeamento semântico de status (Ativo/Inativo, Pago/Pendente, etc.)
- `EmptyState` — ícone + texto + CTA quando tabelas estão vazias
- `AlertBanner` — info/warning/error/success inline
- `Toast` — notificações transientes (canto inferior direito)
- `ConfirmDialog` — modal de confirmação para ações destrutivas
- `PageHeader` — título + breadcrumb + botão de ação primária
- `TabBar` — navegação horizontal dentro de páginas
- `Skeleton` — placeholders de carregamento

### Visualização
- `LineChart` / `BarChart` / `AreaChart` via Recharts
- `DonutChart` para despesas por categoria

---

## F. Hierarquia de Usuários e Permissões

| Perfil | Acesso |
|--------|--------|
| **Administrador** | Acesso total. Pode configurar módulos e permissões de todos os perfis. Vê todas as telas. |
| **Gerente** | Dashboard, Vendas, Caixa, Estoque, Compras, Financeiro, Relatórios, Avisos. Não acessa Usuários/Permissões. |
| **Operador de Caixa** | Apenas Caixa e PDV. Interface simplificada. Sem acesso a financeiro ou admin. |
| **Estoque/Compras** | Produtos, Estoque, Fornecedores, Pedidos de Compra. Sem acesso a financeiro ou admin. |
| **Financeiro** | Dashboard Financeiro, Contas a Pagar, Contas a Receber, Relatórios. Sem acesso a operação ou admin. |

---

## G. Estrutura de Cada Tela

### 1. Login
- Logo centralizado, card com formulário
- Campos: e-mail, senha (com toggle de visibilidade)
- Link "Esqueci minha senha" → modal de recuperação
- Botão "Entrar"

### 2. Dashboard Geral
- KPIs: Vendas Hoje, Faturamento Mensal, Saldo do Caixa, Estoque Baixo (badge crítico)
- Gráfico de barras: Faturamento dos últimos 7 dias
- Tabela: Últimas 5 vendas
- Lista: Estoque crítico (até 5 itens com link para gerar pedido)
- Lista: Próximos vencimentos (contas a pagar/receber)
- Card: Avisos recentes
- Filtro de período no header

### 3. PDV / Vendas
- Layout split: painel de produtos (busca + grid de cards) | carrinho
- Busca em tempo real de produtos por nome/SKU
- Grid de categorias como filtro rápido
- Carrinho: lista de itens, qty editável, subtotal, campo de desconto, total
- Botão "Finalizar Venda" → Modal de pagamento (PIX/Cartão/Dinheiro, valor recebido, troco)
- Histórico de vendas do dia em tab secundária

### 4. Caixa
- Estado: caixa fechado → card "Abrir Caixa" com campo de saldo inicial
- Estado: caixa aberto → header com operador, hora de abertura, saldo atual
- Tabela de movimentações do período (entrada/saída/venda)
- Botões: "+ Entrada (Reforço)", "- Saída (Sangria)", "Fechar Caixa"
- Drawer de reforço/sangria: valor + motivo
- Modal de fechamento: resumo do período, saldo final, confirmar

### 5. Produtos e Insumos
- PageHeader com botões contextuais: "Novo Produto" (tab Produtos) / "Novo Insumo" (tab Insumos)
- **Tab Produtos:** DataTable com SKU, Nome, Categoria, Preço de Venda, Unidade, Estoque, Est. Mínimo, Status, Ações. Badge vermelho quando estoque ≤ mínimo. Drawer com campos: SKU, nome, categoria, preço de venda, unidade, estoque, estoque mínimo, status + accordion "Ingredientes e Alergênicos" (opcional).
- **Tab Insumos:** DataTable com Código, Nome, Categoria, Unidade de Medida, Qtd em Estoque, Est. Mínimo, Fornecedor Preferencial, Lote, Validade, Status, Ações. Drawer com todos esses campos; Validade e Lote opcionais conforme categoria.
- Ambas as tabs compartilham FilterBar (busca, categoria, status) e modal de confirmação para desativar.
- Alergênicos: funcionalidade opcional integrada ao drawer de Produtos, não possui tela própria.

### 6. Estoque
- Tabs: "Posição Atual" | "Movimentações" | "Alertas"
- Posição: DataTable com saldo atual, mínimo, status (OK/Baixo/Crítico)
- Movimentações: DataTable com data, produto, tipo, qty, lote, responsável
- Alertas: lista de itens críticos com botão "Gerar Pedido de Compra"
- Botão "Registrar Movimentação" → Drawer: tipo (Entrada/Saída/Ajuste), produto, qty, lote, data, motivo

### 7. Fornecedores
- PageHeader + botão "Novo Fornecedor"
- FilterBar: busca, status
- DataTable: Nome, CNPJ/CPF, Contato, Telefone, E-mail, Status, Ações
- Drawer de criação/edição: dados completos + endereço
- Tab "Histórico de Pedidos" no drawer de visualização

### 8. Pedidos de Compra
- PageHeader + botão "Novo Pedido"
- FilterBar: busca, fornecedor, status, período
- DataTable: Nº, Fornecedor, Data, Previsão, Valor Total, Status, Ações
- Statuses: Rascunho, Enviado, Em Trânsito, Parcialmente Recebido, Recebido, Cancelado
- Drawer de criação: fornecedor, itens (tabela editável com produto/insumo, qty, preço unitário), observações
- Botão "Registrar Recebimento" → **Modal de recebimento detalhado** com, para cada item do pedido: quantidade pedida (read-only), quantidade recebida (editável — permite recebimento parcial), lote, validade (quando aplicável), data do recebimento, responsável e campo de observação global. Pedido com recebimento parcial (ex.: 30 de 50 unidades) muda para status "Parcialmente Recebido" e permanece ativo até a entrada das unidades restantes. Ao confirmar, gera automaticamente movimentação de entrada no módulo Estoque para cada item recebido.

### 9. Dashboard Financeiro
- KPIs: Saldo, Faturamento Mensal, Receitas, Despesas, Resultado
- Gráfico de área: Fluxo de caixa (30 dias)
- Gráfico de barras agrupado: Receitas vs Despesas (12 meses)
- Gráfico donut: Despesas por categoria
- Cards: Contas a pagar próximas, Contas a receber próximas
- Filtro de período

### 10. Contas a Pagar
- PageHeader + botão **"+ Nova Conta / Despesa"** (botão único cobre ambos os casos)
- FilterBar: busca, categoria, status, vencimento
- DataTable: Descrição, Categoria, Fornecedor, Vencimento, Valor, Status, Ações
- Status: Pendente, Pago, Vencido, Cancelado
- **Drawer de criação/edição:** descrição, categoria financeira, fornecedor (opcional), valor, vencimento, forma de pagamento, centro de custo/categoria financeira, observação. Toggle **"Já foi pago"**: quando ativado, exibe campo de data de pagamento e registra a despesa já liquidada, preservando histórico financeiro.
- Botão "Registrar Pagamento" em contas pendentes → Modal: data, valor pago, forma de pagamento
- Ação de cancelamento com motivo (não exclusão)
- O Dashboard Financeiro consome esses registros para compor despesas, receitas e resultado do período.

### 11. Contas a Receber
- Estrutura espelhada de Contas a Pagar
- Status: Pendente, Recebido, Vencido, Cancelado
- Botão "Registrar Recebimento" → Modal análogo

### 12. Relatórios
- Tabs: Vendas | Estoque | Compras | Financeiro | Caixa
- Cada tab: FilterBar (período, outros filtros contextuais) + DataTable ou gráfico
- Botões de exportação: PDF, Excel
- Empty state quando não há dados no período

### 13. Avisos
- PageHeader + botão "Novo Aviso"
- FilterBar: busca, prioridade, status, público
- DataTable/lista de cards: Título, Prioridade (badge), Público, Período, Status, Ações
- Drawer de criação/edição: título, corpo (textarea rico), prioridade, público, data início/fim
- Ações: Publicar, Arquivar, Editar, Excluir (com confirmação)

### 14. Usuários
- PageHeader + botão "Novo Usuário"
- FilterBar: busca, perfil, status
- DataTable: Avatar, Nome, E-mail, Cargo, Perfil de Acesso, Status, Ações
- **Drawer de criação/edição** com campos: dados pessoais (nome, e-mail, cargo), perfil de acesso (Administrador/Gerente/Operador de Caixa/Estoque·Compras/Financeiro), status, e lista dos módulos disponíveis para o perfil selecionado (read-only, atualizada ao trocar o perfil)
- Botão **"Configurar permissões avançadas"** no drawer → redireciona para tela 15 (Permissões e Módulos) já filtrada pelo perfil do usuário. Configuração detalhada de permissões existe somente na tela 15.
- Toggle de status ativo/inativo com modal de confirmação

### 15. Permissões e Módulos
- Tabs: "Perfis e Permissões" | "Módulos da Empresa"
- **Perfis e Permissões**: seletor de perfil (ou usuário específico via link da tela 14) → matriz de permissões (módulo × ação: visualizar/criar/editar/excluir/aprovar/exportar) com checkboxes. Ícones de cadeado usados aqui para indicar permissões bloqueadas/indisponíveis.
- **Módulos da Empresa**: lista de módulos com toggle ativo/inativo, descrição e ícone. Módulos ativos visíveis na sidebar de todos os usuários com acesso. Módulos inativos desaparecem da sidebar. Módulo **Produção** exibido com badge "Disponível futuramente" e toggle desabilitado — sem rota ou tela vazia associada.
- Aviso de impacto ao desativar módulo (ex.: "3 usuários perderão acesso")
- Botão "Salvar Alterações" com confirmação

---

## H. Consistência Visual

### Paleta
```css
--background: #F7F8FA;
--foreground: #1A202C;
--card: #FFFFFF;
--primary: #2563EB;          /* azul — ações primárias */
--brand: #142B4A;            /* azul-marinho — sidebar, logo */
--accent: #7C3AED;           /* roxo — uso discreto em highlights */
--success: #16A34A;          /* verde — positivo */
--warning: #EA580C;          /* laranja — alertas */
--destructive: #DC2626;      /* vermelho — erros, cancelamentos */
--muted-foreground: #6B7280;
--border: #E5E7EB;
--radius: 11px;              /* cards e modais: 10–12px */
```

### Tipografia
- **Todos os textos, números e valores monetários:** Inter (400, 500, 600, 700)
- **Mono/Identificadores:** JetBrains Mono — apenas onde agrega valor: SKUs, códigos de produto, identificadores técnicos. **Não** usar para valores monetários (usar Inter).

### Espaçamento
- Padding de cards: `p-6`
- Gap entre KPIs: `gap-4` ou `gap-6`
- Linhas de tabela: `py-3 px-4`
- Sidebar width: `240px` expanded / `64px` collapsed

### Ícones
- Biblioteca: `lucide-react` (consistência, estilo outline limpo)

### Elevação
- Cards: `shadow-sm` + `border border-border`
- Modais: `shadow-xl`
- Sidebar: `shadow-md` ou `border-r`

---

## I. Interações do Protótipo

- Sidebar: toggle collapsed/expanded com transição suave
- Navegação entre telas via React Router (`react-router-dom`)
- PDV: busca de produtos com filtro em tempo real (estado local)
- Carrinho: add/remove/qty com cálculo dinâmico
- Modais e Drawers: abertura/fechamento com estado React
- Filtros: aplicação imediata sobre dados mockados
- Tabs: troca de conteúdo sem reload
- Toggles de módulos: feedback visual imediato
- Toast de confirmação após ações (venda realizada, conta paga, etc.)
- Gráficos interativos: tooltip ao hover via Recharts

---

## J. Análise Crítica

### Redundâncias identificadas e resolvidas
- "Caixa" e "PDV" são mantidas separadas — fluxos distintos (gestão de caixa vs. registro de venda). Correto.
- "Contas a Pagar" e "Contas a Receber" são telas separadas em vez de uma tela unificada — facilita foco por perfil de usuário. Mantido.

### Ajuste de agrupamento sugerido
- Nenhuma tela será removida. As 15 telas do brief cobrem todos os módulos sem redundância real.

### Funcionalidades ausentes (para protótipo — não crítico agora)
- Recuperação de senha (fluxo modal dentro da tela Login — não precisa de tela separada)
- Notificações em tempo real (bell icon no TopBar com dropdown — componente, não tela)

### Riscos de sobrecarga
- Dashboard Geral: limitar a 6 KPIs + 1 gráfico + 3 listas; não empilhar mais que isso
- PDV: interface deve ser otimizada para touch/tablet — grid de produtos com cards grandes

### Pontos onde a modularidade deve ficar evidente
- Tela de Permissões e Módulos: toggles com nome e ícone de cada módulo; Produção com badge "Disponível futuramente" e toggle desabilitado
- Sidebar: exibe **somente** módulos habilitados para a empresa E acessíveis pelo perfil do usuário. Sem ícones de cadeado na navegação principal.
- Dashboard: exibir apenas widgets dos módulos ativos

### Regra de visibilidade da Sidebar
- Módulo desabilitado pela empresa → não aparece para ninguém
- Módulo sem permissão para o usuário → não aparece para esse usuário
- Ícones de cadeado: somente na tela 15, para sinalizar permissões bloqueadas na matriz de configuração

---

## Implementação — Ordem de Build

1. **Setup base:** App shell, sidebar, top bar, React Router com rotas para todas as 15 telas
2. **Design system:** tokens CSS em `src/index.css`, componentes primitivos e compostos em `src/components/ui/`
3. **Dados mock:** arquivo `src/data/mock.ts` com dados realistas em pt-BR
4. **Telas por prioridade:** Login → Dashboard → PDV → Caixa → Produtos → Estoque → Fornecedores → Pedidos → Dashboard Financeiro → Contas a Pagar → Contas a Receber → Relatórios → Avisos → Usuários → Permissões

---

## Estrutura de Arquivos

```
src/
  components/
    ui/           # Button, Input, Modal, Drawer, Badge, DataTable, KPICard...
    layout/       # AppShell, Sidebar, TopBar
    charts/       # LineChart, BarChart, DonutChart wrappers
  pages/
    Login.tsx
    Dashboard.tsx
    PDV.tsx
    Caixa.tsx
    Produtos.tsx
    Estoque.tsx
    Fornecedores.tsx
    PedidosCompra.tsx
    DashboardFinanceiro.tsx
    ContasPagar.tsx
    ContasReceber.tsx
    Relatorios.tsx
    Avisos.tsx
    Usuarios.tsx
    PermissoesModulos.tsx
  data/
    mock.ts       # dados fictícios realistas em pt-BR
  App.tsx         # Router + AppShell
  index.css       # tokens + Google Fonts imports + Tailwind
```

## Dependências a instalar

- `react-router-dom` — navegação entre telas
- `recharts` — gráficos
- `lucide-react` — ícones

---

## Verificação

Após o build:
1. Navegar por todas as 15 telas via sidebar
2. Testar fluxo completo: Login → Dashboard → PDV → Finalizar Venda → Estoque (confirmar baixa)
3. Testar Caixa: abrir → registrar movimentação → fechar
4. Testar Permissões: desativar módulo → verificar desaparecimento da sidebar
5. Confirmar dados monetários no formato `R$ 1.250,00` e datas em `DD/MM/AAAA`
6. Verificar responsividade básica em viewport ~1000px
