# 20 — Dicionário detalhado de entidades, DTOs e métodos Java

> Documento de consulta técnica **extraído programaticamente dos arquivos Java reais**. Os trechos estão reproduzidos em sua sintaxe relevante para permitir localizar campos e assinaturas. Eles **não são arquivos Java executáveis** (alguns imports ou corpos são intencionalmente omitidos). Leia junto aos capítulos 06–08.

## 1. Como interpretar os membros

- Campo `private`: dado encapsulado no objeto.
- `Long id`: identificador persistido como chave primária.
- `BigDecimal`: dinheiro/quantidade decimal; `LocalDate`: data; `LocalDateTime`: data/hora.
- `Boolean ativo`: disponibilidade sem remover cadastro.
- Objetos `Fornecedor`, `Produto`, `ContaPagar`, `Usuario` em outra entidade normalmente correspondem a relacionamentos anotados.
- Anotações `@Column`, `@JoinColumn`, `@JsonIgnore`, `@ManyToOne` definem mapeamento/serialização.

## 2. Inventário exato dos campos declarados nas seis entidades JPA

### `Aviso.java` — tabela associada

**Tabela:** `avisos`. **Local:** `Backend/src/main/java/com/amtsolution/model/Aviso.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `titulo` | @Column(nullable = false, length = 200) |
| `String` | `corpo` | @Column(nullable = false, columnDefinition = "TEXT") |
| `String` | `tipo` | @Column(nullable = false, length = 25) |
| `String` | `prioridade` | @Column(nullable = false, length = 10) |
| `String` | `publico` | @Column(nullable = false, length = 50) |
| `LocalDate` | `inicio` | @Column(nullable = false) |
| `LocalDate` | `fim` | — |
| `String` | `situacao` | @Column(nullable = false, length = 20) |
| `String` | `chaveEvento` | @Column(name = "chave_evento", unique = true, length = 120) |
| `Produto` | `produtoOrigem` | @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "produto_origem_id") @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) |
| `ContaPagar` | `contaPagarOrigem` | @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "conta_pagar_origem_id") @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) |
| `Usuario` | `criadoPorUsuario` | @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "criado_por_usuario_id") @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "senhaHash" }) |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

### `ContaPagar.java` — tabela associada

**Tabela:** `contas_pagar`. **Local:** `Backend/src/main/java/com/amtsolution/model/ContaPagar.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `descricao` | @Column(nullable = false, length = 200) |
| `String` | `categoria` | @Column(nullable = false, length = 80) |
| `Fornecedor` | `fornecedor` | @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "fornecedor_id") @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) |
| `LocalDate` | `vencimento` | @Column(nullable = false) |
| `BigDecimal` | `valorOriginal` | @Column(name = "valor_original", nullable = false, precision = 10, scale = 2) |
| `String` | `estrategiaEncargo` | @Column(name = "estrategia_encargo", nullable = false, length = 20) |
| `BigDecimal` | `percentualJuros` | @Column(name = "percentual_juros", nullable = false, precision = 5, scale = 2) |
| `BigDecimal` | `percentualMulta` | @Column(name = "percentual_multa", nullable = false, precision = 5, scale = 2) |
| `BigDecimal` | `valorEncargos` | @Column(name = "valor_encargos", nullable = false, precision = 10, scale = 2) |
| `String` | `situacao` | @Column(nullable = false, length = 20) |
| `LocalDate` | `dataPagamento` | @Column(name = "data_pagamento") |
| `BigDecimal` | `valorPago` | @Column(name = "valor_pago", precision = 10, scale = 2) |
| `String` | `formaPagamento` | @Column(name = "forma_pagamento", length = 30) |
| `String` | `observacao` | @Column(columnDefinition = "TEXT") |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

### `ContaReceber.java` — tabela associada

