# 09 — Strategy: conceito, implementação, cálculos e defesa de autoria

## 1. O que é o Strategy?

**Strategy** é um padrão de projeto comportamental usado quando um problema admite **algoritmos alternativos**. O cliente pede uma operação ao contexto, que delega sua execução a uma estratégia concreta por uma interface comum. Assim, cada algoritmo fica encapsulado e pode ser substituído sem reescrever quem consome o serviço.

**Problema sem Strategy:** um método financeiro gigante com `if (tipo == ...)` e as fórmulas de juros, multa e desconto juntas; a cada nova regra, esse método precisa crescer. **Solução Strategy:** interface comum, classes concretas especializadas e um contexto que seleciona/delega.

**Reuso demonstrado:** os mesmos Controllers e Services chamam contextos por uma operação comum; implementações de cálculo são isoladas e trocáveis.

## 2. Dois exemplos no AMT Solution

1. **Encargos em Contas a Pagar:** juros diários ou multa percentual sobre `valorOriginal`.
2. **Descontos em Contas a Receber:** desconto percentual ou desconto de valor fixo sobre `valorOriginal`.

Há ainda estratégias neutras `SemEncargoStrategy` e `SemDescontoStrategy`. **Isso não representa quatro exemplos separados de Strategy:** são alternativas dentro dos dois contextos acadêmicos.

## 3. Classes reais — Encargos

| Classe | Papel |
|---|---|
| `CalculoEncargoStrategy` | interface que exige `nome()` e `calcular(BigDecimal, BigDecimal, int)` |
| `JurosDiariosStrategy` | algoritmo concreto juros proporcional a dias |
| `MultaPercentualStrategy` | algoritmo concreto multa única |
| `SemEncargoStrategy` | algoritmo neutro, ajuste zero |
| `ContextoEncargo` | registra implementações e delega a chamada à selecionada |
| `ResultadoCalculo` | record de resposta: nome, valor original, calculado, ajuste |
| `ContaPagarService` | obtém a conta persistida e chama o contexto |
| `ContaPagarController` | expõe simulação GET à interface React |

## 4. Contrato da interface

Trecho real:

```java
public interface CalculoEncargoStrategy {
    String nome();
    BigDecimal calcular(BigDecimal valorOriginal, BigDecimal percentual, int dias);
}
```

As concretas podem ter implementações internas diferentes, mas o contexto só precisa conhecer o contrato. **Essa é a base do polimorfismo**.

## 5. Como o Spring encontra as estratégias?

`JurosDiariosStrategy`, `MultaPercentualStrategy` e `SemEncargoStrategy` têm `@Component`. O Spring as registra como beans. O construtor de `ContextoEncargo` recebe `List<CalculoEncargoStrategy> itens`, reunindo as implementações disponíveis. Constrói um mapa por `nome()`:

```java
private final Map<String, CalculoEncargoStrategy> estrategias;

public ContextoEncargo(List<CalculoEncargoStrategy> itens) {
    estrategias = new HashMap<>();
    itens.forEach(e -> estrategias.put(e.nome(), e));
}
```

**Isso não é um `switch` de fórmulas.** O mapa seleciona *qual objeto* executará o cálculo; o algoritmo continua dentro da classe concreta. Para adicionar uma estratégia, em princípio pode-se acrescentar uma implementação `@Component` com novo `nome()` e respeitar o contrato; a UI poderia precisar ser atualizada para oferecer a nova escolha.

## 6. Cálculos reais — Encargos

### Juros diários

A implementação multiplica `valor * percentual * dias / 100`, com arredondamento `HALF_UP` em duas casas. O percentual é interpretado **por dia no exemplo**, porque o número de dias multiplica diretamente a taxa. Não se trata de juros compostos; é proporcionalidade linear.

Exemplo: valor R$ 420,00, percentual 2% e 3 dias: `420 × 2 × 3 / 100 = 25,20`. Ajuste **R$ 25,20**, total **R$ 445,20**.

### Multa percentual

A implementação calcula `valor * percentual / 100`, **sem multiplicar pelos dias**. Exemplo: R$ 420,00 com multa de 2% = **R$ 8,40**, total **R$ 428,40**.

### Sem encargo

`SemEncargoStrategy` retorna `BigDecimal.ZERO`. O valor final coincide com o valor original.

### Validações

As classes concretas de juros e multa recusam valores ausentes/negativos e dias negativos, com `IllegalArgumentException`. O `ApiExceptionHandler` transforma a exceção em HTTP 400. A estratégia sem encargo simplesmente devolve zero. Não afirme que todas as estratégias têm validação idêntica.

## 7. Papel do ContextoEncargo

O contexto executa aproximadamente esta sequência, que corresponde ao código:

```java
CalculoEncargoStrategy e = estrategias.get(nome);
if (e == null) throw new IllegalArgumentException("Estratégia de encargo inválida.");
BigDecimal ajuste = e.calcular(valor, percentual == null ? BigDecimal.ZERO : percentual, dias);
return new ResultadoCalculo(nome, valor, valor.add(ajuste), ajuste);
```

A última linha mostra a semântica do encargo: **adicionar** o ajuste ao valor original.

## 8. Classes reais — Descontos

