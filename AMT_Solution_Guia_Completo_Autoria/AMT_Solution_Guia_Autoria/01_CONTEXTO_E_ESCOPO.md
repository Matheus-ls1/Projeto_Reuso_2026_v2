# 01 — Contexto do AMT Solution, problema, objetivos e escopo

## 1. O que é o projeto?

O **AMT Solution** é um protótipo acadêmico de sistema de gestão empresarial com foco em operações de uma empresa do setor alimentício e em atividades administrativas e financeiras. Sua interface abrange produtos e insumos, fornecedores, contas, usuários, avisos, vendas/PDV, caixa, estoque, pedidos, relatórios e painéis. **Essa amplitude visual não significa que todos os módulos tenham persistência real.** A versão analisada implementa parcialmente o sistema em conformidade com o recorte exigido pela disciplina de Reuso de Software.

A proposta é demonstrar **reuso de conceitos e estruturas de software**, além de conceitos de programação orientada a objetos, separação de responsabilidades, comunicação frontend–backend, persistência relacional e preparação de variabilidade de produto.

## 2. Problema de negócio

Uma operação comercial pode precisar administrar itens e quantidades, identificar fornecedores, controlar obrigações e recebimentos, manter cadastro de colaboradores e avisar a equipe sobre fatos importantes. Se cada rotina for isolada ou manual, aumentam as chances de inconsistência, duplicação e dificuldade de rastreamento.

O AMT Solution reúne esses domínios em uma interface comum. Na versão entregue, alguns módulos são implementados integralmente como CRUD, enquanto outras páginas preservam o desenho e dados de demonstração.

## 3. Objetivos educacionais, separados dos objetivos de negócio

**Negócio:** centralizar informações de produtos, fornecedores, financeiro, usuários e comunicações internas. **Educação:** comprovar seis fluxos CRUD com banco, ao menos dez classes relevantes, dois exemplos de cada um dos três padrões escolhidos e planejamento de variabilidade.

Não é necessário defender o software como ERP pronto para produção. A resposta correta é: *“É uma implementação acadêmica parcial, com seis CRUDs reais e as demais telas prototipadas para representar a visão do produto.”*

## 4. Requisitos acadêmicos usados como referência

| Exigência | Evidência estudável |
|---|---|
| Ao menos 10 classes principais com atributos e métodos | `Produto`, `Fornecedor`, `ContaPagar`, `ContaReceber`, `Usuario`, `Aviso`, Services etc. |
| Três padrões diferentes, dois exemplos por padrão | Strategy financeiro (2), Factory Method (2), Observer (2) |
| Dois CRUDs por integrante — três integrantes | Produtos/Fornecedores; Contas Pagar/Receber; Usuários/Avisos |
| Ao menos três tabelas no banco | Seis tabelas em `01_schema.sql` |
| Planejamento de variabilidade/LPS | Deve ser defendido conceitualmente, não como módulo dinâmico implementado |

**Atenção à contagem:** Produtos e Insumos são duas visualizações e dois tipos de registro, mas compartilham `Produto.java`, `ProdutoController` e a tabela `produtos`; constituem **um dos seis módulos CRUD** da divisão acadêmica, não dois módulos independentes.

## 5. Escopo implementado

| Equipe | CRUD | Tela React | Backend | Banco |
|---|---|---|---|---|
| 1 | Produtos/Insumos | `Produtos.jsx` | `ProdutoController`/`ProdutoService` | `produtos` |
| 1 | Fornecedores | `Fornecedores.jsx` | `FornecedorController`/`FornecedorService` | `fornecedores` |
| 2 | Contas a Pagar | `ContasPagar.jsx` | `ContaPagarController`/`ContaPagarService` | `contas_pagar` |
| 2 | Contas a Receber | `ContasReceber.jsx` | `ContaReceberController`/`ContaReceberService` | `contas_receber` |
| 3 | Usuários | `Usuarios.jsx` | `UsuarioController`/`UsuarioService` | `usuarios` |
| 3 | Avisos | `Avisos.jsx` | `AvisoController`/`AvisoService` | `avisos` |

Operações adicionais relevantes: ativação/desativação separada de DELETE, registro de situação financeira, arquivamento de avisos, simulação de encargos e descontos e verificação manual de vencimentos.

## 6. Páginas de protótipo e seus limites

`Dashboard.jsx`, `DashboardFinanceiro.jsx`, `PDV.jsx`, `Caixa.jsx`, `Estoque.jsx`, `PedidosCompra.jsx` e `Relatorios.jsx` utilizam conjuntos de dados de `Frontend/src/data/mock.js` ou estados locais. `PermissoesModulos.jsx` também manipula dados locais demonstrativos. `Login.jsx` navega para o dashboard sem autenticação efetiva na API. Esses recursos ajudam a comunicar a visão visual do produto, **mas não devem ser apresentados como persistência/autenticação real**.

A tela **Estoque** mockada não se confunde com o **controle de quantidade no CRUD real de Produtos**, que efetivamente participa do Observer de estoque mínimo. Da mesma forma, o cadastro de Usuários com hash BCrypt **não equivale** a um sistema completo de login/permissões.

## 7. Seis exemplos reais dos padrões

| Padrão | Contexto 1 | Contexto 2 | Onde o professor pode ver |
|---|---|---|---|
| Strategy | Encargos de conta a pagar | Descontos de conta a receber | Botões `Simular` dos dois módulos |
| Factory Method | Avisos manuais/automáticos | Contas a pagar/receber | Cadastro real nas telas e classes criadoras Java |
| Observer | Estoque mínimo de produto | Vencimento próximo | Eventos que geram avisos reais |

**Não é obrigatório aplicar cada padrão a todas as seis telas.** O requisito é demonstrar dois contextos funcionais de cada padrão.

## 8. Narrativa de abertura para a prova (aprox. 60 segundos)

> “O AMT Solution é uma aplicação acadêmica de gestão com frontend React e backend Java Spring Boot conectados a um banco MariaDB. O escopo real tem seis CRUDs: Produtos/Insumos, Fornecedores, Contas a Pagar, Contas a Receber, Usuários e Avisos. Outras páginas são protótipos. A arquitetura separa interface, comunicação REST, regras de negócio e persistência. Para demonstrar reuso, aplicamos Strategy aos cálculos de encargos e descontos; Factory Method à criação de avisos e lançamentos; e Observer aos alertas de estoque mínimo e vencimentos. Também planejamos possíveis variações de módulos com conceitos de linha de produto de software.”

## 9. Perguntas de compreensão

1. Qual a diferença entre escopo visual e escopo funcional?
2. Por que a tela Estoque pode ser mockada enquanto há um Observer real de estoque?
3. Como os seis CRUDs se distribuem entre três integrantes?
4. O que significa “dois exemplos” de Strategy? São duas classes ou dois contextos de aplicação?
5. Por que uma prova de autoria exige saber a localização e o papel das classes, e não apenas apresentar a interface?