**Tabela:** `contas_receber`. **Local:** `Backend/src/main/java/com/amtsolution/model/ContaReceber.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `descricao` | @Column(nullable = false, length = 200) |
| `String` | `categoria` | @Column(nullable = false, length = 80) |
| `String` | `cliente` | @Column(nullable = false, length = 150) |
| `LocalDate` | `vencimento` | @Column(nullable = false) |
| `BigDecimal` | `valorOriginal` | @Column(name = "valor_original", nullable = false, precision = 10, scale = 2) |
| `String` | `estrategiaDesconto` | @Column(name = "estrategia_desconto", nullable = false, length = 20) |
| `BigDecimal` | `percentualDesconto` | @Column(name = "percentual_desconto", nullable = false, precision = 5, scale = 2) |
| `BigDecimal` | `valorDesconto` | @Column(name = "valor_desconto", nullable = false, precision = 10, scale = 2) |
| `String` | `situacao` | @Column(nullable = false, length = 20) |
| `LocalDate` | `dataRecebimento` | @Column(name = "data_recebimento") |
| `BigDecimal` | `valorRecebido` | @Column(name = "valor_recebido", precision = 10, scale = 2) |
| `String` | `formaRecebimento` | @Column(name = "forma_recebimento", length = 30) |
| `String` | `observacao` | @Column(columnDefinition = "TEXT") |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

### `Fornecedor.java` — tabela associada

**Tabela:** `fornecedores`. **Local:** `Backend/src/main/java/com/amtsolution/model/Fornecedor.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `nome` | @Column(nullable = false, length = 150) |
| `String` | `documento` | @Column(nullable = false, unique = true, length = 18) |
| `String` | `contato` | @Column(nullable = false, length = 100) |
| `String` | `telefone` | @Column(nullable = false, length = 20) |
| `String` | `email` | @Column(nullable = false, length = 150) |
| `Boolean` | `ativo` | @Column(nullable = false) |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

### `Produto.java` — tabela associada

**Tabela:** `produtos`. **Local:** `Backend/src/main/java/com/amtsolution/model/Produto.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `tipo` | @Column(nullable = false, length = 10) |
| `String` | `codigo` | @Column(nullable = false, unique = true, length = 50) |
| `String` | `nome` | @Column(nullable = false, length = 150) |
| `String` | `categoria` | @Column(nullable = false, length = 80) |
| `String` | `unidade` | @Column(nullable = false, length = 10) |
| `BigDecimal` | `precoVenda` | @Column(name = "preco_venda", precision = 10, scale = 2) |
| `BigDecimal` | `quantidadeEstoque` | @Column(name = "quantidade_estoque", nullable = false, precision = 12, scale = 3) |
| `BigDecimal` | `quantidadeMinima` | @Column(name = "quantidade_minima", nullable = false, precision = 12, scale = 3) |
| `String` | `alergenos` | @Column(columnDefinition = "TEXT") |
| `String` | `lote` | @Column(length = 50) |
| `LocalDate` | `dataValidade` | @Column(name = "data_validade") |
| `Boolean` | `ativo` | @Column(nullable = false) |
| `Fornecedor` | `fornecedor` | @ManyToOne(fetch = FetchType.EAGER) @JoinColumn(name = "fornecedor_id") @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" }) |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

### `Usuario.java` — tabela associada

**Tabela:** `usuarios`. **Local:** `Backend/src/main/java/com/amtsolution/model/Usuario.java`.

| Tipo Java | Campo | Evidência de restrição/relacionamento |
|---|---|---|
| `Long` | `id` | @Id @GeneratedValue(strategy = GenerationType.IDENTITY) |
| `String` | `nome` | @Column(nullable = false, length = 150) |
| `String` | `email` | @Column(nullable = false, unique = true, length = 150) |
| `String` | `cargo` | @Column(nullable = false, length = 100) |
| `String` | `perfil` | @Column(nullable = false, length = 80) |
| `String` | `senhaHash` | @JsonIgnore @Column(name = "senha_hash", length = 255) |
| `Boolean` | `ativo` | @Column(nullable = false) |
| `LocalDateTime` | `criadoEm` | @Column(name = "criado_em", insertable = false, updatable = false) |
| `LocalDateTime` | `atualizadoEm` | @Column(name = "atualizado_em", insertable = false, updatable = false) |

## 3. Contratos de entrada dos oito DTOs

Os `record`s listados abaixo correspondem aos parâmetros recebidos por métodos de Controller. As anotações de validação aparecem nos tipos/campos. Observe que **DTOs não são novas tabelas**.

### `AtivoRequest.java`

```java
public record AtivoRequest(@NotNull Boolean ativo);
```

### `AvisoRequest.java`

```java
public record AvisoRequest(@NotBlank @Size(max = 200) String titulo, @NotBlank String corpo,
        @NotBlank @Pattern(regexp = "MANUAL|ESTOQUE_BAIXO|VENCIMENTO_PROXIMO") String tipo,
        @NotBlank @Pattern(regexp = "ALTA|MEDIA|BAIXA") String prioridade,
        @NotBlank @Size(max = 50) String publico,
        @NotNull LocalDate inicio, LocalDate fim,
        @NotBlank @Pattern(regexp = "RASCUNHO|PUBLICADO|ARQUIVADO") String situacao,
        @Size(max = 120) String chaveEvento, Long produtoOrigemId, Long contaPagarOrigemId,
        Long criadoPorUsuarioId);
