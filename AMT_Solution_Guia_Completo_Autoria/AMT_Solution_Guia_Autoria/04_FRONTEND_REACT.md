# 04 — Frontend React: JSX, componentes, hooks, eventos e navegação

## 1. O que é React e o que significa SPA?

**React** é uma biblioteca para criar interfaces a partir de componentes declarativos. **SPA** (*Single-Page Application*) significa que, após carregar a aplicação, a navegação entre diferentes telas pode ocorrer no navegador sem o servidor gerar um novo HTML completo para cada interação. O AMT Solution utiliza `react-router-dom` para associar URLs a componentes.

**JSX** combina expressões JavaScript e sintaxe semelhante a HTML; a ferramenta de build transforma JSX em JavaScript executável. Diferentemente de HTML estático, JSX aceita props, eventos e expressões como `{valor}`.

## 2. Entrada e estrutura do frontend

- `src/main.jsx`: carrega `index.css` e monta `<App />` no elemento `root`.
- `src/App.jsx`: define todas as rotas e monta o sistema de notificações `ToastContainer`.
- `src/components/layout/AppShell.jsx`: disposição geral com `Sidebar` e `Outlet`.
- `src/components/layout/Sidebar.jsx`: links por módulo via `NavLink`, controles de recolhimento e saída visual.
- `src/components/layout/TopBar.jsx`: cabeçalho da seção.
- `src/pages/`: componentes de páginas de negócio, tanto reais quanto mockados.
- `src/components/ui/`: `Button`, `Input`, `Modal`, `Drawer`, `DataTable`, `ConfirmDialog`, `Toast`, `StatusBadge`, etc.
- `src/services/`: código que fala com a API; cada módulo real tem seu service JS.
- `src/data/mock.js`: dados de demonstração consumidos por módulos fora do recorte de persistência.
- `src/index.css`: estilos globais/variáveis.

## 3. Rotas reais de `App.jsx`

| URL do navegador | Componente | Natureza principal |
|---|---|---|
| `/` | `Login` | protótipo de login |
| `/dashboard` | `Dashboard` | mock |
| `/pdv` | `PDV` | mock |
| `/caixa` | `Caixa` | mock |
| `/produtos` | `Produtos` | CRUD real (inclui aba Insumos) |
| `/estoque` | `Estoque` | mock |
| `/fornecedores` | `Fornecedores` | CRUD real |
| `/pedidos` | `PedidosCompra` | mock |
| `/financeiro` | `DashboardFinanceiro` | mock |
| `/contas-pagar` | `ContasPagar` | CRUD real + Strategy/Observer |
| `/contas-receber` | `ContasReceber` | CRUD real + Strategy |
| `/relatorios` | `Relatorios` | mock |
| `/avisos` | `Avisos` | CRUD real + integração Factory/Observer |
| `/usuarios` | `Usuarios` | CRUD real |
| `/permissoes` | `PermissoesModulos` | mock |
| qualquer outra | redireciona `/` | fallback de rota |

**Rota não é endpoint:** `/contas-pagar` é uma rota de UI. `/api/contas-pagar` é um recurso da API no backend.

## 4. Componentes e props

Um componente funcional é uma função JavaScript que devolve JSX. As **props** são argumentos recebidos do componente pai para configurar aparência/comportamento. Exemplo didático inspirado no projeto:

```jsx
<Button variant="primary" onClick={salvar}>Salvar</Button>
```

O elemento visual reutilizável pode ser empregado em várias telas sem duplicar a aparência e a lógica básica do botão. A função `salvar` é definida pela página e representa a ação específica do domínio.

Componentes reais como `Modal`, `Drawer` e `ConfirmDialog` implementam padrões de interface comuns, mas **não devem ser confundidos** com os três padrões GoF exigidos em Java.

## 5. Estado React: `useState`

No `ContasPagar.jsx`, o código usa, entre outros:

```jsx
const [contas, setContas] = useState([]);
const [drawer, setDrawer] = useState(false);
const [editItem, setEditItem] = useState(null);
const [salvando, setSalvando] = useState(false);
```

- `contas`: lista retornada pela API.
- `setContas`: atualiza a lista e provoca nova renderização.
- `drawer`: controla se o formulário lateral está aberto.
- `editItem`: diferencia criar de editar; `null` significa novo cadastro.
- `salvando`: ajuda a evitar ações repetidas e a comunicar carregamento.

