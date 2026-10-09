# AMT Solution — Escopo acadêmico (Etapa 01)

## Objetivo e limites

Esta etapa prepara o frontend React em JavaScript/JSX, mantendo a aparência do protótipo e seus dados simulados. Não haverá backend, MySQL, autenticação, APIs, PDV, caixa, pedidos de compra ou relatórios reais nesta etapa.

Os requisitos confirmados são: pelo menos 10 classes Java relevantes; três padrões de projeto distintos, com dois usos executáveis de cada; duas telas CRUD por integrante; ao menos três tabelas relacionadas; e planejamento de variabilidade para uma Linha de Produto de Software.

## Módulos com CRUD e divisão da equipe

| Integrante | Telas com integração futura |
| --- | --- |
| 1 | Produtos; Fornecedores |
| 2 | Contas a Pagar; Contas a Receber |
| 3 | Usuários; Avisos |

Até a Etapa 02, essas telas também permanecem alimentadas pelos mocks do protótipo. As demais permanecem somente como protótipo: Login, Dashboard, PDV, Caixa, Estoque, Pedidos de Compra, Visão Financeira, Relatórios e Permissões e Módulos.

## Padrões planejados para as próximas etapas

| Padrão | Exemplo 1 | Exemplo 2 |
| --- | --- | --- |
| Strategy | Estratégias de encargos da Conta a Pagar (sem juros, juros simples ou multa/juros). | Estratégias de descontos da Conta a Receber (sem desconto, percentual ou por antecipação). |
| Factory Method | `AvisoCreator` cria `AvisoManual` e `AvisoAutomatico`. | `LancamentoFinanceiroCreator` cria `ContaPagar` e `ContaReceber`. |
| Observer | Estoque de Produto notifica Avisos quando chega ao mínimo. | Conta a Pagar notifica Avisos quando estiver próxima do vencimento. |

Os padrões não são implementados agora. Na implementação, os criadores e produtos concretos serão classes separadas, e os observadores serão acionados pelos módulos reais, não por telas isoladas.

## Proposta de classes Java

1. `Produto`: id, sku, nome, preço, estoque e estoqueMínimo; métodos `baixarEstoque()` e `estaAbaixoDoMinimo()`.
2. `Fornecedor`: id, nome, CNPJ, contato e status; métodos `ativar()` e `desativar()`.
3. `ContaPagar`: id, descrição, vencimento, valor e situação; métodos `calcularEncargos()` e `registrarPagamento()`.
4. `ContaReceber`: id, descrição, cliente, vencimento, valor e situação; métodos `calcularDesconto()` e `registrarRecebimento()`.
5. `Usuario`: id, nome, e-mail, cargo, perfil e status; métodos `ativar()` e `desativar()`.
6. `Aviso`: id, título, conteúdo, prioridade, público e situação; métodos `publicar()` e `arquivar()`.
7. `AvisoManual`: especialização de Aviso; método `validarPublicacao()`.
8. `AvisoAutomatico`: especialização de Aviso; campos origem e referência; método `gerarMensagem()`.
9. `LancamentoFinanceiro`: base para lançamentos, com id, descrição, valor e vencimento; método `validar()`.
10. `EstrategiaEncargo`: contrato com `calcular(valor, diasAtraso)`; implementações `SemEncargo`, `JurosSimples` e `MultaJuros`.
11. `EstrategiaDesconto`: contrato com `calcular(valor, diasAntecipacao)`; implementações `SemDesconto`, `DescontoPercentual` e `DescontoAntecipacao`.
12. `CentralAvisos`: observador que recebe eventos de estoque baixo e vencimento próximo; método `atualizar(evento)`.

## Proposta do banco MySQL

