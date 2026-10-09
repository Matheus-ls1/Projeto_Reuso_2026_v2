# AMT Solution — Backend Java (Etapa 03)

## Estrutura e responsabilidades

O backend é um projeto Maven independente em `Reuso/Backend`, separado do React em `Reuso/Frontend`.

| Pacote | Responsabilidade |
| --- | --- |
| `model` | Entidades JPA que mapeiam exatamente as seis tabelas existentes. |
| `repository` | Acesso à persistência por `JpaRepository`. |
| `service` | Regras de cadastro, busca, atualização, desativação, exclusão e validação de referências. |
| `controller` | Endpoints REST JSON e códigos HTTP. |
| `dto` | Corpo validado das requisições; `UsuarioRequest` recebe senha sem nunca expor o hash. |
| `config` | CORS restrito ao Vite local e encoder BCrypt. |
| `exception` | Respostas centralizadas para 400, 404 e 409. |

As entidades são `Fornecedor`, `Produto`, `ContaPagar`, `ContaReceber`, `Usuario` e `Aviso`. As relações são `Fornecedor` 1:N `Produto`, `Fornecedor` 1:N `ContaPagar`, e referências opcionais de `Aviso` a produto, conta a pagar e usuário criador. Não há coleções bidirecionais, evitando serialização circular.

## Endpoints

Todos aceitam e retornam JSON. `POST` retorna 201, `GET`/`PUT`/`PATCH` retornam 200, `DELETE` retorna 204, campos inválidos retornam 400, identificadores inexistentes retornam 404 e duplicidades/restrições retornam 409.

| Recurso | Endpoints |
| --- | --- |
| Fornecedores | `GET/POST /api/fornecedores`, `GET/PUT/DELETE /api/fornecedores/{id}` |
| Produtos | `GET/POST /api/produtos`, `GET/PUT/DELETE /api/produtos/{id}` |
| Contas a Pagar | `GET/POST /api/contas-pagar`, `GET/PUT/DELETE /api/contas-pagar/{id}`, `PATCH /api/contas-pagar/{id}/situacao` |
| Contas a Receber | `GET/POST /api/contas-receber`, `GET/PUT/DELETE /api/contas-receber/{id}`, `PATCH /api/contas-receber/{id}/situacao` |
| Usuários | `GET/POST /api/usuarios`, `GET/PUT/DELETE /api/usuarios/{id}` |
| Avisos | `GET/POST /api/avisos`, `GET/PUT/DELETE /api/avisos/{id}` |

Os `DELETE` de fornecedor, produto e usuário **desativam** o registro (`ativo=false`), preservando históricos. Contas e avisos são removidos fisicamente; a chave estrangeira do banco impede remover conta/produto que seja origem de um aviso histórico.

Exemplo de criação de produto:

```json
POST /api/produtos
{
  "tipo": "PRODUTO",
  "codigo": "BEB-100",
  "nome": "Bebida de teste",
  "categoria": "Bebidas",
  "unidade": "UN",
  "precoVenda": 10.50,
  "quantidadeEstoque": 12.000,
  "quantidadeMinima": 3.000,
  "ativo": true,
  "fornecedorId": 1
}
```

Exemplo de atualização da situação:

```json
PATCH /api/contas-pagar/1/situacao
{ "situacao": "PAGO" }
```

O campo `senha` de `UsuarioRequest` é opcional nesta etapa. Quando enviado com pelo menos oito caracteres, é codificado com BCrypt em `senha_hash`; `senha_hash` possui `@JsonIgnore` e nunca aparece em respostas.

## Banco e configuração

O driver é `mariadb-java-client`, compatível com MariaDB 10.4.32 do XAMPP. O Hibernate está em `validate`, portanto o backend somente valida as tabelas já importadas: ele não cria, modifica ou executa scripts SQL.

Configure opcionalmente as variáveis antes de iniciar:

```powershell
$env:DB_HOST = 'localhost'
$env:DB_PORT = '3306'
$env:DB_NAME = 'amt_solution'
$env:DB_USER = 'root'
$env:DB_PASSWORD = ''
```

Os valores acima também são os padrões de desenvolvimento local. Não há senha real guardada em `application.properties`. O CORS aceita somente `http://localhost:5173` para `/api/**`.

## Como executar no VS Code

1. Abra a pasta `Backend` em uma janela ou terminal próprio.
2. Instale Maven e use um JDK 17 (ou JDK posterior compatível compilando com release 17).
3. Inicie MariaDB no XAMPP e confirme que `amt_solution` foi importado.
4. Execute `mvn spring-boot:run`.
5. Teste, por exemplo, `GET http://localhost:8080/api/fornecedores`.

Para teste manual com PowerShell:

```powershell
Invoke-RestMethod http://localhost:8080/api/fornecedores
Invoke-RestMethod -Method Post http://localhost:8080/api/fornecedores -ContentType application/json -Body '{"nome":"Fornecedor API","documento":"88.888.888/0001-88","contato":"Teste","telefone":"(11) 98888-8888","email":"api@amt.local","ativo":true}'
```

Use registros de teste e remova/desative-os após a demonstração.

## Padrões e próximas etapas

Os campos das estratégias foram preservados em contas a pagar/receber; `tipo` e `chave_evento` de avisos suportam Factory Method; estoque mínimo e vencimento suportam Observer. Nenhum desses padrões foi implementado nesta etapa. Também não há autenticação, integração React ou variabilidade ativa.

## Testes realizados

- Conexão somente de leitura com MariaDB 10.4.32: aprovada.
- Listagem e `DESCRIBE` das seis tabelas do banco `amt_solution`: aprovados; os nomes e tipos conferem com as entidades.
- Build Maven: aprovado com `mvn package -DskipTests`, usando Maven 3.9.10 temporário porque `mvn` não está instalado globalmente na máquina.
- Inicialização Spring Boot e validação Hibernate com `ddl-auto=validate`: aprovadas. Foi encontrada inicialmente uma incompatibilidade de mapeamento `TEXT`/CLOB; ela foi corrigida somente nas anotações JPA com `LONGVARCHAR`/`TEXT`, sem mudar o banco ou os scripts SQL.
- Listagens `GET` de fornecedores, produtos, contas a pagar e avisos: retornaram 200. Os seis controladores foram carregados com os seis repositórios JPA.
- CRUDs reais: fornecedor e produto foram criados, atualizados e desativados; conta a pagar e conta a receber foram criadas, atualizadas, tiveram a situação alterada e foram excluídas; usuário foi criado, atualizado e desativado; aviso foi criado, atualizado e excluído. Os registros financeiros e avisos temporários foram removidos. Os três cadastros de teste desativados foram preservados para respeitar a regra de exclusão lógica.
- Erros HTTP: 400 (corpo inválido), 404 (ID inexistente) e 409 (documento duplicado) foram confirmados.
- A instância temporária do backend foi encerrada após os testes. Nenhum arquivo dentro de `Frontend` foi alterado nesta etapa.