A mudança de estado não é sinônimo de alteração no banco. A persistência acontece quando o frontend envia uma requisição bem-sucedida à API.

## 6. Efeito colateral: `useEffect`

Trecho real de `ContasPagar.jsx`:

```jsx
const carregar = async () => {
  try {
    setContas(await contasPagarService.listar());
  } catch (error) {
    toast(error.message, "error");
  }
};
useEffect(() => {
  carregar();
}, []);
```

O efeito com dependências vazias solicita o carregamento quando o componente é montado. No modo de desenvolvimento com `StrictMode`, efeitos podem executar verificações adicionais. A lista não é embutida no React: vem da API. Após salvar/excluir, as páginas usam `await carregar()` para sincronizar a exibição com a fonte persistida.

## 7. Formulários controlados e eventos

Campos controlados recebem um `value` vindo do estado e um `onChange` que atualiza o estado. Exemplo didático:

```jsx
<Input value={form.descricao}
       onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
```

O operador `...form` copia os campos anteriores; a propriedade `descricao` é substituída. Sem preservar o restante do objeto, um campo poderia apagar os demais campos do formulário. O evento possui dados como `e.target.value`.

## 8. `async`, `await`, `try/catch/finally`

`salvar` é assíncrono porque `fetch` e as operações HTTP retornam Promises. `await` aguarda a resposta para executar passos na ordem correta; `try` concentra o caminho de sucesso; `catch` trata falhas, como HTTP 400/409 ou indisponibilidade do servidor; `finally` redefine `salvando` mesmo em caso de erro.

Exemplo de caminho real:

```text
clicar Salvar
  → validar campos básicos
  → setSalvando(true)
  → await contasPagarService.criar(dados)
  → await carregar()
  → fechar drawer + toast de sucesso
  → finally setSalvando(false)
```

## 9. Como o React distingue Produtos e Insumos

`Produtos.jsx` guarda a aba selecionada em `tab`. A lista de registros vêm da mesma chamada `produtosService.listar()`. O frontend separa os objetos pelo atributo `tipo` (`PRODUTO` ou `INSUMO`) e utiliza formulários e colunas diferentes. Na hora de salvar, o service JS manda o `tipo` para a API. **Não há entidade JPA Insumo nem tabela insumos separada neste backend.**

## 10. Busca, filtros e renderização de listas

O React pode filtrar localmente a lista que já foi carregada. Em Contas Pagar, por exemplo, `const dados = contas.filter(...)` procura descrição/categoria. Filtrar em memória **não implica** que a pesquisa esteja sendo executada no banco, porque o service inicial já trouxe os dados.

`DataTable` recebe arrays de configuração de colunas e dados. Funções `render` personalizam badges, botões e conteúdo; `map` e `filter` são métodos JS para percorrer e selecionar elementos.

## 11. Componentes visuais e estilos

O frontend usa Tailwind CSS (classes como `flex`, `p-6`, `rounded-lg`) e variáveis CSS (`var(--primary)`, `var(--destructive)`). Ícones vêm de `lucide-react`. Gráficos em páginas mockadas usam `recharts`. O objetivo desses recursos é reutilizar componentes e estilos consistentes, sem escrever todo o layout do zero.

## 12. Como reconhecer mock visual

Procure por `import ... from "../data/mock"`, arrays locais e ações que somente chamam `toast` ou alteram `useState`, sem invocar `src/services/api.js`. No PDV, por exemplo, a simulação visual de venda **não produz uma venda persistida por um controller de vendas neste backend**. Entretanto, `formatCurrency` de `data/mock.js` também é reutilizado nas telas reais **apenas para formatação** — importar essa função não transforma um CRUD real em mock.

## 13. Perguntas práticas

1. Onde o React é montado?
2. O que é JSX?
3. Por que `useState` é necessário?
4. Para que serve `useEffect(..., [])`?
5. O que o `Outlet` faz no `AppShell`?
6. Qual a diferença entre `status` exibido na tabela e `situacao` persistida na API?
7. Por que uma função de salvar deve aguardar o retorno HTTP?
8. Como identificar uma página com dados mockados?
9. O que `setContas` faz e o que ele **não** faz?
10. Que vantagem há em reutilizar `Button`, `Modal`, `DataTable` e `Toast`?
