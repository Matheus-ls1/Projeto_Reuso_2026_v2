# DATABASE FIRST — AMT Solutions
## Documentação técnica, rastreabilidade e autoria

**Disciplina:** Reuso de Software  
**Projeto:** AMT Solutions  
**Módulo implementado:** Caixa  
**Data da documentação:** 12/11/2026  
**Escopo:** geração automática de classes e persistência a partir do banco MariaDB, integração com Spring Boot e React, preservação dos módulos existentes.

> **Sobre as evidências:** este documento registra os passos, resultados e incidentes descritos nos relatórios do Codex e nas verificações apresentadas pelo desenvolvedor. Não atribui ao MyBatis Generator arquivos que foram implementados com apoio do Codex. Os testes de escrita do Caixa e a causa exata dos erros HTTP 500 não foram documentados até o momento; essas limitações estão indicadas expressamente.

---

## 1. Objetivo da atividade

Aplicar **Database First**, partindo de um esquema de banco de dados para **gerar código automaticamente** por uma ferramenta específica e demonstrar sua utilização no sistema.

No projeto, a ferramenta escolhida foi o **MyBatis Generator (MBG)**, responsável pela leitura das tabelas reais e geração automática de:

- modelos Java correspondentes às tabelas;
- interfaces Mapper Java;
- arquivos Mapper XML com instruções de persistência, incluindo INSERT, SELECT, UPDATE e DELETE.

**Não foram gerados automaticamente** Controllers REST, Services, DTOs ou interfaces React. Essas partes foram desenvolvidas/adaptadas para integrar o código gerado ao sistema, e devem ser apresentadas como trabalho de implementação, não como produto do gerador.

A geração automática de telas não foi realizada, pois o foco escolhido foi atender ao requisito obrigatório sem expandir o escopo.

## 2. Estado inicial do sistema

O AMT Solutions já possuía:

| Camada | Tecnologias |
|---|---|
| Frontend | React, JSX/JavaScript, Vite |
| Backend | Java 17, Spring Boot 3.5.0, Maven |
| Persistência original | Spring Data JPA |
| Banco de dados | MariaDB, schema `amt_solution` |
| Ambiente | VS Code, Windows, XAMPP, phpMyAdmin |

Os **seis CRUDs existentes** eram Produtos/Insumos, Fornecedores, Contas a Pagar, Contas a Receber, Usuários e Avisos. Também estavam implementados exemplos dos padrões Factory Method, Strategy e Observer.

A tela **`Frontend/src/pages/Caixa.jsx`** existia, mas trabalhava com **dados simulados**: saldo inicial fixo, movimentações fictícias (inclusive vendas), responsável fictício e estado local de caixa aberto/fechado.

### 2.1 Por que o Caixa foi escolhido?

O Caixa tinha escopo bem definido: **abrir, registrar reforço, registrar sangria, listar movimentações e fechar**. Era viável criar suas tabelas separadamente, usar uma ferramenta Database First e substituir os mocks da tela existente sem refazer os outros seis CRUDs. Alternativas como Pedidos de Compra e Permissões teriam mais dependências e efeitos no restante do sistema.

### 2.2 Limites definidos

- Não alterar os seis CRUDs JPA.
- Não modificar Factory Method, Strategy e Observer.
- Não redesenhar a interface React.
- Não integrar vendas fictícias a uma tabela inexistente.
- Não editar manualmente os modelos ou Mappers gerados.
- Manter a geração isolada no módulo `DatabaseFirst_Demo`.

---

## 3. Arquitetura final prevista

```text
┌───────────────────────────────────────────────────┐
│ React: Frontend/src/pages/Caixa.jsx               │
│ CaixaService HTTP: frontend/src/services          │
└───────────────────────┬───────────────────────────┘
                        │ HTTP/JSON
                        ▼
┌───────────────────────────────────────────────────┐
│ Spring Boot: CaixaController                      │
│ CaixaService, DTOs, validações e transações       │
│ (código de integração, NÃO gerado pelo MBG)       │
└───────────────────────┬───────────────────────────┘
                        │ Mapper Java
                        ▼
┌───────────────────────────────────────────────────┐
│ MyBatis Mapper + XML SQL                          │
│ (código GERADO automaticamente pelo MBG)          │
│ + CaixaConsultaMapper para consultas específicas  │
└───────────────────────┬───────────────────────────┘
                        │ JDBC
                        ▼
┌───────────────────────────────────────────────────┐
│ MariaDB: amt_solution                             │
│ caixas 1 ─────────── N movimentacoes_caixa        │
└───────────────────────────────────────────────────┘
```

