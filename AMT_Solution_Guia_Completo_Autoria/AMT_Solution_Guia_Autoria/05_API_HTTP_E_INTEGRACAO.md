# 05 — API REST, HTTP, JSON, services JS e contratos de endpoints

## 1. O que é uma API REST neste projeto?

**API** é uma interface de comunicação entre sistemas. O frontend chama recursos HTTP do backend usando URLs, verbos e JSON. **REST** é um estilo arquitetural que trata entidades do domínio como recursos identificados por endereços: `/api/produtos`, `/api/avisos` etc.

O projeto organiza endpoints por substantivos de recurso, usa métodos HTTP apropriados, comunica resultados com códigos de status e transfere representações JSON. Não é necessário afirmar que ele implementa todos os critérios REST possíveis; basta descrever o estilo adotado.

## 2. Métodos HTTP

| Verbo | Propósito na API | Exemplo |
|---|---|---|
| GET | Ler | `GET /api/produtos` |
| POST | Criar ou disparar operação | `POST /api/avisos`, `POST /api/contas-pagar/verificar-vencimentos` |
| PUT | Atualizar cadastro completo fornecendo DTO | `PUT /api/usuarios/5` |
| PATCH | Alterar atributo/estado específico | `PATCH /api/produtos/5/ativo` |
| DELETE | Solicitar remoção física | `DELETE /api/fornecedores/5` |

**DELETE físico vs PATCH de status:** excluir tenta remover o registro; desativar mantém os dados no banco e altera `ativo`. Mesmo usando o DELETE correto, referências protegidas por FK podem impedir a exclusão.

## 3. Endpoints reais (código dos Controllers)

| Recurso | Base | Rotas adicionais além de GET lista, GET `/{id}`, POST, PUT `/{id}`, DELETE `/{id}` |
|---|---|---|
| Produtos/Insumos | `/api/produtos` | `PATCH /{id}/ativo` |
| Fornecedores | `/api/fornecedores` | `PATCH /{id}/ativo` |
| Contas a Pagar | `/api/contas-pagar` | `PATCH /{id}/situacao`; `GET /{id}/simulacao-encargos`; `POST /verificar-vencimentos` |
| Contas a Receber | `/api/contas-receber` | `PATCH /{id}/situacao`; `GET /{id}/simulacao-descontos` |
| Usuários | `/api/usuarios` | `PATCH /{id}/ativo` |
| Avisos | `/api/avisos` | Arquivamento via `PUT /{id}` mudando situação |

## 4. HTTP status: como interpretá-los

| Código | Sentido | Utilização no projeto |
|---|---|---|
| 200 OK | Operação bem-sucedida com corpo | GET e várias atualizações |
| 201 Created | Recurso criado | POST de cadastro (`ResponseEntity.created(...)`) |
| 204 No Content | Sucesso sem corpo | DELETE concluído (`ResponseEntity.noContent()`) |
| 400 Bad Request | Entrada inválida | `@Valid` ou `IllegalArgumentException` |
| 404 Not Found | Recurso inexistente | `ResourceNotFoundException` |
| 409 Conflict | Operação conflitante | Duplicidade ou integridade referencial |

O 409 não significa que a funcionalidade de DELETE está quebrada; pode ser comportamento correto para proteger dados relacionados. O 204 só deve chegar ao frontend quando a operação termina sem falha.

## 5. `api.js`: o coração da comunicação

