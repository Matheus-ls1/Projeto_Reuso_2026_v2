# 12 — Validações, erros, segurança, exclusões e integridade de dados

## 1. Por que validação em várias camadas?

O navegador não é fonte confiável: campos podem ser adulterados, uma API pode ser chamada fora do formulário e dados duplicados podem chegar simultaneamente. Por isso o projeto combina **validação de experiência no React**, **validação declarativa em DTOs**, **regras no Service** e **restrições no banco**.

| Camada | Exemplo real | Limitação |
|---|---|---|
| React | aviso “Preencha os campos obrigatórios” | usuário pode burlar interface e chamar endpoint |
| DTO | `@NotBlank`, `@Email`, `@DecimalMin` | não resolve sozinho unicidade ou relacionamento |
| Service | `existsByEmail`, fornecedor existente, situação permitida | depende de transação e estrutura do banco |
| MariaDB | `UNIQUE`, `FOREIGN KEY`, `NOT NULL` | não apresenta mensagem amigável ao usuário por si só |

## 2. Anotações de Bean Validation utilizadas

- `@NotBlank`: string obrigatória, não somente espaços.
- `@NotNull`: valor não pode ser nulo.
- `@Size(max = ...)`: limita comprimento, por exemplo e-mail ou descrição.
- `@Email`: exige formato aceitável de e-mail.
- `@Pattern(regexp = ...)`: limita string aos códigos permitidos (`PRODUTO|INSUMO`, situações financeiras etc.).
- `@DecimalMin("0.01")`: rejeita valor abaixo de 0,01; em conta original evita zero e negativo.

O Controller coloca `@Valid @RequestBody` no parâmetro DTO para aplicar as restrições antes da execução normal do método.

## 3. HTTP e exceções no código

| Situação | Origem típica | Tratamento em `ApiExceptionHandler` | Código |
|---|---|---|---|
| ID inexistente | `buscar(id)` lança `ResourceNotFoundException` | handler `notFound` | 404 |
| DTO inválido | `@Valid` gera `MethodArgumentNotValidException` | handler `validation`; JSON com mapa `campos` | 400 |
| Campo/rule inválido | `IllegalArgumentException` | handler `invalid` | 400 |
| Duplicidade detectada no Service | `ConflictException` | handler `conflict` | 409 |
| Restrição de FK/UNIQUE do banco | `DataIntegrityViolationException` | handler `conflict` | 409 |

`Frontend/src/services/api.js` converte erros HTTP em `Error(...)`. As telas capturam e apresentam `toast(error.message, "error")`.

## 4. Exclusão física x desativação x arquivamento

**Desativação** deixa a linha persistida e altera `ativo` (`Produto`, `Fornecedor`, `Usuario`), por PATCH.

**Exclusão física** chama DELETE e remove a linha quando a integridade permite. A tela pede confirmação, o backend usa `repository.delete`/`flush`.

**Arquivamento** altera a situação do aviso para `ARQUIVADO` via atualização, mantendo histórico. Não é exclusão.

**Situação de conta** (`PAGO`, `RECEBIDO`, etc.) não equivale a desativação ou exclusão.

## 5. Integridade específica do projeto

- `ProdutoService.excluir` impede excluir produto referenciado por Avisos (`existsByProdutoOrigem_Id`).
- `ContaPagarService.excluir` impede excluir conta a pagar referenciada por Avisos (`existsByContaPagarOrigem_Id`).
- SQL de Avisos tem FKs `ON DELETE RESTRICT` para produto e conta.
- SQL de Produto e ContaPagar usa `ON DELETE SET NULL` para referência a fornecedor.
- Avisos usam `chave_evento` UNIQUE para prevenção de repetição de evento.

Uma relação protegida por FK existe para evitar **registros órfãos** e perda de rastreabilidade. Se o DELETE responde 409, a explicação correta é que o sistema protege o vínculo.

## 6. Senha com BCrypt

`PasswordConfig.java` fornece um `PasswordEncoder` configurado com `BCryptPasswordEncoder`. `UsuarioService.preencher` só codifica e armazena `senhaHash` quando o DTO traz senha preenchida. Assim, deixar senha em branco na atualização não substitui o hash por string vazia. `Usuario.java` anota `senhaHash` com `@JsonIgnore`, para não incluir esse atributo na serialização do usuário.

**Hash não é criptografia reversível:** não se recupera a senha original do hash. Uma autenticação real precisaria comparar senha informada com hash usando o encoder, além de regras de sessão/autorização — fluxo **não implementado** no frontend atual.

**Atenção especial:** o CRUD expõe dados administrativos em endpoints não autenticados; isso é aceitável somente como limitação do protótipo acadêmico em ambiente controlado, não como solução pronta para produção. Também não afirmar que perfil exibido no React restringe endpoints Java.

## 7. CORS: não é autenticação

`CorsConfig.java` permite acesso dos origins `http://localhost:5173` e `http://localhost:8443`. CORS é política aplicada pelo navegador para chamadas entre origens; **não substitui login, autorização nem proteção de APIs contra outros clientes HTTP**.

## 8. Configurações sensíveis

`application.properties` usa placeholders de ambiente, com defaults locais: `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME=amt_solution`, `DB_USER=root`, senha vazia por padrão. Isso facilita o XAMPP de desenvolvimento, mas **não é configuração adequada para produção**. Se outro computador exigir senha, a variável `DB_PASSWORD` precisa refletir essa configuração.

`.env.example` do frontend indica `VITE_API_URL=http://localhost:8080/api`. Variáveis `VITE_` são voltadas ao frontend e não devem armazenar segredos; seu conteúdo pode chegar ao bundle distribuído.

## 9. Limitações legítimas versus riscos reais

**Limitações acordadas:** login prototipado, permissões mockadas, PDV e relatórios mockados, ambiente local. **Riscos a saber justificar:** não há autenticação efetiva da API; registros de usuários não devem ser considerados protegidos por perfil do frontend; origem CORS está restrita a localhost; verificações de eventos são acionadas conforme fluxo implementado.

**Nuance de regra de negócio:** a verificação de vencimentos consulta `PENDENTE`/`VENCIDO` dentro de `hoje..hoje+3`; não cobre todos os atrasados anteriores a hoje. É um recorte da regra implementada.

## 10. Checklist para responder perguntas sobre falhas

1. A falha ocorre antes de enviar HTTP? Pode ser formulário, JavaScript ou roteamento.
2. Há falha de rede? Verificar backend, origin e porta.
3. HTTP 400? Conferir JSON, DTO e parâmetros.
4. HTTP 404? Verificar recurso/ID.
5. HTTP 409? Verificar duplicidade ou relacionamento.
6. HTTP 500? Consultar log do backend sem afirmar causa antes de investigar.
7. Resposta 200 mas a tela não atualizou? Conferir `await carregar()`, estado e mapeamento JS.
8. Build falha por dependência? Conferir Maven/npm e não sair removendo classes.

## 11. Perguntas de autoria

- “Por que validação no React não basta?” — Porque clientes fora da UI podem enviar requisições inválidas.
- “Para que `@JsonIgnore`?” — Evitar expor senha hash no JSON da entidade.
- “O que significa 409?” — Conflito por regra de negócio ou restrição de integridade.
- “Por que `flush` após excluir?” — Sincroniza operação pendente e ajuda a detectar falha de integridade na transação.
- “Ativar de novo recria cadastro?” — Não; PATCH altera o registro existente.
- “CORS é segurança de usuário?” — Não; é política de origem do navegador.