```

### `ContaPagarRequest.java`

```java
public record ContaPagarRequest(
    @NotBlank @Size(max = 200) String descricao, @NotBlank @Size(max = 80) String categoria,
    Long fornecedorId, @NotNull LocalDate vencimento, @NotNull @DecimalMin("0.01") BigDecimal valorOriginal,
    @NotBlank @Pattern(regexp = "SEM_ENCARGO|JUROS_SIMPLES|MULTA_JUROS") String estrategiaEncargo,
    @NotNull @DecimalMin("0.00") BigDecimal percentualJuros,
    @NotNull @DecimalMin("0.00") BigDecimal percentualMulta,
    @NotNull @DecimalMin("0.00") BigDecimal valorEncargos,
    @NotBlank @Pattern(regexp = "PENDENTE|PAGO|VENCIDO|CANCELADO") String situacao,
    LocalDate dataPagamento, @DecimalMin("0.00") BigDecimal valorPago,
    @Size(max = 30) String formaPagamento, String observacao);
```

### `ContaReceberRequest.java`

```java
public record ContaReceberRequest(
        @NotBlank @Size(max = 200) String descricao,
        @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 150) String cliente, @NotNull LocalDate vencimento,
        @NotNull @DecimalMin("0.01") BigDecimal valorOriginal,
        @NotBlank @Pattern(regexp = "SEM_DESCONTO|PERCENTUAL|ANTECIPACAO") String estrategiaDesconto,
        @NotNull @DecimalMin("0.00") BigDecimal percentualDesconto,
        @NotNull @DecimalMin("0.00") BigDecimal valorDesconto,
        @NotBlank @Pattern(regexp = "PENDENTE|RECEBIDO|VENCIDO|CANCELADO") String situacao,
        LocalDate dataRecebimento,
        @DecimalMin("0.00") BigDecimal valorRecebido, @Size(max = 30) String formaRecebimento,
        String observacao);
```

### `FornecedorRequest.java`

```java
public record FornecedorRequest(
        @NotBlank @Size(max = 150) String nome, @NotBlank @Size(max = 18) String documento,
        @NotBlank @Size(max = 100) String contato, @NotBlank @Size(max = 20) String telefone,
        @NotBlank @Email @Size(max = 150) String email, @NotNull Boolean ativo);
```

### `ProdutoRequest.java`

```java
public record ProdutoRequest(
        @NotBlank @Pattern(regexp = "PRODUTO|INSUMO") String tipo,
        @NotBlank @Size(max = 50) String codigo,
        @NotBlank @Size(max = 150) String nome, @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 10) String unidade,
        @DecimalMin(value = "0.00", inclusive = true) BigDecimal precoVenda,
        @NotNull @DecimalMin("0.000") BigDecimal quantidadeEstoque,
        @NotNull @DecimalMin("0.000") BigDecimal quantidadeMinima, String alergenos,
        @Size(max = 50) String lote,
        LocalDate dataValidade, @NotNull Boolean ativo, Long fornecedorId);