**Coexistência:** JPA continua responsável pelos seis módulos antigos. MyBatis é utilizado apenas para o módulo Caixa.

---

## 4. Etapa 01 — Modelagem do banco e migração SQL

### 4.1 Levantamento dos campos na interface

Antes de escrever o esquema, o Codex inspecionou `Caixa.jsx` e identificou:

- **Abertura:** saldo inicial.
- **Entrada/reforço:** valor e motivo.
- **Saída/sangria:** valor e motivo.
- **Listagem:** horário, tipo, descrição e valor.
- **Fechamento:** confirmação; exibição de saldo inicial, entradas, saídas e saldo final.

As vendas e o nome “Beatriz Santos” eram exemplos fictícios. Não foram modelados como dados reais.

### 4.2 Script de migração

Arquivo criado:

`Frontend/database/03_caixa.sql`

Ele utiliza `USE amt_solution`, `CREATE TABLE`, chaves primárias/estrangeiras, `CHECK`, índices e triggers. Não foi projetado para remover tabelas antigas nem limpar dados. O script não usa `IF NOT EXISTS`, para evitar ocultar estruturas divergentes em uma nova execução.

#### Tabela `caixas`

| Coluna | Tipo | Finalidade |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Identificador do caixa |
| `aberto_em` | `DATETIME` | Momento da abertura |
| `fechado_em` | `DATETIME NULL` | Momento do fechamento |
| `saldo_inicial` | `DECIMAL(10,2)` | Valor informado ao abrir |
| `saldo_final` | `DECIMAL(10,2) NULL` | Saldo histórico no fechamento |
| `situacao` | `ENUM('ABERTO','FECHADO')` | Estado do caixa |
| `criado_em` | `DATETIME` | Auditoria |
| `atualizado_em` | `DATETIME` | Auditoria |

#### Tabela `movimentacoes_caixa`

| Coluna | Tipo | Finalidade |
|---|---|---|
| `id` | `BIGINT UNSIGNED AUTO_INCREMENT` | Identificador |
| `caixa_id` | `BIGINT UNSIGNED` | FK para `caixas.id` |
| `tipo` | `ENUM('ENTRADA','SAIDA')` | Natureza |
| `valor` | `DECIMAL(10,2)` | Valor sempre positivo |
| `descricao` | `VARCHAR(200)` | Motivo |
| `ocorrido_em` | `DATETIME` | Momento da movimentação |
| `criado_em` | `DATETIME` | Auditoria |
| `atualizado_em` | `DATETIME` | Auditoria |

**Relacionamento:** um caixa pode possuir muitas movimentações (1:N). A FK utiliza `ON UPDATE RESTRICT` e `ON DELETE RESTRICT`.

**Regra monetária:** o valor é sempre armazenado positivo. O sinal lógico resulta do `tipo`.

```text
Saldo atual = saldo inicial + soma(ENTRADA) - soma(SAIDA)
```

### 4.3 Integridade no banco

Restrições `CHECK` definidas:

- `saldo_inicial >= 0`;
- `valor > 0`;
- caixa aberto sem dados de fechamento e caixa fechado com data e saldo final preenchidos.

Triggers criadas:

| Trigger | Propósito |
|---|---|
| `trg_movimentacoes_caixa_bi_caixa_aberto` | Bloquear INSERT em caixa fechado |
| `trg_movimentacoes_caixa_bu_caixa_aberto` | Bloquear UPDATE em caixa fechado |
| `trg_movimentacoes_caixa_bd_caixa_aberto` | Bloquear DELETE em caixa fechado |
| `trg_caixas_bu_fechado_imutavel` | Impedir alteração de caixa já fechado |

### 4.4 Problema na primeira importação

Ao usar phpMyAdmin apareceu um **erro `#1044` de acesso negado a `information_schema`** e alertas do analisador estático próximos de `CHECK`.

A migração original incluía uma consulta de pré-verificação de tabelas em `information_schema.tables`. O procedimento foi ajustado para conferir o banco e a existência de tabelas separadamente com `SELECT DATABASE()`, `VERSION()` e `SHOW TABLES`, sem depender daquela consulta no arquivo de criação.

