# Validação dos CRUDs integrados — Etapa 04.1

## Matriz de operações

| Tela | GET/lista | POST | PUT/edição | DELETE/desativação | PATCH |
| --- | --- | --- | --- | --- | --- |
| Produtos e insumos | `GET /produtos` | `POST /produtos` | `PUT /produtos/{id}` | `DELETE /produtos/{id}` (lógico) | — |
| Fornecedores | `GET /fornecedores` | `POST /fornecedores` | `PUT /fornecedores/{id}` | `DELETE /fornecedores/{id}` (lógico) | — |
| Contas a pagar | `GET /contas-pagar` | `POST /contas-pagar` | `PUT /contas-pagar/{id}` | `DELETE /contas-pagar/{id}` | `PATCH /contas-pagar/{id}/situacao` |
| Contas a receber | `GET /contas-receber` | `POST /contas-receber` | `PUT /contas-receber/{id}` | `DELETE /contas-receber/{id}` | `PATCH /contas-receber/{id}/situacao` |
| Usuários | `GET /usuarios` | `POST /usuarios` | `PUT /usuarios/{id}` | `DELETE /usuarios/{id}` (lógico) | — |
| Avisos | `GET /avisos` | `POST /avisos` | `PUT /avisos/{id}` | `DELETE /avisos/{id}` | Arquivamento via `PUT` com `situacao=ARQUIVADO` |

## Problemas corrigidos

- Produtos: o drawer de edição passou a preencher os campos reais; a desativação chama a API e recarrega a lista.
- Fornecedores e usuários: a desativação deixou de ser somente uma mensagem visual.
- Contas a pagar: indicadores usam a resposta da API, há edição no drawer, exclusão confirmada e bloqueio de duplo salvamento.
- Contas a receber: há edição no drawer, exclusão confirmada e bloqueio de duplo salvamento.
- Avisos: arquivar e excluir agora persistem no backend e atualizam a listagem.
- As operações só exibem sucesso após a resposta HTTP; falhas preservam o formulário e exibem a mensagem devolvida pelo serviço.

## Arquivos modificados

- `Frontend/src/pages/Produtos.jsx`
- `Frontend/src/pages/Fornecedores.jsx`
- `Frontend/src/pages/ContasPagar.jsx`
- `Frontend/src/pages/ContasReceber.jsx`
- `Frontend/src/pages/Usuarios.jsx`
- `Frontend/src/pages/Avisos.jsx`
- `Frontend/docs/INTEGRACAO_API.md`
- `Frontend/docs/VALIDACAO_CRUDS.md`

## Testes executados

- `Frontend`: `npm run build` concluído com sucesso.
- `Backend`: `mvn test` e `mvn package` concluídos com sucesso. Não há classes de teste em `Backend/src/test`.
- MariaDB foi confirmado disponível em `localhost:3306` e a API Spring Boot iniciou em `localhost:8080`.
- Integração HTTP: `GET` executado nos seis recursos; `POST` e `PUT` confirmados para fornecedor, produto, contas a pagar/receber, usuário e aviso; `PATCH` confirmado para `PAGO` e `RECEBIDO`; arquivamento de aviso confirmado como `ARQUIVADO`; `DELETE` confirmado para contas e aviso, e desativação lógica confirmada para produto, fornecedor e usuário.
- Validação HTTP 400 foi confirmada ao enviar uma conta a pagar sem os três campos financeiros obrigatórios (`percentualJuros`, `percentualMulta` e `valorEncargos`). A camada de serviços do frontend envia esses valores como zero.
- Os registros temporários com prefixo `TESTE-041` foram limpos quando físicos. Os registros lógicos de fornecedor (IDs 5 e 6), produto (IDs 5 e 6) e usuário (ID 4) permanecem no banco com `ativo=false`, pois essa é a regra definida pelo backend.

## Teste manual pendente

1. Com MariaDB, backend e frontend ativos, abra cada uma das seis telas no navegador.
2. Cadastre um registro identificável, edite-o e atualize a página para confirmar o reflexo visual da persistência.
3. Desative produto, fornecedor e usuário; exclua conta e aviso; confirme a mensagem e a atualização da tabela.
4. Use **Pagar**, **Receber** e **Arquivar**, atualize a página e confirme respectivamente `PAGO`, `RECEBIDO` e `ARQUIVADO`.
5. Tente campos obrigatórios vazios e identificadores únicos duplicados para conferir os retornos HTTP 400/409 exibidos como toast.

Não foi realizado teste visual automatizado, pois não há navegador controlável disponível neste ambiente.
