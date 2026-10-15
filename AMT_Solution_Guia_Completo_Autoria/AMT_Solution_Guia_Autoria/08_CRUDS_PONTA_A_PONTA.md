# 08 — Os seis CRUDs: cada operação, validação e integração

## 1. CRUD: conceito e prova de implementação

CRUD = **Create (Criar)**, **Read (Ler)**, **Update (Atualizar)** e **Delete (Excluir)**. No projeto, todos os seis módulos reais possuem operações que percorrem React → JS service → REST Controller → Java Service → JPA Repository → MariaDB.

Uma prova de CRUD real exige mais que botões: criar um registro, recarregar a página e encontrá-lo persistido; atualizá-lo e ver a nova informação; excluí-lo quando a integridade permitir; verificar que as operações são realmente enviadas à API.

## 2. Estrutura comum dos seis fluxos

**Listar:** `useEffect` chama `carregar()` → `service.listar()` → GET → `Controller.listar` → `Service.listar` → `repository.findAll()` → mapeamento JS → estado da tabela.

**Criar:** botão abre drawer/modal → campos em estado → validação básica → `service.criar` POST → `@Valid Request` → Service cria/preenche e `repository.save` → HTTP 201 → refresh da lista.

**Editar:** seleção carrega formulário → `service.atualizar(id, form)` PUT → Service busca entidade e altera campos → `save` → refresh.

**Excluir:** confirmação explícita → `service.excluir(id)` DELETE → Service aplica integridade → `delete`/`flush` → HTTP 204 ou erro → refresh apenas se sucesso.

**Alterações especiais:** PATCH status ativo para Produtos/Fornecedores/Usuários; PATCH situação para contas; PUT de aviso para arquivamento.

## 3. Integrante 1 — Produtos e Insumos

**Tela:** `Frontend/src/pages/Produtos.jsx`. **Service JS:** `produtosService.js`. **Controller:** `ProdutoController.java`. **Service Java:** `ProdutoService.java`. **Repository:** `ProdutoRepository.java`. **Tabela:** `produtos`.

- O estado `tab` seleciona Produtos ou Insumos, mas ambos vêm do mesmo endpoint `/api/produtos`.
- A conversão `map()` expõe `codigo` como `sku`, `precoVenda` como `preco`, `quantidadeEstoque` como `estoque` e `quantidadeMinima` como `estoqueMinimo`.
- `payload(p, tipo)` envia `tipo` como `PRODUTO` ou `INSUMO`; para insumo, `precoVenda` pode ser `null`.
- `ProdutoRequest` valida `tipo` via `@Pattern(PRODUTO|INSUMO)`, campos obrigatórios e quantidades não negativas.
- `ProdutoService` impede código duplicado com `existsByCodigo`/`existsByCodigoAndIdNot` e resolve fornecedor por ID, se informado.
- **Observer:** depois de `criar` ou `atualizar`, publica `EventoProduto`. O observador testa se está ativo e se estoque **menor ou igual** ao mínimo; o aviso pode ser persistido.
- Status: `PATCH /api/produtos/{id}/ativo`. Exclusão: `DELETE /api/produtos/{id}`; bloqueada se houver avisos associados.

**Exemplo de defesa:** “Produto e insumo diferem pelo atributo `tipo`, mas compartilham entidade e tabela. O Service garante unicidade de código e, após salvar, publica evento de estoque para os observadores.”

## 4. Integrante 1 — Fornecedores

**Tela:** `Fornecedores.jsx`. **JS:** `fornecedoresService.js`. **Java:** `FornecedorController`, `FornecedorService`, `FornecedorRepository`, `FornecedorRequest`. **Tabela:** `fornecedores`.

- A tela utiliza `cnpj`; a API espera `documento`. `map()` e `payload()` fazem a conversão.
- DTO requer `nome`, `documento`, `contato`, `telefone`, `email` válido e `ativo` não nulo.
- Service impede documento duplicado, inclusive ao editar (`existsByDocumentoAndIdNot`).
- PATCH `/ativo` altera cadastro sem removê-lo. DELETE tenta remover permanentemente.
- No SQL, vínculos de Produtos e Contas Pagar ao fornecedor usam `ON DELETE SET NULL`; essa é a regra do esquema, diferente das FKs de avisos que usam RESTRICT.

**Por que essa tela não usa padrão GoF específico?** A atividade exige dois exemplos por padrão no sistema, e não um padrão em cada CRUD. Um CRUD simples é válido quando não precisa de uma abstração extra.

## 5. Integrante 2 — Contas a Pagar

**Tela:** `ContasPagar.jsx`. **JS:** `contasPagarService.js`. **Controller:** `ContaPagarController`. **Service:** `ContaPagarService`. **Tabela:** `contas_pagar`.

- `ContasPagarRequest` exige descrição, categoria, vencimento, valor original positivo, parâmetros financeiros não negativos e situação dentro de conjunto permitido.
- POST real usa `CriadorContaPagar` (**Factory Method**) para produzir a entidade antes de `repository.save(preencher(...))`.
- Há PATCH `/{id}/situacao` com conjunto permitido `PENDENTE`, `PAGO`, `VENCIDO`, `CANCELADO`.
- O botão `Simular` abre modal e chama GET `/{id}/simulacao-encargos`, com escolha entre `JUROS_DIARIOS` e `MULTA_PERCENTUAL`; **Strategy** calcula e devolve `ResultadoCalculo` sem salvar novo valor.
- O botão `Verificar vencimentos` chama POST `/verificar-vencimentos`: o `VerificadorVencimentosService` publica eventos para contas `PENDENTE`/`VENCIDO` com vencimento **entre hoje e hoje + 3 dias**; o **Observer** gera avisos.
- Exclusão física é bloqueada pelo Service se houver aviso referenciando a conta.
- Mensagem `contasVerificadas` indica número de contas percorridas na verificação, **não** quantidade de novos avisos.