**Resultado confirmado pelo usuário:** a importação foi concluída com sucesso. Os alertas estáticos de `CHECK` não foram demonstrados como erro real de sintaxe do MariaDB.

Para verificar:

```sql
USE amt_solution;

SHOW TABLES LIKE 'caixas';
SHOW TABLES LIKE 'movimentacoes_caixa';

SHOW CREATE TABLE caixas;
SHOW CREATE TABLE movimentacoes_caixa;

SHOW TRIGGERS FROM amt_solution;
```

**Observação:** o Codex não confirmou os triggers individualmente em uma verificação JShell posterior, devido a um problema de codificação BOM no console.

---

## 5. Etapa 02 — Geração automática com MyBatis Generator

### 5.1 Ferramenta utilizada

O módulo `DatabaseFirst_Demo` já existia como projeto Maven de demonstração, inicialmente configurado para `fornecedores`. Foi reconfigurado para **gerar somente as classes das novas tabelas Caixa**, evitando duplicar o CRUD de Fornecedores que já funcionava em JPA.

Configuração relatada:

| Parâmetro | Valor |
|---|---|
| Java | 17 |
| MyBatis Generator | 2.0.0 |
| MariaDB JDBC | 3.5.11 |
| `targetRuntime` | `MyBatis3Simple` |
| `clientGenerator` | `XMLMAPPER` |
| Modelos e interfaces | `src/main/java` |
| SQL XML | `src/main/resources` |

Arquivo principal: `DatabaseFirst_Demo/src/main/resources/generatorConfig.xml`.

Trecho das tabelas:

```xml
<table tableName="caixas" domainObjectName="CaixaGerado"/>
<table tableName="movimentacoes_caixa"
       domainObjectName="MovimentacaoCaixaGerada"/>
```

Mais tarde, essa configuração também recebeu suporte a **chaves geradas por JDBC**, necessário para obter o ID dos novos registros após INSERT.

### 5.2 Execução de engenharia reversa

Na pasta `DatabaseFirst_Demo`:

```powershell
mvn mybatis-generator:generate
mvn clean compile
mvn exec:java
```

O Codex relatou `BUILD SUCCESS` em todos os comandos. O Maven realizou **conexão real ao MariaDB** e introspecção das duas tabelas. Não se tratou de escrever classes manualmente a partir do SQL.

### 5.3 Seis arquivos gerados automaticamente

| Arquivo | Categoria | Caminho a partir de `DatabaseFirst_Demo` |
|---|---|---|
| `CaixaGerado.java` | Modelo | `src/main/java/com/amtsolutions/databasefirst/model/` |
| `MovimentacaoCaixaGerada.java` | Modelo | Mesmo diretório |
| `CaixaGeradoMapper.java` | Interface Mapper | `src/main/java/com/amtsolutions/databasefirst/mapper/` |
| `MovimentacaoCaixaGeradaMapper.java` | Interface Mapper | Mesmo diretório |
| `CaixaGeradoMapper.xml` | SQL gerado | `src/main/resources/com/amtsolutions/databasefirst/mapper/` |
| `MovimentacaoCaixaGeradaMapper.xml` | SQL gerado | Mesmo diretório |

Os Mappers possuem as operações:

```text
insert
selectByPrimaryKey
selectAll
updateByPrimaryKey
deleteByPrimaryKey
```

**Isso constitui geração automática de CRUD na camada de persistência.** Não significa que as rotas HTTP ou a interface tenham sido geradas automaticamente.

### 5.4 Tipos SQL transformados em Java

| MariaDB | Java produzido |
|---|---|
| `BIGINT UNSIGNED` | `Long` |
| `DECIMAL(10,2)` | `BigDecimal` |
| `DATETIME` | `LocalDateTime` |
| `ENUM` | `String` |
| `VARCHAR` | `String` |
| `caixa_id` (FK) | `Long caixaId` |

O gerador não criou uma associação de objeto JPA: ele mapeou a FK como atributo escalar `caixaId`, comportamento esperado nessa configuração.

### 5.5 Erro de compilação e solução

A primeira compilação falhou porque o código gerado referenciava `jakarta.annotation.Generated`, indisponível no JDK 17 sem a dependência correspondente. A dependência `jakarta.annotation-api` foi adicionada ao `DatabaseFirst_Demo/pom.xml`.

