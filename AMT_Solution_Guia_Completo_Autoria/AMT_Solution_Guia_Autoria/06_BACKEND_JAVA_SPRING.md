# 06 — Backend Java 17, orientação a objetos e Spring Boot

## 1. Conceitos básicos de Java aplicados aqui

- **Classe:** molde para instâncias com atributos e comportamento; `ProdutoService` é uma classe.
- **Objeto/instância:** entidade individual, por exemplo um `Produto` com ID 12.
- **Atributo:** estado encapsulado, por exemplo `private BigDecimal quantidadeEstoque`.
- **Método:** operação, como `criar`, `atualizar`, `simularEncargos`.
- **Construtor:** define como um objeto recebe dependências/dados; `ContaPagarService(...)` recebe repository e colaboradores.
- **Interface:** contrato de métodos; `CalculoEncargoStrategy` obriga cada implementação a ter `nome` e `calcular`.
- **Herança:** especialização; `CriadorContaPagar extends CriadorLancamentoFinanceiro`.
- **Polimorfismo:** código chama uma interface/base e a implementação decide o comportamento; `e.calcular(...)` no Strategy.
- **Encapsulamento:** expor operações controladas sem misturar detalhes internos; Services oferecem operações ao Controller.
- **`record`:** forma concisa de agrupar dados imutáveis, como `ContaPagarRequest` e `ResultadoCalculo`.
- **`BigDecimal`:** número decimal apropriado para aritmética financeira.

## 2. Entrada da aplicação e `@SpringBootApplication`

`AmtSolutionApplication.java` inicializa o Spring Boot, que encontra componentes por varredura dos pacotes `com.amtsolution`. O framework cria instâncias administradas (**beans**) de classes anotadas com `@RestController`, `@Service`, `@Component` e `@Configuration`.

## 3. Anotações essenciais (anotações são metadados)

| Anotação | Significado | Onde aparece |
|---|---|---|
| `@RestController` | Classe responde a HTTP/JSON | Seis Controllers |
| `@RequestMapping("/api/...")` | Prefixo das rotas | Controllers |
| `@GetMapping`, `@PostMapping`, `@PutMapping`, `@PatchMapping`, `@DeleteMapping` | Associa verbo/caminho a método | Controllers |
| `@RequestBody` | Desserializa JSON para argumento | POST/PUT/PATCH |
| `@PathVariable` | Valor do segmento de URL | `/{id}` |
| `@RequestParam` | Parâmetro da query string | Simulações Strategy |
| `@Valid` | Dispara validação do DTO | Controllers |
| `@Service` | Serviço de regras de negócio gerenciado | Services |
| `@Component` | Classe gerenciada de propósito geral | Strategy, Observer e fábricas concretas |
| `@Transactional` | Delimita operação transacional de banco | Services |
| `@Entity`, `@Table`, `@Id`, `@Column` | Mapeamento de ORM | Models |
| `@ManyToOne`, `@JoinColumn` | Relacionamentos JPA | Produto, ContaPagar, Aviso |
| `@Configuration`, `@Bean` | Declara configurações e objetos gerenciados | `CorsConfig`, `PasswordConfig` |
| `@RestControllerAdvice`, `@ExceptionHandler` | Tratamento centralizado de exceções | `ApiExceptionHandler` |

## 4. Camada Controller: contrato HTTP

`ContaPagarController.criar` recebe `@Valid @RequestBody ContaPagarRequest r`, chama `service.criar(r)` e devolve `ResponseEntity.created(URI.create(...)).body(c)`.

O Controller **não** executa um `INSERT` manual. Ele transforma uma requisição web em chamada de negócio e monta a resposta HTTP.

## 5. Camada DTO: entrada validada

Os `*Request.java` são `record`s com campos esperados, como `valorOriginal`, `vencimento` ou `fornecedorId`. Com anotações `jakarta.validation.constraints.*`, o Spring rejeita JSON inválido antes de prosseguir para a regra de negócio.

**DTO ≠ Entity:** o DTO representa o que a API aceita; a Entity representa o registro persistido e pode incluir IDs, timestamps e associações. Evita que clientes escolham arbitrariamente campos internos e permite aplicar validações específicas de entrada.