| Classe | Papel |
|---|---|
| `CalculoDescontoStrategy` | interface de contrato |
| `DescontoPercentualStrategy` | `valor * percentual / 100`, limitado ao valor original |
| `DescontoValorFixoStrategy` | retorna valor fixo informado, limitado ao valor original |
| `SemDescontoStrategy` | ajuste zero |
| `ContextoDesconto` | registro/seleção/delegação |
| `ResultadoCalculo` | retorno compartilhado |
| `ContaReceberService` | encontra o recebível e chama contexto |
| `ContaReceberController` | fornece o endpoint GET |

No contexto de descontos, o retorno é `new ResultadoCalculo(nome, valor, valor.subtract(ajuste), ajuste)`. O valor calculado é **menor ou igual** ao original porque o ajuste é limitado ao original.

## 9. Cálculos reais — Descontos

**Percentual:** R$ 100 com 10% → desconto R$ 10, total **R$ 90**.

**Fixo:** R$ 100 com R$ 15 → desconto R$ 15, total **R$ 85**.

**Limite:** desconto fixo R$ 150 para uma conta de R$ 100 é limitado a R$ 100, não produz valor negativo. A implementação percentual também usa `.min(v)` para limitar o desconto ao original. `RoundingMode.HALF_UP` trata as casas decimais.

**Sem desconto:** ajuste R$ 0.

## 10. Fluxo real pelo navegador

```text
Contas a Pagar → clicar Simular em uma conta salva
  → estado simulacaoModal = true
  → escolher JUROS_DIARIOS ou MULTA_PERCENTUAL
  → informar percentual e, quando necessário, dias
  → contasPagarService.simularEncargos(id, estrategia, percentual, dias)
  → GET /api/contas-pagar/{id}/simulacao-encargos
  → ContaPagarController.simular
  → ContaPagarService.simularEncargos
  → buscar conta → ContextoEncargo.simular
  → estratégia concreta.calcular
  → ResultadoCalculo JSON → React mostra o ajuste/total
```

Contas a Receber segue caminho paralelo com `simularDescontos`, `ContextoDesconto`, `PERCENTUAL` ou `VALOR_FIXO`.

## 11. O que NÃO acontece na simulação

- Nenhum `repository.save` é chamado em `simularEncargos`/`simularDesconto`.
- Não se altera o `valorOriginal` da entidade.
- Não se registra pagamento nem recebimento.
- O React não implementa as fórmulas financeiras; ele coleta parâmetros e exibe o resultado.

## 12. Nuance importante: nomes da estratégia no cadastro vs na simulação

O `ContaPagarRequest` aceita `estrategiaEncargo` `SEM_ENCARGO`, `JUROS_SIMPLES` ou `MULTA_JUROS`, enquanto a simulação Java usa nomes como `JUROS_DIARIOS` e `MULTA_PERCENTUAL`. O `ContaReceberRequest` aceita `SEM_DESCONTO`, `PERCENTUAL` ou `ANTECIPACAO`, enquanto a simulação oferece `PERCENTUAL` e `VALOR_FIXO`.

Esses campos persistidos são **metadados do registro financeiro**. Não afirmem que selecionar a estratégia no modal grava automaticamente um desses códigos no banco: o fluxo do modal não chama PUT/POST.

## 13. Por que existem duas interfaces de Strategy?

Encargo e desconto têm **semânticas de negócio diferentes**, embora recebam argumentos semelhantes. Na conta a pagar somamos o ajuste; na conta a receber subtraímos. A separação facilita linguagem de domínio, evolução e leitura, sem condicionar tudo a uma única interface genérica. `ResultadoCalculo` é compartilhado porque o formato da resposta é comum.

## 14. Perguntas fortes de autoria

1. **Por que isso é Strategy e não apenas herança?** Porque o cliente seleciona objetos de algoritmos intercambiáveis por uma interface e delega o cálculo; herança das classes concretas não é o objetivo.
2. **Onde está o polimorfismo?** Em `e.calcular(...)`, onde `e` é `CalculoEncargoStrategy`/`CalculoDescontoStrategy` mas executa o método da classe concreta.
3. **Como o sistema escolhe a classe?** `Map<String, Strategy>` criado a partir da lista de beans injetados pelo Spring.
4. **Qual a responsabilidade do Contexto?** Escolha, verificação de nome, execução do algoritmo e composição do resultado.
5. **Por que manter Sem...?** Expressar opção neutra como estratégia concreta, sem misturar um `if` de cálculo no contexto.
6. **Como provar pelo browser?** Selecionar conta existente, simular duas alternativas e mostrar diferenças; depois apontar interface/contexto/concretas no código.
7. **Por que BigDecimal?** Precisão decimal e arredondamento explícito.
8. **Como evitar total negativo no desconto?** Concretas usam `min(valorOriginal)`.
9. **Como incluir novo algoritmo?** Implementar contrato, registrar como componente e disponibilizar opção de UI se desejado.
10. **Esse Strategy efetua cobrança?** Não. Ele simula valores com uma rota GET sem escrita.

## 15. Resposta oral de 40 segundos

> “Aplicamos Strategy porque encargos e descontos podem ser calculados de maneiras diferentes. Criamos interfaces comuns para cada domínio, implementações concretas e contextos que recebem as estratégias do Spring e selecionam a adequada por nome. No formulário de Contas a Pagar, o usuário pode simular juros diários ou multa percentual; em Contas a Receber, desconto percentual ou fixo. O cálculo real é feito por `BigDecimal` no Java, o resultado volta para o React e a simulação não altera o banco.”
