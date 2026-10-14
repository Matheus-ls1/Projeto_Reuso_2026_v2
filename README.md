# AMT Solution

Projeto acadêmico da disciplina Desenvolvimento Orientado a Reuso de Software. O sistema combina uma interface React, uma API Spring Boot e MariaDB. Seis módulos possuem CRUD integrado; os demais são protótipos com dados mockados.

## Tecnologias

- React 19, JavaScript/JSX e Vite
- Java 17, Spring Boot 3.5 e Maven
- MariaDB/MySQL (XAMPP)

## Requisitos

- Node.js e npm
- JDK 17 e Maven
- MariaDB/MySQL em execução

## Banco de dados

No phpMyAdmin ou cliente MariaDB, importe nesta ordem:

1. `Frontend/database/01_schema.sql`
2. `Frontend/database/02_seed.sql` (opcional, para dados iniciais)

O backend usa por padrão `localhost:3306`, banco `amt_solution` e usuário `root`. As variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` podem ajustar a conexão local sem registrar credenciais no projeto.

## Execução

Em um terminal:

```powershell
cd Backend
mvn spring-boot:run
```

Em outro terminal:

```powershell
cd Frontend
npm install
npm run dev -- --port 5173 --strictPort
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8080/api`

## CRUDs integrados

- Produtos e insumos
- Fornecedores
- Contas a Pagar
- Contas a Receber
- Usuários
- Avisos

As regras de ativação/desativação, exclusão física e integridade relacional são tratadas pela API conforme cada recurso.

## Padrões de projeto

| Padrão | Exemplos |
| --- | --- |
| Strategy | Encargos de contas a pagar; descontos de contas a receber |
| Factory Method | Avisos manuais/automáticos; lançamentos financeiros |
| Observer | Estoque mínimo; vencimento próximo de contas a pagar |

## Limitação acadêmica

As telas de login, dashboards, PDV, caixa, estoque, pedidos, relatórios e permissões permanecem como protótipos mockados. A variabilidade de Linha de Produto de Software é planejada, não dinâmica; consulte [VARIABILIDADE_LPS.md](VARIABILIDADE_LPS.md).