Depois disso, `mvn clean compile` passou. O Codex relatou a compilação de cinco fontes Java.

### 5.6 Demonstração de leitura

`DemonstracaoDatabaseFirst.java` foi ajustada para consultar `CaixaGeradoMapper.selectAll()`. O resultado foi **zero registros** em `caixas`, em consulta real, sem INSERT/UPDATE/DELETE.

Esse arquivo de demonstração foi **adaptado manualmente**, diferentemente das classes e XMLs gerados.

---

## 6. Etapa 03 — Integração ao Spring Boot

### 6.1 Reutilização do artefato gerado

O módulo `DatabaseFirst_Demo` passou a ser consumido pelo backend como dependência Maven local:

```powershell
cd DatabaseFirst_Demo
mvn clean install

cd ../Backend
mvn clean test
```

Dependências adicionadas em `Backend/pom.xml`:

- `org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.5`;
- `com.amtsolutions:databasefirst-demo:1.0.0`;
- `spring-boot-starter-test`.

Assim, o backend reutiliza os arquivos gerados, **sem copiá-los para os pacotes dos CRUDs JPA**.

### 6.2 Arquivos manuais de integração

| Arquivo | Responsabilidade |
|---|---|
| `Backend/src/main/java/com/amtsolution/config/DatabaseFirstMyBatisConfig.java` | Configurar MyBatis e reconhecer Mappers |
| `Backend/src/main/java/com/amtsolution/controller/CaixaController.java` | Rotas HTTP |
| `Backend/src/main/java/com/amtsolution/service/CaixaService.java` | Regras de negócio e transações |
| `Backend/src/main/java/com/amtsolution/dto/` | Contratos de entrada/saída |
| `Backend/src/main/java/com/amtsolution/databasefirst/mapper/CaixaConsultaMapper.java` | Consultas extras, ordenação e `FOR UPDATE` |

**Esses arquivos não são produto do MyBatis Generator.**

O MyBatis usa o **mesmo `DataSource` MariaDB** da aplicação, mantendo o JPA nos módulos anteriores. Foi configurado `caixaTransactionManager` baseado em `DataSourceTransactionManager`.

Os pacotes do backend (`com.amtsolution`) e do código gerado (`com.amtsolutions.databasefirst`) diferem; a configuração precisou reconhecer explicitamente os Mappers.

### 6.3 Endpoints disponibilizados

| Método | Endpoint | Funcionalidade |
|---|---|---|
| POST | `/api/caixas` | Abrir caixa |
| GET | `/api/caixas/aberto` | Consultar caixa aberto |
| GET | `/api/caixas/{id}` | Consultar caixa específico |
| POST | `/api/caixas/{id}/entradas` | Registrar reforço |
| POST | `/api/caixas/{id}/saidas` | Registrar sangria |
| GET | `/api/caixas/{id}/movimentacoes` | Listar movimentos |
| GET | `/api/caixas/movimentacoes/{id}` | Consultar movimento |
| PUT | `/api/caixas/movimentacoes/{id}` | Atualizar movimento de caixa aberto |
| DELETE | `/api/caixas/movimentacoes/{id}` | Excluir movimento de caixa aberto |
| POST | `/api/caixas/{id}/fechamento` | Fechar caixa |

### 6.4 Regras implementadas

O Service foi desenvolvido para:

- utilizar `BigDecimal` nos valores;
- rejeitar saldo inicial negativo e movimentação com valor não positivo;
- evitar abrir outro caixa quando já há um aberto;
- computar saldo como `saldoInicial + entradas - saídas`;
- usar transações e bloqueio de linha `FOR UPDATE` nas operações críticas;
- impedir movimentações e novo fechamento de caixa encerrado;
- gravar `saldo_final`, `fechado_em` e `situacao`;
- respeitar as restrições e triggers do MariaDB.

**Nota de concorrência:** a suficiência do controle de abertura simultânea precisa ser confirmada no código e em testes específicos; a existência de `FOR UPDATE` por si só não comprova unicidade global de caixas abertos em todos os cenários concorrentes.

### 6.5 Validação nesta etapa

O Codex informou:

- instalação do gerador concluída;
- `mvn clean test` concluído;
- inicialização do Spring Boot na porta 8080;
- seis repositórios JPA reconhecidos;
- Mappers MyBatis carregados.

