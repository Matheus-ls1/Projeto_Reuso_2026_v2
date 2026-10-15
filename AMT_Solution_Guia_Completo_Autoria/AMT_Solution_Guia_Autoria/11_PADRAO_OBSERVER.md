# 11 — Observer: eventos de produto e vencimento, avisos reais e detalhes técnicos

## 1. Conceito e motivação

**Observer** é um padrão comportamental no qual um **sujeito/observável** publica mudanças ou eventos para um conjunto de **observadores**. O sujeito conhece o **contrato**, não a regra concreta de cada reação. Os observadores decidem o que fazer ao serem notificados.

Sem Observer, `ProdutoService` teria de conhecer diretamente a regra de montagem do aviso e toda lógica de publicação. Com Observer, o Service comunica um acontecimento a `SujeitoProduto`, e `ObservadorEstoqueBaixo` reage quando a regra de estoque exige.

## 2. Exemplo 1 — Produto abaixo do mínimo

| Classe | Responsabilidade |
|---|---|
| `ProdutoService` | salva produto e publica evento de alteração |
| `EventoProduto` | record com o produto associado à alteração |
| `SujeitoProduto` | recebe `List<ObservadorProduto>` injetada e notifica |
| `ObservadorProduto` | interface com `atualizar(EventoProduto)` |
| `ObservadorEstoqueBaixo` | classe concreta que verifica regra e chama AvisoService |
| `AvisoService` | usa Factory Method para gerar e persistir aviso |
| `AvisoRepository` | consulta duplicidade e persiste aviso |

## 3. Ordem real dos acontecimentos

```text
Produtos.jsx: criar/editar produto
  → produtosService.js: POST/PUT /api/produtos
  → ProdutoController
  → ProdutoService.criar/atualizar
  → repository.save(produto)
  → sujeito.publicar(new EventoProduto(produto))
  → SujeitoProduto percorre List<ObservadorProduto>
  → ObservadorEstoqueBaixo.atualizar(evento)
  → verifica ativo && estoque <= mínimo
  → AvisoService.criarAvisoEstoque(produto, data atual)
  → verificar chave ESTOQUE:{id}
  → CriadorAvisoAutomatico.criar(DadosAviso)
  → aviso recebe referência ao produto
  → AvisoRepository.save(aviso)
  → tela Avisos lista o aviso real
```

**Crucial:** o Observer é disparado tanto em `criar` quanto em `atualizar` o produto, não apenas quando alguém acessa a página Estoque. A tela `Estoque.jsx` utiliza mocks e não faz parte deste fluxo.

## 4. Regra real de estoque baixo

No código de `ObservadorEstoqueBaixo`:

```java
if (Boolean.TRUE.equals(p.getAtivo())
    && p.getQuantidadeEstoque().compareTo(p.getQuantidadeMinima()) <= 0)
    avisos.criarAvisoEstoque(p, LocalDate.now());
```

`Boolean.TRUE.equals` evita tratar `null` como verdadeiro. `compareTo` é a comparação apropriada entre `BigDecimal`s; resultado `<= 0` significa **menor ou igual ao mínimo**. O alerta depende de produto **ativo**.

Se a quantidade voltar a ficar acima do mínimo, o código não demonstra apagamento automático de um alerta histórico. E se já existir a chave `ESTOQUE:id`, ele não gera novo aviso igual, mesmo que o estoque continue baixo em atualizações posteriores.

## 5. Exemplo 2 — Vencimentos próximos de Contas a Pagar

| Classe | Responsabilidade |
|---|---|
| `ContasPagar.jsx` | botão “Verificar vencimentos” |
| `contasPagarService.js` | POST `/contas-pagar/verificar-vencimentos` |
| `ContaPagarController` | delega para `VerificadorVencimentosService` |
| `VerificadorVencimentosService` | seleciona contas e publica eventos |
| `EventoVencimento` | record com a conta |
| `SujeitoVencimento` | percorre `List<ObservadorVencimento>` |
| `ObservadorVencimento` | interface com método `atualizar` |
| `ObservadorVencimentoProximo` | entrega reação ao `AvisoService` |
| `AvisoService` | cria aviso automático com chave única por conta/vencimento |

## 6. Intervalo de datas: nuance muito importante

O código usa:

```java
LocalDate hoje = LocalDate.now(), limite = hoje.plusDays(3);
List<ContaPagar> itens = contas.findBySituacaoInAndVencimentoBetween(
    List.of("PENDENTE", "VENCIDO"), hoje, limite);
```

A consulta filtra **situação PENDENTE ou VENCIDO** e data entre **hoje e três dias à frente**, inclusive conforme consulta `Between`. **Contas com vencimento antes de hoje não entram nessa janela**, ainda que seu status seja `VENCIDO`. A denominação “vencido” não significa que a busca recupera todas as contas atrasadas de qualquer data: o intervalo restringe os resultados.