## 6. Camada Service: o “onde” das decisões

| Service | Regras centrais confirmadas |
|---|---|
| `ProdutoService` | verifica código único; associa fornecedor; salva; publica `EventoProduto`; protege DELETE se há aviso originado |
| `FornecedorService` | documento único; status ativo; CRUD; DELETE com `flush` |
| `ContaPagarService` | cria entidade via fábrica; simula encargos; valida situação; associa fornecedor; impede exclusão se há aviso vinculado |
| `ContaReceberService` | cria entidade via fábrica; simula desconto; valida situação; CRUD |
| `UsuarioService` | e-mail único; hash BCrypt quando senha presente; ativar/desativar; CRUD |
| `AvisoService` | criação manual por fábrica; criação automática com fábrica; evita eventos duplicados por `chaveEvento`; resolve referências |
| `VerificadorVencimentosService` | encontra contas pendentes/vencidas no intervalo hoje–hoje+3; publica `EventoVencimento` |

**Exemplo concreto:** `ProdutoService.criar` chama `repository.existsByCodigo`, salva via `repository.save(...)` e **depois publica um `EventoProduto`**. `SujeitoProduto` notifica os observadores, que decidem se há alerta a gerar.

## 7. Camada Repository: persistência declarativa

Os seis repositórios estendem `JpaRepository<Entidade, Long>`. Essa interface oferece operações comuns (`findAll`, `findById`, `save`, `delete`, `flush`). Métodos como `existsByDocumento`, `existsByEmailAndIdNot` e `findBySituacaoInAndVencimentoBetween` seguem regras de nomes reconhecidas pelo Spring Data para gerar consultas, sem um SQL manual explícito por operação.

**Generics:** `JpaRepository<Produto, Long>` quer dizer que o repositório manipula entidades `Produto` cuja chave tem tipo `Long`.

## 8. Injeção de dependência pelo construtor

Trecho conceitual correspondente ao código real:

```java
private final ContaPagarRepository repository;
private final CriadorContaPagar criador;
private final ContextoEncargo encargos;

public ContaPagarService(..., CriadorContaPagar criador, ContextoEncargo encargos) {
    // O Spring injeta os beans exigidos pelo serviço.
}
```

As dependências **não** são simplesmente variáveis globais. O container Spring administra as instâncias e as fornece ao criar o Service. `final` indica que a referência atribuída no construtor não deve ser reatribuída depois.

## 9. Exceções e por que não retornar sempre HTTP 200

`ResourceNotFoundException` → 404, `ConflictException` e `DataIntegrityViolationException` → 409, `IllegalArgumentException` → 400, falha de `@Valid` → 400 com mapa de campos.

A classe `ApiExceptionHandler` tem `@RestControllerAdvice` para manter esse tratamento padronizado e não repetir `try/catch` em todos os Controllers.

## 10. Transações

As classes Service principais estão anotadas `@Transactional`; métodos de leitura têm `@Transactional(readOnly = true)`. Uma transação coordena um conjunto de operações no banco e preserva consistência. A existência de `@Transactional` **não** significa que todo erro de frontend seja revertido por magia: trata-se das operações realizadas no backend em uma transação ativa.

## 11. Factory/Strategy/Observer e OOP

- Strategy depende de interface e polimorfismo, não de um `switch` repleto de fórmulas.
- Factory Method depende de criador abstrato e concretos que decidem qual objeto é criado.
- Observer depende de um sujeito que conhece contratos de observador, sem executar diretamente a lógica específica de cada reação.

## 12. Exercícios para o VS Code

1. Abra `ContaPagarController.java` e aponte `@RequestMapping`, `@PostMapping`, `@Valid`.
2. Abra `ContaPagarService.java` e encontre o método `criar` com uso da fábrica.
3. Abra `ContaPagarRepository.java` e explique por que não há código SQL de `INSERT`.
4. Abra `ProdutoService.java` e identifique a publicação do evento.
5. Abra `PasswordConfig.java` e explique para que serve o bean `PasswordEncoder`.
6. Abra `ApiExceptionHandler.java` e associe quatro erros a seus status HTTP.
7. Localize a diferença entre um `record` DTO, uma `@Entity` e uma `interface` Strategy.