| Tabela | Atributos principais | Chaves e relacionamento |
| --- | --- | --- |
| `fornecedores` | `id BIGINT`, `nome VARCHAR(150)`, `cnpj VARCHAR(18)`, `contato VARCHAR(100)`, `telefone VARCHAR(20)`, `email VARCHAR(150)`, `ativo BOOLEAN` | PK `id`; `cnpj` único. |
| `produtos` | `id BIGINT`, `sku VARCHAR(50)`, `nome VARCHAR(150)`, `categoria VARCHAR(80)`, `preco DECIMAL(10,2)`, `unidade VARCHAR(10)`, `estoque INT`, `estoque_minimo INT`, `alergenos TEXT`, `ativo BOOLEAN`, `fornecedor_id BIGINT NULL` | PK `id`; `sku` único; FK `fornecedor_id` → `fornecedores.id`. |
| `contas_pagar` | `id BIGINT`, `descricao VARCHAR(200)`, `categoria VARCHAR(80)`, `vencimento DATE`, `valor DECIMAL(10,2)`, `situacao VARCHAR(20)`, `data_pagamento DATE NULL`, `fornecedor_id BIGINT NULL` | PK `id`; FK opcional `fornecedor_id` → `fornecedores.id`. |
| `contas_receber` | `id BIGINT`, `descricao VARCHAR(200)`, `categoria VARCHAR(80)`, `cliente VARCHAR(150)`, `vencimento DATE`, `valor DECIMAL(10,2)`, `situacao VARCHAR(20)`, `data_recebimento DATE NULL` | PK `id`. |
| `usuarios` | `id BIGINT`, `nome VARCHAR(150)`, `email VARCHAR(150)`, `cargo VARCHAR(100)`, `perfil VARCHAR(80)`, `ativo BOOLEAN` | PK `id`; `email` único. |
| `avisos` | `id BIGINT`, `titulo VARCHAR(200)`, `corpo TEXT`, `prioridade VARCHAR(20)`, `publico VARCHAR(50)`, `inicio DATE`, `fim DATE`, `situacao VARCHAR(20)`, `tipo VARCHAR(20)`, `usuario_id BIGINT NULL` | PK `id`; FK opcional `usuario_id` → `usuarios.id`. |

As relações necessárias são Fornecedor–Produto (1:N), Fornecedor–ContaPagar (1:N) e Usuário–Aviso (1:N, opcional para avisos automáticos). Cada tabela usará `BIGINT AUTO_INCREMENT` na chave primária.

## Variabilidade: Linha de Produto

Funcionalidades comuns: usuários, produtos, fornecedores, avisos e financeiro básico. Funcionalidades opcionais: PDV, caixa, estoque avançado, compras, relatórios e produção.

Configuração **Cafeteria**: comuns + PDV, caixa, estoque, compras e produção. Configuração **Empresa de catering**: comuns + contas a receber, relatórios e estoque; PDV e caixa desativados. O caixa depende de PDV; pedidos de compra dependem de fornecedores e estoque; produção depende de produtos e estoque.

No futuro, a configuração pode ser armazenada em uma tabela de módulos por estabelecimento e aplicada no backend para autorizar rotas, com o frontend usando uma lista de módulos habilitados para montar a navegação. Esta etapa não cria essa infraestrutura.

## Próximas etapas

1. Validar a modelagem e criar o banco MySQL local.
2. Criar o Spring Boot Java 17, entidades, repositórios, serviços e controladores dos seis CRUDs.
3. Implementar os três padrões nos fluxos indicados e criar os avisos automáticos mínimos.
4. Integrar somente as seis telas selecionadas, testar CRUDs e documentar a demonstração individual.

## Testes da Etapa 01

- Dependências instaladas com `npm install`.
- Build executado com `npm run build` após a conversão.
- Rotas preservadas em `src/App.jsx`: login, dashboard, PDV, caixa, produtos, estoque, fornecedores, pedidos, financeiro, contas a pagar/receber, relatórios, avisos, usuários e permissões.
- Não há teste automatizado ou navegador automatizado configurado no projeto; as interações visuais devem ser conferidas manualmente no preview local.