Trecho da versão enviada:

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  // Há tratamento de erros e de status 204 no arquivo real.
}
```

**Explicação:** `import.meta.env.VITE_API_URL` é uma variável disponibilizada pelo Vite. `fetch` envia a requisição. `JSON.stringify` transforma objeto JS em texto JSON no corpo. Após a resposta, `response.json()` interpreta JSON como objeto JS. A função centraliza erros e o caso especial HTTP 204, que retorna `null` em vez de tentar decodificar corpo vazio.

O cabeçalho `Content-Type: application/json` informa o formato do corpo. Ele **não autentica** a requisição.

## 6. Conversões do service JS

`contasPagarService.js` tem funções internas `map` e `payload`.

**`map`:** transforma representação da API na representação da tela, por exemplo `valorOriginal` → `valor`, data ISO → `dd/mm/aaaa`, `situacao: "PAGO"` → `status: "Pago"`, `fornecedor` entidade → nome.

**`payload`:** faz a tradução inversa antes de salvar, por exemplo `valor` → `valorOriginal`, `vencimento` visual → ISO, `formaPag` → `formaPagamento` e `fornecedorId` → número ou `null`.

A conversão existe porque o modelo de apresentação e o contrato HTTP têm nomes/formatos diferentes. Isso mantém a tela desacoplada de parte dos detalhes da API.

## 7. Datas e valores monetários

A função `toApiDate` aceita `dd/mm/aaaa` e devolve `aaaa-mm-dd`, o formato serializado para `LocalDate`. `toDisplayDate` faz o inverso. O backend recebe `LocalDate`, enquanto no banco a coluna é `DATE`.

`toNumber` tenta converter texto monetário no formato brasileiro para `Number`. No frontend, valores numéricos JavaScript não têm exatidão decimal perfeita em todos os casos; **o cálculo financeiro de Strategy ocorre em Java com `BigDecimal`**, não com um algoritmo de juros implementado no JSX.

**Nuance para estudar:** a versão fornecida usa `String(value).replace(".", "").replace(",", ".")`. Essa conversão foi pensada para separador de milhares ponto e decimal vírgula; se recebesse uma string já formatada com **ponto decimal sem separador de milhar**, poderia interpretá-la erroneamente. Na autoria, explique o formato esperado, sem afirmar que a função cobre qualquer formato monetário.

## 8. Simulações de Strategy — endpoints especiais

**Encargos:** `GET /api/contas-pagar/{id}/simulacao-encargos?estrategia=JUROS_DIARIOS&percentual=2&dias=3`.

**Descontos:** `GET /api/contas-receber/{id}/simulacao-descontos?estrategia=VALOR_FIXO&parametro=15&dias=0`.

Os Controllers recebem parâmetros com `@RequestParam` e `@PathVariable`, delegam aos Services; os Services consultam o `valorOriginal` da conta e solicitam o cálculo ao Contexto Strategy. A resposta segue o `record ResultadoCalculo(estrategia, valorOriginal, valorCalculado, ajuste)`.

**Atenção:** os códigos de estratégia da **simulação** (`JUROS_DIARIOS`, `MULTA_PERCENTUAL`, `VALOR_FIXO`, `PERCENTUAL`) não são todos iguais aos códigos do campo **persistido** `estrategiaEncargo`/`estrategiaDesconto` nas tabelas. A simulação é uma operação separada, de leitura/cálculo, e não altera automaticamente esse campo.

## 9. Verificador de vencimentos

`POST /api/contas-pagar/verificar-vencimentos` retorna um JSON com a chave **`contasVerificadas`**. Esse número representa **contas encontradas e percorridas**, não necessariamente o número de novos avisos: uma conta pode já ter aviso com a mesma chave, e a criação é ignorada pela prevenção de duplicidade.

O React possui um botão **Verificar vencimentos** na tela de Contas a Pagar, então a apresentação não depende de terminal ou Postman.

## 10. CORS: por que o navegador pode bloquear?

Uma *origin* inclui protocolo, host e porta. `http://localhost:8443` e `http://localhost:8080` são origens diferentes. O navegador aplica **CORS** para restringir acessos entre origens. `CorsConfig.java` permite os origins do frontend **5173 e 8443** para rotas `/api/**` e métodos GET/POST/PUT/PATCH/DELETE/OPTIONS, com header `Content-Type`.

Se o servidor não estiver ativo, isso é **falha de conexão**, não necessariamente CORS. Se a origem não estiver liberada, o navegador pode bloquear mesmo com o backend respondendo.

## 11. Regras para responder na prova

**“Por onde passa o JSON?”** Service JS → `api.js` → HTTP → Controller → DTO → Service Java.

**“O que faz um endpoint?”** Associa URL e verbo a um método Java exposto pelo Controller.

**“O que ocorre em erro 400?”** API recusa entrada inválida e React apresenta mensagem no toast.

**“O React sabe SQL?”** Não. Ele trabalha com URL, HTTP e JSON; Repository/JPA cuida da persistência.

**“Por que há um `services` no React e outro no Java?”** Service JS adapta dados e centraliza chamadas HTTP; Service Java executa regras de negócio e coordena persistência. Mesmo nome, responsabilidades distintas.
