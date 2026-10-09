# Validação final — AMT Solution

## Resultado executivo

O projeto atende ao escopo acadêmico parcial: seis CRUDs reais, três padrões com dois usos reais cada, banco relacional e planejamento de variabilidade. As telas fora dos seis CRUDs permanecem propositalmente como protótipo. A validação visual em navegador continua **PENDENTE**, pois não há automação de navegador neste ambiente.

## Matriz dos requisitos acadêmicos

| Requisito | Resultado | Evidência real |
| --- | --- | --- |
| 10+ classes Java relevantes | Atendido | Entidades, services, controllers e 27 classes de padrões em `Backend/src/main/java` |
| 3 padrões distintos | Atendido | `patterns/strategy`, `patterns/factory`, `patterns/observer` |
| 2 usos reais de cada padrão | Atendido | Encargos/descontos; avisos/lançamentos; estoque/vencimento |
| 6 telas CRUD | Atendido no backend e integração React | Produtos, Fornecedores, Contas a Pagar/Receber, Usuários e Avisos |
| 3+ tabelas relacionadas | Atendido | Seis tabelas; FKs fornecedor-produto/conta e origens de aviso |
| Variabilidade planejada | Atendido | [VARIABILIDADE_LPS.md](VARIABILIDADE_LPS.md) |

## Auditoria estrutural

- `Frontend` e `Backend` são projetos independentes.
- O frontend usa `.js`/`.jsx`; não há TypeScript no código da aplicação.
- O React preserva as rotas de Login, Dashboard, PDV, Caixa, Produtos, Estoque, Fornecedores, Pedidos, Financeiro, Contas, Relatórios, Avisos, Usuários e Permissões em `src/App.jsx`.
- `application.properties` usa Hibernate `ddl-auto=validate`: a API não recria nem altera o banco.
- As entidades JPA correspondem às seis tabelas de `database/01_schema.sql`.
- As páginas não integradas permanecem mockadas, conforme escopo.

## Situação dos seis CRUDs

| Tela | API e persistência | React integrado | Observação |
| --- | --- | --- | --- |
| Produtos | POST/GET/PUT/DELETE lógico | Sim | Atualização abaixo do mínimo notifica Observer |
| Fornecedores | POST/GET/PUT/DELETE lógico | Sim | Mantém relações opcionais |
| Contas a Pagar | CRUD físico + PATCH `PAGO` | Sim | Simulação de encargo e verificação de vencimentos |
| Contas a Receber | CRUD físico + PATCH `RECEBIDO` | Sim | Simulação de desconto |
| Usuários | CRUD com DELETE lógico | Sim | `senha_hash` não é exposto |
| Avisos | CRUD físico e arquivamento por PUT | Sim | Avisos manuais e automáticos persistidos |

Os fluxos HTTP dos CRUDs foram validados nas etapas 04.1 e 05. A confirmação visual de formulário, filtros, modal e toast ainda requer execução manual no navegador.

## Seis exemplos de padrões

| Padrão | Exemplo | Classes/evidência |
| --- | --- | --- |
| Strategy | Encargos | `CalculoEncargoStrategy`, três estratégias, `ContextoEncargo`, `ContaPagarService.simularEncargos` |
| Strategy | Descontos | `CalculoDescontoStrategy`, três estratégias, `ContextoDesconto`, `ContaReceberService.simularDesconto` |
| Factory Method | Avisos | `CriadorAviso`, criadores manual/automático, `AvisoService` |
| Factory Method | Lançamentos | `CriadorLancamentoFinanceiro`, criadores de pagar/receber, services financeiros |
| Observer | Estoque mínimo | `SujeitoProduto` → `ObservadorEstoqueBaixo` → `AvisoService` |
| Observer | Vencimento | `SujeitoVencimento` → `ObservadorVencimentoProximo` → `AvisoService` |

As chaves `ESTOQUE:{produtoId}` e `VENCIMENTO:{contaId}:{vencimento}` evitam avisos equivalentes duplicados. Mais detalhes e diagramas estão em [PADROES_DE_PROJETO.md](../../Backend/docs/PADROES_DE_PROJETO.md).

## Classes relevantes para a prova