**Exemplo de defesa:** “Em uma tela financeira demonstramos três padrões, em responsabilidades diferentes: fábrica para criação, estratégia para cálculo independente e observador para evento de vencimento.”

## 6. Integrante 2 — Contas a Receber

**Tela:** `ContasReceber.jsx`. **JS:** `contasReceberService.js`. **Java:** `ContaReceberController`, `ContaReceberService`, `ContaReceberRepository`, `ContaReceberRequest`. **Tabela:** `contas_receber`.

- DTO exige `cliente`, valor positivo, vencimento, categoria, estratégia persistida válida e situação permitida.
- `ContaReceberService.criar` utiliza `CriadorContaReceber` (**Factory Method**).
- PATCH situação permite `PENDENTE`, `RECEBIDO`, `VENCIDO`, `CANCELADO`.
- GET `/{id}/simulacao-descontos` seleciona `PERCENTUAL` ou `VALOR_FIXO` via **Strategy**; retorno não altera valor original nem situação.
- O modal React chama `contasReceberService.simularDescontos`, com parâmetros encaminhados à API, e apresenta o resultado.
- DELETE exclui fisicamente quando a operação é permitida pelo banco.

**Por que Strategy é diferente do cadastro de desconto?** Os campos persistidos (`estrategiaDesconto`, etc.) e a simulação pelo endpoint são capacidades distintas. O modal de simulação realiza cálculo sobre `valorOriginal` sem executar PUT no cadastro.

## 7. Integrante 3 — Usuários

**Tela:** `Usuarios.jsx`. **JS:** `usuariosService.js`. **Java:** `UsuarioController`, `UsuarioService`, `UsuarioRepository`, `UsuarioRequest`. **Tabela:** `usuarios`.

- DTO exige nome, e-mail válido, cargo, perfil e `ativo`; se enviada, senha deve respeitar tamanho 8–100.
- `UsuarioService` verifica e-mail duplicado, inclusive em edição.
- `PasswordConfig` fornece um `PasswordEncoder` BCrypt. Se a senha for enviada preenchida, o Service grava **hash**, não o texto.
- O campo `senhaHash` no Model possui `@JsonIgnore`, evitando enviá-lo no JSON da entidade.
- Na edição, deixar a senha vazia/nula preserva o hash existente; o service JS envia `senha: null` se o formulário está vazio.
- PATCH `/ativo` é diferente do DELETE físico.
- **Limite real:** o Login visual não usa um Controller de autenticação; cadastro com senha segura não significa autenticação/controle de permissões implementados.

## 8. Integrante 3 — Avisos

**Tela:** `Avisos.jsx`. **JS:** `avisosService.js`. **Java:** `AvisoController`, `AvisoService`, `AvisoRepository`, `AvisoRequest`. **Tabela:** `avisos`.

- Um aviso pode ser `MANUAL`, `ESTOQUE_BAIXO` ou `VENCIMENTO_PROXIMO`; possui título, corpo, prioridade, público, período e situação (`RASCUNHO`, `PUBLICADO`, `ARQUIVADO`).
- Aviso manual: `AvisoService.criar` usa `CriadorAvisoManual` (**Factory Method**), valida chave de evento e persiste.
- Avisos automáticos: Observers acionam `AvisoService.criarAvisoEstoque` ou `criarAvisoVencimento`; `CriadorAvisoAutomatico` produz objetos apropriados.
- `AvisoRepository.existsByChaveEvento` evita duplicar alertas do mesmo evento; a tabela também usa restrição `UNIQUE` na chave.
- Arquivar: a tela atualiza `situacao` para `ARQUIVADO` por PUT, mantendo o registro.
- Excluir: DELETE tenta remover a linha definitivamente.
- FKs opcionais permitem saber se um alerta se originou de produto, conta a pagar ou usuário.

## 9. Comparação rápida das validações de unicidade

| Entidade | Campo-chave de negócio | Verificação no Service |
|---|---|---|
| Produto | `codigo` | `existsByCodigo` |
| Fornecedor | `documento` | `existsByDocumento` |
| Usuário | `email` | `existsByEmail` |
| Aviso automático | `chaveEvento` | `existsByChaveEvento` |

Há ainda unicidades correspondentes no SQL. Não generalize que qualquer campo do projeto é único: somente os indicados e os IDs.

## 10. Exercícios de rastreamento

Para **cada** um dos seis CRUDs, abra os arquivos na ordem: `Página.jsx` → `services/*Service.js` → `*Controller.java` → `*Request.java` → `*Service.java` → `*Repository.java` → `*Entity.java` → `01_schema.sql`. Responda:

1. Qual campo visual usa nome diferente da API?
2. Qual método HTTP implementa a operação?
3. Qual validação impede entrada inválida?
4. Qual validação evita duplicidade ou perda de integridade?
5. Qual tabela é usada?
6. O que o frontend mostra em sucesso e falha?
7. Em quais dessas etapas há uso de Strategy/Factory/Observer?

## 11. Atenções honestas na apresentação

- A conclusão da auditoria por leitura estática e os testes manuais do grupo indicam funcionamento. A apostila não declara que foi reexecutado o navegador nesta geração.
- Excluir pode falhar por FK mesmo com botão visível; isso **é integridade**, não necessariamente defeito.
- `Ativo` não é sinônimo de `Publicado`; módulos têm estados específicos.
- Valores de simulação são calculados no Java; não confundir com registrar pagamento/recebimento efetivo.
- Nenhum CRUD de venda foi incluído entre os seis reais, apesar do PDV visível.