```

### `SituacaoRequest.java`

```java
public record SituacaoRequest(@NotBlank String situacao);
```

### `UsuarioRequest.java`

```java
public record UsuarioRequest(
        @NotBlank @Size(max = 150) String nome, @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(max = 100) String cargo, @NotBlank @Size(max = 80) String perfil,
        @Size(min = 8, max = 100) String senha, @NotNull Boolean ativo);
```

## 4. Controllers: rotas e métodos da API

A rota completa é o prefixo `@RequestMapping` da classe somado à rota do método. `@Valid @RequestBody` pede desserialização e validação; `@PathVariable` recebe ID da URL; `@RequestParam` recebe parâmetros de consulta. A listagem abaixo decorre das anotações reais no código.

### `AvisoController.java` — `/api/avisos`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/avisos` | `listar()` |
| `GET` | `/api/avisos/{id}` | `buscar()` |
| `POST` | `/api/avisos` | `criar()` |
| `PUT` | `/api/avisos/{id}` | `atualizar()` |
| `DELETE` | `/api/avisos/{id}` | `excluir()` |

### `ContaPagarController.java` — `/api/contas-pagar`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/contas-pagar` | `listar()` |
| `GET` | `/api/contas-pagar/{id}` | `buscar()` |
| `POST` | `/api/contas-pagar` | `criar()` |
| `PUT` | `/api/contas-pagar/{id}` | `atualizar()` |
| `PATCH` | `/api/contas-pagar/{id}/situacao` | `situacao()` |
| `GET` | `/api/contas-pagar/{id}/simulacao-encargos` | `simular()` |
| `POST` | `/api/contas-pagar/verificar-vencimentos` | `verificarVencimentos()` |
| `DELETE` | `/api/contas-pagar/{id}` | `excluir()` |

### `ContaReceberController.java` — `/api/contas-receber`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/contas-receber` | `listar()` |
| `GET` | `/api/contas-receber/{id}` | `buscar()` |
| `POST` | `/api/contas-receber` | `criar()` |
| `PUT` | `/api/contas-receber/{id}` | `atualizar()` |
| `PATCH` | `/api/contas-receber/{id}/situacao` | `situacao()` |
| `GET` | `/api/contas-receber/{id}/simulacao-descontos` | `simular()` |
| `DELETE` | `/api/contas-receber/{id}` | `excluir()` |

### `FornecedorController.java` — `/api/fornecedores`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/fornecedores` | `listar()` |
| `GET` | `/api/fornecedores/{id}` | `buscar()` |
| `POST` | `/api/fornecedores` | `criar()` |
| `PUT` | `/api/fornecedores/{id}` | `atualizar()` |
| `PATCH` | `/api/fornecedores/{id}/ativo` | `alterarAtivo()` |
| `DELETE` | `/api/fornecedores/{id}` | `excluir()` |

### `ProdutoController.java` — `/api/produtos`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/produtos` | `listar()` |
| `GET` | `/api/produtos/{id}` | `buscar()` |
| `POST` | `/api/produtos` | `criar()` |
| `PUT` | `/api/produtos/{id}` | `atualizar()` |
| `PATCH` | `/api/produtos/{id}/ativo` | `alterarAtivo()` |
| `DELETE` | `/api/produtos/{id}` | `excluir()` |

### `UsuarioController.java` — `/api/usuarios`

| Método | Rota final | Assinatura Java (nome) |
|---|---|---|
| `GET` | `/api/usuarios` | `listar()` |
| `GET` | `/api/usuarios/{id}` | `buscar()` |
| `POST` | `/api/usuarios` | `criar()` |
| `PUT` | `/api/usuarios/{id}` | `atualizar()` |
| `PATCH` | `/api/usuarios/{id}/ativo` | `alterarAtivo()` |
| `DELETE` | `/api/usuarios/{id}` | `excluir()` |