**Não foram executados testes de escrita contra o banco real nessa etapa.**

---

## 7. Etapa 04 — Adaptação do frontend React

Arquivos modificados/criados:

| Arquivo | Alteração |
|---|---|
| `Frontend/src/pages/Caixa.jsx` | Substituição de mocks por dados reais e estados HTTP |
| `Frontend/src/services/caixaService.js` | Serviço de requisições do Caixa |
| `Frontend/src/services/api.js` | Inclusão de `error.status` no tratamento de erro |

Fluxo na tela:

```text
Abrir tela → GET /api/caixas/aberto
Caixa aberto → GET /api/caixas/{id}/movimentacoes
Abrir caixa → POST /api/caixas
Registrar reforço → POST /api/caixas/{id}/entradas
Registrar sangria → POST /api/caixas/{id}/saidas
Fechar caixa → POST /api/caixas/{id}/fechamento
```

A tela passou a utilizar `saldoAtual` retornado pelo backend, valores formatados em BRL e movimentações persistidas. O tipo `SAIDA` é exibido com sinal negativo **apenas visualmente**, enquanto o banco grava o valor positivo.

Ao concluir operações, a tela consulta a API novamente. Ao recarregar o navegador, a fonte da verdade continua sendo o MariaDB.

**Mocks removidos:** responsável “Beatriz Santos”, saldo inicial fixo de R$ 200, vendas exemplificativas e movimentações locais artificiais.

O backend retorna `404` quando **não há caixa aberto**. A tela reconhece essa resposta como estado esperado (“Caixa fechado”), diferenciando-a de falhas de comunicação.

Builds relatados como concluídos:

```powershell
cd Frontend
npm run build

cd ../Backend
mvn clean test
```

Os avisos do Vite sobre bundle/configuração não impediram a compilação.

---

## 8. Etapa 05 — Validação e problemas reais

### 8.1 O que foi efetivamente verificado

| Verificação | Resultado informado |
|---|---|
| `mvn clean install -DskipTests` no gerador | Concluído |
| `mvn clean test` no backend | Concluído |
| `npm run build` no frontend | Concluído |
| API em `localhost:8080` | Acessível |
| `GET /api/caixas/aberto` | HTTP 404, sem caixa aberto |
| CORS para `http://localhost:5173` | OPTIONS HTTP 200 |
| Leitura real com Mapper `selectAll()` | 0 caixas |
| Escritas de abertura, reforço, sangria e fechamento | **Sem teste documentado** |

Resposta HTTP relatada:

```json
{
  "status": "404",
  "erro": "Caixa aberto não encontrado com id 0."
}
```

Nesse endpoint, esse `404` é esperado na ausência de caixa aberto; não significa que o backend está fora do ar.

### 8.2 Porta do frontend

Durante os testes, o navegador estava em `http://localhost:8443/caixa`, enquanto a origem CORS verificada era `http://localhost:5173`.

O frontend foi orientado a iniciar explicitamente na porta 5173:

```powershell
cd Frontend
npm run dev -- --port 5173 --strictPort
```

Depois houve captura em `http://localhost:5173`. **Não foi apresentado um erro de CORS explícito na captura original**, então a porta diferente era um risco a verificar, não causa comprovada de todos os problemas.

### 8.3 Erros HTTP 500 nos seis CRUDs anteriores

Após a troca de porta, o Console do Chrome mostrou **HTTP 500** nos endpoints:

- `/api/produtos`;
- `/api/fornecedores`;
- `/api/contas-pagar`;
- `/api/contas-receber`;
- `/api/usuarios`;
- `/api/avisos`.

Foi preparado um diagnóstico para o Codex conferir processo na porta 8080, logs `Caused by`, conexão MariaDB, schema, JPA, configuração de `DataSource`, transações e possível interferência da integração MyBatis.

**Resultado posterior comunicado pelo desenvolvedor:** “agora está tudo funcionando de novo”.

**Limitação importante para autoria:** não foi compartilhado o relatório do diagnóstico, a exceção original nem os arquivos corrigidos. Logo, não se pode afirmar que o MyBatis provocou a regressão ou descrever uma causa/correção específica como comprovada. A recuperação está registrada como **relatada pelo desenvolvedor**.

### 8.4 Outras ocorrências