O botão foi intencionalmente utilizado para disparar a verificação **pelo navegador**; a implementação atual não exige um agendador automático. Não afirme que há uma tarefa diária agendada se nenhuma classe usa `@Scheduled` para isso.

## 7. Identificação e prevenção de duplicidade

### Estoque

A chave de evento é `ESTOQUE:` + ID do produto. Um produto com ID `12` gera `ESTOQUE:12`. `AvisoService` consulta `existsByChaveEvento` e evita duplicar o mesmo alerta.

### Vencimento

A chave é `VENCIMENTO:` + ID da conta + `:` + data de vencimento. Uma alteração da data pode produzir uma chave distinta e, portanto, permitir aviso referente ao novo vencimento. O SQL tem `UNIQUE KEY uk_avisos_chave_evento`, oferecendo proteção adicional.

**Idempotência nesse contexto:** repetir o mesmo disparo para o mesmo evento **não deve criar diversos avisos iguais**, pois a chave já existe. Não confunda idempotência com eliminar qualquer possibilidade de condição de corrida; a restrição UNIQUE do banco protege duplicação simultânea, enquanto o código também consulta previamente.

## 8. Como o Spring disponibiliza os observadores?

As classes `SujeitoProduto` e `SujeitoVencimento` estão anotadas com `@Component`; seus construtores recebem `List<ObservadorProduto>` e `List<ObservadorVencimento>`. O Spring injeta implementações correspondentes anotadas `@Component`, como `ObservadorEstoqueBaixo` e `ObservadorVencimentoProximo`.

O mecanismo é **síncrono, em processo, com chamadas de método**, não um broker de mensagens externo ou uma fila distribuída. O método `publicar` faz `observadores.forEach(o -> o.atualizar(evento))`.

## 9. Onde aparece Factory Method dentro do Observer?

O Observer não cria a entidade por conta própria. Ele chama `AvisoService.criarAvisoEstoque` ou `criarAvisoVencimento`, e esse Service utiliza `CriadorAvisoAutomatico` (Factory Method). A parceria mostra como padrões distintos cooperam:

1. **Observer** detecta e propaga acontecimento.
2. **Factory Method** decide como fabricar o objeto de aviso.
3. **Repository** persiste o aviso.
4. **React** mostra a consequência.

## 10. Demonstração sem terminal

### Cenário A: estoque

1. Abrir **Produtos/Insumos**.
2. Escolher produto ativo e editar quantidade para valor **igual ou inferior** ao mínimo.
3. Salvar.
4. Abrir **Avisos** e localizar o alerta.
5. No VS Code, mostrar `ProdutoService`, `SujeitoProduto`, `ObservadorEstoqueBaixo`, `AvisoService`.

**Atenção:** se o alerta já existir para o mesmo ID, pode não surgir uma segunda linha; isso é esperado pela regra de duplicidade. Para demonstração controlada, use um registro de teste apropriado e preserve a integridade dos dados.

### Cenário B: vencimento

1. Ter uma conta a pagar **PENDENTE**, vencimento entre hoje e hoje+3.
2. Abrir **Contas a Pagar** e clicar **Verificar vencimentos**.
3. Abrir **Avisos**.
4. Mostrar `VerificadorVencimentosService`, `SujeitoVencimento`, `ObservadorVencimentoProximo`, `AvisoService`.

`contasVerificadas` na mensagem da UI indica quantas contas passaram pela verificação, não quantos alertas novos foram criados.

## 11. Perguntas difíceis

1. **Qual é o Subject?** `SujeitoProduto` no primeiro exemplo, `SujeitoVencimento` no segundo.
2. **Qual é a interface Observer?** `ObservadorProduto` ou `ObservadorVencimento`.
3. **Qual é o evento?** `EventoProduto` ou `EventoVencimento`, ambos `record`s com a entidade envolvida.
4. **Quem realmente grava o aviso?** `AvisoService` via `AvisoRepository`.
5. **Por que não usar apenas `if` no Service?** A reação ficaria acoplada à operação principal; Observer permite separar publicação e interessados.
6. **O estoque tem de ficar abaixo ou pode igualar?** Pode igualar: comparação `<= 0`.
7. **Toda conta vencida é avisada?** Não: somente as situações aceitas *e* datas dentro do intervalo hoje–+3.
8. **É assíncrono?** Não; publicação chama observadores diretamente.
9. **Como não duplica avisos?** Consulta de `chaveEvento` e restrição UNIQUE no banco.
10. **Há dois Observers?** Há dois contextos de aplicação, com sujeitos, contratos, eventos e observadores específicos.

## 12. Resposta oral resumida

> “Observer desacopla quem publica um evento de quem reage a ele. Em Produtos, após salvar, o `ProdutoService` publica `EventoProduto`; o `SujeitoProduto` avisa `ObservadorEstoqueBaixo`, que cria um aviso se o produto ativo estiver abaixo ou igual ao mínimo. Em Contas a Pagar, o botão de verificação executa uma consulta de vencimentos, publica eventos e o segundo observador produz avisos. Cada alerta tem uma chave que evita duplicidade.”