## 5. Services: métodos definidos e ponto de responsabilidade

Para cada Service, identifique **métodos públicos de domínio** e **métodos privados de apoio**. Não é preciso memorizar todos os getters e setters das entidades; concentre-se nas operações que transformam dados ou aplicam regra. Abaixo há uma extração conservadora de linhas que contêm assinaturas visíveis no início da linha; métodos quebrados em várias linhas devem ser consultados no código.

### `AvisoService.java`

- Linha 30: `public AvisoService(AvisoRepository repository, ProdutoRepository produtos, ContaPagarRepository contas,`
- Linha 41: `public List<Aviso> listar() {`
- Linha 46: `public Aviso buscar(Long id) {`
- Linha 50: `public Aviso criar(AvisoRequest r) {`
- Linha 58: `public Aviso atualizar(Long id, AvisoRequest r) {`
- Linha 63: `public void excluir(Long id) {`
- Linha 68: `public void criarAvisoEstoque(Produto p, java.time.LocalDate data) {`
- Linha 81: `public void criarAvisoVencimento(ContaPagar c, java.time.LocalDate data) {`
- Linha 93: `private void validarChave(String chave, Long id) {`
- Linha 102: `private Aviso preencher(Aviso a, AvisoRequest r) {`
- Linha 118: `private String vazioParaNulo(String v) {`
- Linha 122: `private Produto produto(Long id) {`
- Linha 128: `private ContaPagar conta(Long id) {`
- Linha 134: `private Usuario usuario(Long id) {`

### `ContaPagarService.java`

- Linha 28: `public ContaPagarService(ContaPagarRepository repository, FornecedorRepository fornecedores, AvisoRepository avisos,`
- Linha 38: `public List<ContaPagar> listar() {`
- Linha 43: `public ContaPagar buscar(Long id) {`
- Linha 47: `public ContaPagar criar(ContaPagarRequest r) {`
- Linha 53: `public ResultadoCalculo simularEncargos(Long id, String estrategia, java.math.BigDecimal percentual, int dias) {`
- Linha 59: `public ContaPagar atualizar(Long id, ContaPagarRequest r) {`
- Linha 63: `public ContaPagar atualizarSituacao(Long id, String situacao) {`
- Linha 71: `public void excluir(Long id) {`
- Linha 81: `private ContaPagar preencher(ContaPagar c, ContaPagarRequest r) {`
- Linha 99: `private Fornecedor fornecedor(Long id) {`

### `ContaReceberService.java`

- Linha 22: `public ContaReceberService(ContaReceberRepository repository, CriadorContaReceber criador,`
- Linha 30: `public List<ContaReceber> listar() {`
- Linha 35: `public ContaReceber buscar(Long id) {`
- Linha 39: `public ContaReceber criar(ContaReceberRequest r) {`
- Linha 45: `public ResultadoCalculo simularDesconto(Long id, String estrategia, java.math.BigDecimal parametro, int dias) {`
- Linha 51: `public ContaReceber atualizar(Long id, ContaReceberRequest r) {`
- Linha 55: `public ContaReceber atualizarSituacao(Long id, String situacao) {`
- Linha 63: `public void excluir(Long id) {`
- Linha 68: `private ContaReceber preencher(ContaReceber c, ContaReceberRequest r) {`

### `FornecedorService.java`

- Linha 18: `public FornecedorService(FornecedorRepository repository) {`
- Linha 23: `public List<Fornecedor> listar() {`
- Linha 28: `public Fornecedor buscar(Long id) {`
- Linha 32: `public Fornecedor criar(FornecedorRequest r) {`
- Linha 38: `public Fornecedor atualizar(Long id, FornecedorRequest r) {`
- Linha 44: `public Fornecedor alterarAtivo(Long id, Boolean ativo) {`
- Linha 51: `public void excluir(Long id) {`
- Linha 56: `private Fornecedor preencher(Fornecedor f, FornecedorRequest r) {`