- Uma segunda inicialização do Spring Boot falhou porque a porta **8080 já estava ocupada** por uma instância da API.
- Um `404` de `favicon.ico` apareceu no navegador; não afeta o Caixa.
- Os testes de gravação foram adiados para evitar inserir dados no banco real antes de autorização.

---

## 9. Matriz de impacto: quem foi afetado?

| Componente | Impacto |
|---|---|
| `amt_solution` | Duas novas tabelas, FK, CHECKs, índices e triggers |
| `DatabaseFirst_Demo` | Nova configuração de geração, dependência, seis arquivos gerados e leitura de demonstração |
| `Backend/pom.xml` | Dependências MyBatis e módulo de geração |
| Configuração Spring | Nova configuração MyBatis e transações |
| Backend Caixa | Novos Controller, Service, DTOs e Mapper auxiliar |
| `Caixa.jsx` | Substituição da lógica simulada por API |
| `caixaService.js` | Criado |
| `api.js` | Ajustado para expor `error.status` |
| Seis módulos JPA | Nenhuma alteração planejada; falhas 500 apareceram durante testes, depois relatadas como resolvidas |
| Factory Method, Strategy, Observer | Preservados segundo relatórios |
| Outras páginas React | Preservadas segundo relatórios |

---

## 10. Passo a passo para reproduzir o trabalho

> Instruções para uma instalação local. Não execute novamente a migração se as tabelas já existirem. Faça backup antes de operar em banco com dados.

### 10.1 Verificar a existência do esquema

No phpMyAdmin, selecione `amt_solution`:

```sql
USE amt_solution;

SHOW TABLES LIKE 'caixas';
SHOW TABLES LIKE 'movimentacoes_caixa';

SHOW CREATE TABLE caixas;
SHOW CREATE TABLE movimentacoes_caixa;
SHOW TRIGGERS FROM amt_solution;
```

Se as tabelas **não existirem**, importe `Frontend/database/03_caixa.sql`. Se já existirem, não reexecute a migração.

### 10.2 Gerar o código Java a partir do MariaDB

Abra terminal na pasta `Código_Fonte`:

```powershell
cd DatabaseFirst_Demo
mvn mybatis-generator:generate
mvn clean install
```

Abra `generatorConfig.xml` e os seis arquivos Java/XML produzidos. Para demonstrar a geração novamente, prefira usar **cópia limpa do módulo** e registrar antes/depois dos diretórios. Não apague artefatos de um projeto funcionando apenas para filmar a geração.

### 10.3 Iniciar o Spring Boot

Em outro terminal na pasta `Código_Fonte`:

```powershell
cd Backend
mvn clean test
mvn spring-boot:run
```

O artefato Maven `databasefirst-demo:1.0.0` precisa estar instalado localmente antes do build do backend.

### 10.4 Iniciar o frontend

Em terceiro terminal na pasta `Código_Fonte`:

```powershell
cd Frontend
npm install
npm run dev -- --port 5173 --strictPort
```

Acesse:

`http://localhost:5173/caixa`

Backend esperado: `http://localhost:8080`.

### 10.5 Validar leitura

```http
GET http://localhost:8080/api/caixas/aberto
```

Sem caixa aberto, resposta esperada: HTTP 404 com mensagem de caixa não encontrado. Com caixa aberto, devem aparecer os dados retornados pelos DTOs.

---

## 11. Roteiro de teste funcional do Caixa

**Este é um roteiro para executar e registrar, não um teste já comprovado.**

1. Confirmar que não existe caixa aberto.
2. Abrir caixa com **R$ 200,00**.
3. Registrar **ENTRADA R$ 100,00**, motivo “Reforço de teste”.
4. Registrar **SAIDA R$ 50,00**, motivo “Sangria de teste”.
5. Confirmar saldo atual de **R$ 250,00**.
6. Recarregar a página (`F5`) e confirmar persistência.
7. Fechar o caixa.
8. Verificar `situacao='FECHADO'`, `fechado_em` e `saldo_final=250.00`.
9. Confirmar que novas movimentações no caixa fechado são rejeitadas.
10. Conferir que os seis CRUDs antigos continuam respondendo corretamente.

Consulta de auditoria somente leitura:

