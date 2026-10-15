# 21 — Componentes reutilizáveis da interface e distinção entre UI real e mock

## 1. Por que estudar componentes de interface numa prova de reuso?

A ideia de componente reutilizável é central no React: criar um `Button`, `Input`, `DataTable`, `Modal` ou `Toast` uma vez e utilizá-lo em diversas páginas torna a interface consistente e reduz duplicações. Isso é **reuso de componentes**, mas não equivale automaticamente a cumprir o requisito de **padrões GoF em Java**; são formas complementares de reuso.

## 2. Catálogo dos componentes de `Frontend/src/components/ui/`

| Componente | Finalidade técnica e como aparece no AMT Solution |
|---|---|
| `Badge.jsx` | Insígnia visual de categoria/valor informativo; recebe `color`, `children`, `size` |
| `Button.jsx` | Botão estilizado reutilizável; recebe callbacks, variantes, tamanho, ícones e estado desabilitado |
| `ConfirmDialog.jsx` | Confirmação antes de uma ação potencialmente destrutiva, como DELETE |
| `DataTable.jsx` | Renderiza linhas/colunas recebidas por props; as páginas podem customizar colunas e ações |
| `Drawer.jsx` | Painel lateral para cadastro/edição sem sair da listagem |
| `FilterBar.jsx` | Organização visual de busca e filtros de listagem |
| `Input.jsx` | Campo com rótulo e indicação de erro, reutilizado nos formulários |
| `KPICard.jsx` | Card para indicadores de painéis; aparece especialmente nas visões resumidas |
| `Modal.jsx` | Janela sobreposta para operações como pagamento e simulação Strategy |
| `PageHeader.jsx` | Título, subtítulo e ações principais de cada página |
| `Select.jsx` | Componente de seleção de opções |
| `StatusBadge.jsx` | Apresenta situação/status do registro com visual consistente |
| `Tabs.jsx` | Alterna seções, como Produtos e Insumos |
| `Toast.jsx` | Sistema de mensagens transitórias de sucesso/erro; expõe `toast(...)` e `ToastContainer` |

Cada componente possui seu contrato de props no próprio arquivo. Na autoria, abra a assinatura `export default function Componente({...})` e mostre como a página o usa, por exemplo `<Modal open={simulacaoModal} ...>`.

## 3. Layout e navegação

- `AppShell` fornece o layout comum com barra lateral, área de conteúdo e `Outlet` para renderizar a rota escolhida.
- `Sidebar` organiza as rotas por áreas de operação, estoque/compras, financeiro, gestão e administração.
- `TopBar` apresenta contexto da página e breadcrumb.
- `ToastContainer`, montado em `App.jsx`, é o local de exibição das mensagens acionadas pelas páginas.

**Ganhos de reuso:** adicionar um novo CRUD não requer copiar do zero o HTML da navegação, botões, modais e tabela.

## 4. Exemplos de composição de UI nas seis telas reais

### Produtos

`Produtos.jsx` utiliza `Tabs` para diferenciar PRODUTO/INSUMO, `DataTable` para listagem, `Drawer` com `Input`/`Select` para cadastro, `ConfirmDialog` para status/exclusão e `Toast` para retorno. Os dados da lista vêm de `produtosService`.

### Contas a Pagar

`ContasPagar.jsx` reutiliza `Modal` tanto para operações financeiras como para a simulação Strategy. `Button` dispara ações, e a classe Java Strategy retorna o cálculo. `PageHeader` disponibiliza o botão para verificar vencimentos. O layout da UI **não contém a fórmula financeira**.

### Avisos

`Avisos.jsx` utiliza `Drawer` para criação/edição e componentes de status/prioridade; `ConfirmDialog` protege exclusão física. `toast` comunica falhas/sucessos da API.

## 5. Onde entra `Frontend/src/data/mock.js`?

O arquivo contém valores e coleções para simulações visuais, como produtos, vendas, movimentações de estoque, pedidos e indicadores, além de helpers como `formatCurrency`.

**Não é tudo ou nada:** algumas páginas reais importam `formatCurrency` desse arquivo para apresentar moeda, mas obtêm seus registros **reais** por `src/services/`. Já `Dashboard.jsx` e `Relatorios.jsx`, por exemplo, usam as coleções mockadas diretamente para exibir gráficos e indicadores.

## 6. Funcionamento de páginas não integradas

| Página | Evidência de protótipo na versão analisada |
|---|---|
| `Dashboard.jsx` | importa listas mockadas para métricas e gráficos |
| `DashboardFinanceiro.jsx` | usa séries e contas mockadas para KPIs/gráficos |
| `PDV.jsx` | utiliza `mockProdutos` e `mockVendas`; conclui operação no estado da UI, sem API de vendas |
| `Caixa.jsx` | estado local para abertura/fechamento e movimentações |
| `Estoque.jsx` | lê `mockProdutos`/`mockMovEstoque`; não representa o Observer real, que está no CRUD Produtos |
| `PedidosCompra.jsx` | usa mock de pedidos/fornecedores/produtos |
| `Relatorios.jsx` | usa coleções mockadas para dados de gráficos e tabelas |
| `PermissoesModulos.jsx` | usa estado local de permissões e módulos, não um sistema real de autorização/LPS |
| `Login.jsx` | navega para dashboard no frontend, sem autenticação em API |

## 7. Distinção conceitual mais cobrada

- **Componente React reutilizável:** `Button`, `Modal`, `Drawer`, `DataTable`.
- **Regras de negócio Java:** `ProdutoService`, `ContaPagarService`.
- **Padrão comportamental Strategy:** `ContextoEncargo` + classes de cálculo.
- **Padrão criacional Factory Method:** `CriadorAviso`/`CriadorLancamentoFinanceiro` + concretas.
- **Padrão comportamental Observer:** `SujeitoProduto`/`SujeitoVencimento` + observadores.

Tudo pode representar reuso, mas os **três padrões escolhidos foram demonstrados e auditados no backend Java**, não no CSS ou em uma biblioteca de gráficos.

## 8. Perguntas de treino

1. Qual diferença entre componentes `Drawer` e `Modal`?
2. Como `DataTable` consegue apresentar estruturas de várias entidades?
3. Por que a página Produtos pode usar `formatCurrency` e ainda assim ser CRUD real?
4. Qual componente mostra o resultado de Strategy? E qual classe calcula?
5. Como `ToastContainer` permite mensagens de páginas diferentes?
6. Em qual arquivo se encontra a lista principal de rotas?
7. Por que o menu lateral pode exibir páginas mockadas sem comprometer o escopo real?
8. Como distinguir um botão que só mostra toast de uma requisição POST real?