### `ProdutoService.java`

- Linha 25: `public ProdutoService(ProdutoRepository repository, FornecedorRepository fornecedores, AvisoRepository avisos,`
- Linha 34: `public List<Produto> listar() {`
- Linha 39: `public Produto buscar(Long id) {`
- Linha 43: `public Produto criar(ProdutoRequest r) {`
- Linha 52: `public Produto atualizar(Long id, ProdutoRequest r) {`
- Linha 60: `public Produto alterarAtivo(Long id, Boolean ativo) {`
- Linha 66: `public void excluir(Long id) {`
- Linha 75: `private Produto preencher(Produto p, ProdutoRequest r) {`
- Linha 92: `private Fornecedor fornecedor(Long id) {`

### `UsuarioService.java`

- Linha 20: `public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {`
- Linha 26: `public List<Usuario> listar() {`
- Linha 31: `public Usuario buscar(Long id) {`
- Linha 35: `public Usuario criar(UsuarioRequest r) {`
- Linha 41: `public Usuario atualizar(Long id, UsuarioRequest r) {`
- Linha 47: `public Usuario alterarAtivo(Long id, Boolean ativo) {`
- Linha 53: `public void excluir(Long id) {`
- Linha 58: `private Usuario preencher(Usuario u, UsuarioRequest r) {`

### `VerificadorVencimentosService.java`

- Linha 17: `public VerificadorVencimentosService(ContaPagarRepository contas, SujeitoVencimento sujeito) {`
- Linha 23: `public int verificar() {`

## 6. Repositories e consultas derivadas

As interfaces abaixo estendem `JpaRepository`. O Spring Data reconhece padrões de nomes de método, por exemplo `existsByEmail` e `findBySituacaoInAndVencimentoBetween`, gerando a consulta a partir do nome das propriedades da entidade. O código SQL efetivo depende do ORM, de suas configurações e do driver.

### `AvisoRepository.java`

- `public interface AvisoRepository extends JpaRepository<Aviso, Long> {`
- `boolean existsByChaveEvento(String chaveEvento);`
- `boolean existsByChaveEventoAndIdNot(String chaveEvento, Long id);`
- `boolean existsByProdutoOrigem_Id(Long produtoId);`
- `boolean existsByContaPagarOrigem_Id(Long contaPagarId);`

### `ContaPagarRepository.java`

- `public interface ContaPagarRepository extends JpaRepository<ContaPagar, Long> {`
- `List<ContaPagar> findBySituacaoInAndVencimentoBetween(Collection<String> situacoes, LocalDate inicio,`

### `ContaReceberRepository.java`

- `public interface ContaReceberRepository extends JpaRepository<ContaReceber, Long> {`

### `FornecedorRepository.java`

- `public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {`
- `boolean existsByDocumento(String documento);`
- `boolean existsByDocumentoAndIdNot(String documento, Long id);`

### `ProdutoRepository.java`

- `public interface ProdutoRepository extends JpaRepository<Produto, Long> {`
- `boolean existsByCodigo(String codigo);`
- `boolean existsByCodigoAndIdNot(String codigo, Long id);`

### `UsuarioRepository.java`

- `public interface UsuarioRepository extends JpaRepository<Usuario, Long> {`
- `boolean existsByEmail(String email);`
- `boolean existsByEmailAndIdNot(String email, Long id);`

## 7. Como usar este dicionário numa pergunta inesperada

1. O professor diz o nome de uma tela: encontre o recurso na tabela de Controllers.
2. Identifique o DTO validado e veja os nomes exatos dos campos.
3. Abra o Service e encontre o método correspondente.
4. Relacione os campos da entidade à tabela do banco.
5. Se houver regra de cálculo, objeto criado por fábrica ou evento, consulte os capítulos 09–11.
6. Se alguma assinatura do projeto local divergir desta cópia, priorize o código final que será efetivamente apresentado.