| Classe | Pacote | Responsabilidade e relações |
| --- | --- | --- |
| `Produto` | `model` | Entidade de catálogo; relaciona-se opcionalmente a `Fornecedor` e pode originar `Aviso` |
| `Fornecedor` | `model` | Entidade de fornecedor de produtos e contas |
| `ContaPagar` | `model` | Despesa, vencimento, estratégia e valores de encargo |
| `ContaReceber` | `model` | Recebível, cliente, estratégia e valores de desconto |
| `Usuario` | `model` | Usuário, perfil e hash protegido de senha |
| `Aviso` | `model` | Comunicado manual/automático e referências de origem |
| `ProdutoService` | `service` | CRUD de produto e publicação de evento de estoque |
| `ContaPagarService` | `service` | CRUD, Strategy de encargo e Factory de conta a pagar |
| `ContaReceberService` | `service` | CRUD, Strategy de desconto e Factory de conta a receber |
| `AvisoService` | `service` | CRUD e persistência originada pelos criadores/observers |
| `SujeitoProduto` | `patterns.observer` | Publica `EventoProduto` para observadores registrados pelo Spring |
| `ObservadorEstoqueBaixo` | `patterns.observer` | Avalia mínimo e solicita aviso automático |
| `VerificadorVencimentosService` | `service` | Busca contas elegíveis e publica eventos financeiros |
| `ContextoEncargo` | `patterns.strategy` | Seleciona Strategy por interface e calcula sem persistir |
| `ContextoDesconto` | `patterns.strategy` | Seleciona Strategy por interface e limita desconto |
| `CriadorAviso` | `patterns.factory` | Fluxo comum e Factory Method para avisos |
| `CriadorLancamentoFinanceiro` | `patterns.factory` | Factory Method abstrato para lançamentos financeiros |

## Testes executados nesta auditoria

| Verificação | Resultado |
| --- | --- |
| `mvn test` | 4 executados, 4 aprovados, 0 falhos, 0 ignorados (`PadroesTest`) |
| `mvn package` | Aprovado |
| `npm run build` | Aprovado |
| MariaDB | Disponível em `localhost:3306` durante as validações anteriores |
| API final | Seis `GET` retornaram HTTP 200: fornecedores 5, produtos 6, contas a pagar 2, contas a receber 1, usuários 4, avisos 6 |
| Strategy HTTP | `SEM_ENCARGO` retornou ajuste 0 sobre R$ 420; `SEM_DESCONTO` retornou ajuste 0 sobre R$ 100 |

O build Vite emitiu avisos não bloqueantes sobre `__dirname`, importação JSON sem atributos e chunk maior que 500 kB. Não houve erro de compilação.

## Variabilidade

O planejamento é conceitual e não ativa módulos dinamicamente. O Feature Model, dependências, variantes Loja de Doces e Prestador de Serviços, exemplo inválido e distinção de permissões estão em [VARIABILIDADE_LPS.md](VARIABILIDADE_LPS.md). Ele declara corretamente que PDV, Caixa, Estoque, Pedidos e Relatórios são telas de protótipo sem backend integrado.

## Pendências e limitações

1. Teste visual/manual das seis telas: **pendente**. Executar o roteiro abaixo com backend, MariaDB e Vite ativos.
2. Login não é autenticação de produção.
3. Não é um ERP completo; módulos fora dos seis CRUDs continuam mockados.
4. Variabilidade é planejamento acadêmico, sem seleção dinâmica implementada.
5. Registros de demonstração de Observer são preservados quando avisos referenciam a origem, para manter integridade histórica.

### Roteiro manual de UI

Em cada tela integrada, crie um registro `MANUAL-07-*`, confirme a linha, edite, atualize o navegador e valide persistência. Desative Produto/Fornecedor/Usuário; exclua Conta/Aviso; confirme toast e listagem. Use **Pagar**, **Receber** e **Arquivar**. Teste pesquisa/filtros e um formulário inválido, verificando a mensagem de erro sem fechar o drawer. Nas páginas mockadas, confirme apenas a navegação/interação de protótipo, sem alegar persistência.

## Problemas encontrados nesta auditoria

Não foi encontrada falha de código que exigisse correção. Uma chamada PowerShell de auditoria montou inicialmente uma URL de Strategy com dois IDs; a URL foi corrigida no comando e o endpoint respondeu normalmente. Nenhum arquivo de aplicação foi alterado por essa auditoria.