```sql
SELECT
    c.id,
    c.situacao,
    c.saldo_inicial,
    COALESCE(SUM(CASE WHEN m.tipo = 'ENTRADA' THEN m.valor ELSE 0 END), 0) AS entradas,
    COALESCE(SUM(CASE WHEN m.tipo = 'SAIDA' THEN m.valor ELSE 0 END), 0) AS saidas,
    c.saldo_final
FROM caixas c
LEFT JOIN movimentacoes_caixa m ON m.caixa_id = c.id
GROUP BY c.id, c.situacao, c.saldo_inicial, c.saldo_final
ORDER BY c.id DESC;
```

Resultado esperado para o novo caixa de teste:

| Campo | Esperado |
|---|---|
| `situacao` | `FECHADO` |
| `saldo_inicial` | `200.00` |
| `entradas` | `100.00` |
| `saidas` | `50.00` |
| `saldo_final` | `250.00` |

Após fechar, a tela principal pode voltar a indicar “Caixa fechado”, porque procura **caixa aberto**, mesmo que o registro histórico continue salvo no banco.

---

## 12. Como demonstrar a autoria ao professor

### 12.1 Evidências que devem ser apresentadas

| ID | Evidência real a capturar | O que comprova |
|---|---|---|
| E01 | `03_caixa.sql` | Esquema modelado antes da geração |
| E02 | Tabelas no phpMyAdmin | Banco preexistente à execução do gerador |
| E03 | `generatorConfig.xml` | Ferramenta e duas tabelas selecionadas |
| E04 | `mvn mybatis-generator:generate` + `BUILD SUCCESS` | Geração efetivamente executada |
| E05 | Seis arquivos Java/XML gerados | Resultado da engenharia reversa |
| E06 | `DESCRIBE caixas` ao lado de `CaixaGerado.java` | Correspondência SQL→Java |
| E07 | Mapper Java e Mapper XML | Operações CRUD geradas |
| E08 | `Backend/pom.xml` | Reaproveitamento do artefato gerado |
| E09 | Controller→Service→Mapper | Integração manual ao backend |
| E10 | Tela Caixa + dados no phpMyAdmin | Funcionamento e persistência, quando testados |
| E11 | Requisições dos seis CRUDs antigos | Verificação de ausência de regressão |
| E12 | Logs de Maven/Vite | Reprodutibilidade |

**Não inventar prints ou apresentar testes planejados como concluídos.**

### 12.2 Explicação da diferença entre as partes

**Gerado automaticamente pelo MyBatis Generator:**

- `CaixaGerado.java`;
- `MovimentacaoCaixaGerada.java`;
- `CaixaGeradoMapper.java`;
- `MovimentacaoCaixaGeradaMapper.java`;
- `CaixaGeradoMapper.xml`;
- `MovimentacaoCaixaGeradaMapper.xml`.

**Criado ou adaptado com apoio do Codex:**

- SQL da migração;
- configuração do gerador;
- dependências Maven;
- configuração Spring/MyBatis;
- Controller, Service e DTOs;
- Mapper auxiliar;
- serviço HTTP React;
- integração da interface Caixa;
- testes e ajustes de ambiente.

**Ponto-chave:** o gerador **não** criou a aplicação completa. Ele criou o código de persistência a partir do esquema do banco. Esse código foi efetivamente reaproveitado no sistema.

### 12.3 Perguntas frequentes na avaliação

**O que é Database First neste projeto?**  
É iniciar com tabelas MariaDB existentes e utilizar uma ferramenta que lê sua estrutura para produzir classes Java e consultas de persistência.

**A geração foi automática ou o Codex escreveu as classes?**  
O Codex configurou e executou o MyBatis Generator; os seis arquivos de modelo, Mapper e SQL foram gerados **pela ferramenta**, como relatado na execução real do Maven.

**O CRUD também foi gerado?**  
**Sim, no nível de persistência:** INSERT, SELECT, UPDATE e DELETE nos Mappers/XMLs. Os endpoints REST e regras financeiras foram implementados separadamente.

**E as telas automáticas?**  
Não foram geradas. A tela Caixa já existia e foi conectada à API real. O escopo priorizou o requisito obrigatório de geração de código a partir do banco.

**Por que MyBatis se já havia JPA?**  
Para demonstrar a ferramenta de engenharia reversa sem reescrever os seis CRUDs existentes.

**O que mantém a integridade financeira?**  
Validações no Service, transações, consultas com bloqueio em operações críticas, restrições SQL, FK e triggers.

**Se a tabela mudar, o que deve ser feito?**  
Revisar a configuração e **regenerar** os arquivos com o MBG, sem modificar diretamente os arquivos gerados como solução permanente.

**Por que o GET do caixa aberto retorna 404?**  
Porque a ausência de caixa aberto é mapeada dessa forma pela API. Isso é diferente de indisponibilidade da rede ou de erro HTTP 500.

**O que houve com os HTTP 500 dos demais módulos?**  
Foram observados nas requisições durante o teste e depois relatados como resolvidos. A causa e a alteração exata não foram fornecidas; não devem ser atribuídas ao MyBatis sem comprovação.

### 12.4 Declaração de autoria precisa

> O desenvolvimento utilizou o Codex como apoio à inspeção, configuração e implementação, e o ChatGPT no planejamento das etapas e na revisão técnica. A ferramenta de engenharia reversa efetivamente executada foi o **MyBatis Generator**, que leu as tabelas do banco MariaDB e produziu automaticamente os modelos Java, interfaces Mapper e arquivos XML de SQL CRUD. A modelagem do banco, a configuração e execução do gerador, a criação de Controllers, Services e DTOs e a integração ao React foram etapas adicionais de desenvolvimento, não saídas automáticas do MBG. Os resultados devem ser demonstrados com código, logs e capturas reais.

---

## 13. Pendências e limites de evidência

1. **Teste ponta a ponta de escrita:** ainda não foi apresentado resultado completo para abrir, lançar entrada, lançar saída, recarregar e fechar.
2. **Erros HTTP 500:** a recuperação foi informada, mas a causa raiz e os arquivos corrigidos não foram detalhados.
3. **Triggers:** devem ser confirmados com `SHOW TRIGGERS` e teste controlado de bloqueio.
4. **Concorrência:** a regra de um único caixa aberto e as transações merecem teste adicional com requisições simultâneas.
5. **Testes automatizados:** build com sucesso não equivale a cobertura real de abertura, movimentação e fechamento.
6. **Interface gerada:** não foi implementada; a tela existente foi adaptada.
7. **Reprodutibilidade Maven:** é necessário instalar `DatabaseFirst_Demo` antes de compilar o Backend, salvo futura configuração de build agregador.

---

## 14. Checklist de conclusão

- [x] Definir módulo Caixa como escopo.
- [x] Criar script `03_caixa.sql`.
- [x] Criar as duas tabelas MariaDB (confirmado pelo desenvolvedor).
- [x] Configurar o MyBatis Generator.
- [x] Executar a geração real dos seis artefatos.
- [x] Compilar e instalar o módulo gerado.
- [x] Integrar o código gerado ao Spring Boot.
- [x] Implementar Controller, Service e DTOs do Caixa.
- [x] Integrar a tela React sem dados simulados.
- [x] Obter builds bem-sucedidos do frontend e backend.
- [x] Confirmar leitura real pelo Mapper e pela API.
- [x] Registrar a observação dos erros 500 e relato posterior de recuperação.
- [ ] Anexar evidência da causa e correção dos HTTP 500.
- [ ] Executar e registrar teste de escrita ponta a ponta.
- [ ] Validar triggers e persistência do fechamento.
- [ ] Capturar a geração automática e o funcionamento em tela para o professor.
- [ ] Confirmar e registrar os seis CRUDs existentes em funcionamento.

---

## 15. Conclusão

O projeto aplicou **Database First** de maneira efetiva: criou um esquema no MariaDB, executou o **MyBatis Generator** contra esse esquema e produziu automaticamente **modelos Java, interfaces Mapper e SQL CRUD**. Esses artefatos foram integrados ao Spring Boot e à tela React existente, mantendo os seis módulos JPA como funcionalidades independentes.

A conexão real, a geração, a compilação, a leitura de banco e as respostas HTTP de leitura foram relatadas como verificadas. A regressão HTTP 500 nos CRUDs antigos foi observada e depois informada como resolvida, ainda sem diagnóstico detalhado anexado. Os testes de escrita e fechamento deverão ser registrados para completar a comprovação funcional.

**Resumo da autoria:** o esquema do banco definiu a estrutura; o gerador produziu automaticamente os arquivos de persistência; a integração manual tornou esse código utilizável na aplicação.
