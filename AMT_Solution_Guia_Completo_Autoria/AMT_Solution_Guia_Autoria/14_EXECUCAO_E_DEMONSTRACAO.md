# 14 — Execução local, demonstração visual e solução de problemas

## 1. Pré-requisitos

- JDK compatível com projeto Java 17.
- Apache Maven instalado no PATH (ou Maven Wrapper se existir na cópia específica).
- Node.js e npm compatíveis com as versões declaradas no frontend.
- MariaDB/MySQL disponível via XAMPP ou instalação equivalente.
- Banco `amt_solution` e tabelas criadas com `Frontend/database/01_schema.sql`.
- VS Code opcional para explorar as classes e acompanhar a autoria.

Os nomes `Frontend/` e `Backend/` são **pastas irmãs**, não uma dentro da outra.

## 2. Preparar o banco

1. Iniciar o serviço MySQL/MariaDB do XAMPP.
2. Abrir phpMyAdmin ou cliente SQL.
3. Executar `Frontend/database/01_schema.sql` em banco local destinado à demonstração.
4. Opcionalmente, popular ambiente recém-preparado com `02_seed.sql`, **sem reexecutar em base com dados valiosos**.
5. Verificar que existem seis tabelas.

`ddl-auto=validate` exige esquema prévio; se a estrutura não estiver criada/corresponder, a API pode falhar ao iniciar.

## 3. Executar backend

Na pasta `Backend`, com Maven disponível:

```powershell
mvn spring-boot:run
```

Se houver JAR compilado compatível na pasta `target`, outro modo de execução é:

```powershell
java -jar target/amt-solution-api-0.0.1-SNAPSHOT.jar
```

Variáveis relevantes de `application.properties`: `SERVER_PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Defaults: API 8080, banco localhost:3306/amt_solution, root/sem senha. Ajustar ao ambiente local **sem versionar segredos**.

**Problema histórico:** o Tomcat do XAMPP pode ocupar porta 8080; o backend Spring não precisa do Tomcat do XAMPP. O Spring Boot possui seu próprio servidor web embutido via starter-web.

## 4. Executar frontend

Na pasta `Frontend`:

```powershell
npm install
npm run dev
```

O `vite.config.js` enviado tem porta padrão **8443** (`process.env.PORT || '8443'`) e `strictPort: true`. Também é possível escolher 5173 explicitamente, por exemplo:

```powershell
npm run dev -- --port 5173 --strictPort
```

O navegador acessa a URL informada pelo Vite. **Não presuma que a porta será 5173 ao executar sem argumento**: confira o terminal e as configurações. `CorsConfig.java` do Spring permite 5173 e 8443.

`Frontend/.env.example` indica `VITE_API_URL=http://localhost:8080/api`; o código `api.js` também usa esse endereço como padrão. Para alterar origem da API, criar configuração local de ambiente conforme o Vite, sem guardar senhas lá.

## 5. Builds (não são testes funcionais completos)

```powershell
# Dentro de Backend
mvn package -DskipTests

# Dentro de Frontend
npm run build
```

Build bem-sucedido indica que a compilação/empacotamento terminou, **não** prova sozinho a navegação, persistência ou a correta aplicação dos padrões. O relato da equipe registrou testes manuais dos seis exemplos pelo navegador; esta apostila não reproduziu novamente tais testes.

O aviso de bundle do Vite acima de 500 kB é **aviso de performance**, não falha acadêmica obrigatória.

## 6. Roteiro para demonstrar os seis padrões, 100% no navegador

| Ordem | Abrir | Ação | Evidência esperada |
|---|---|---|---|
| 1 | Contas a Pagar | Selecionar conta → Simular juros e multa | Dois resultados diferentes, sem mudar cadastro |
| 2 | Contas a Receber | Selecionar conta → Simular percentual e fixo | Dois resultados de desconto |
| 3 | Avisos | Novo Aviso → salvar | Aviso manual persistido |
| 4 | Financeiro | Criar conta a pagar e conta a receber | Entidades criadas pelas fábricas |
| 5 | Produtos → Avisos | Editar produto ativo com estoque <= mínimo → salvar → abrir Avisos | Alerta automático de estoque, se chave ainda não existir |
| 6 | Contas a Pagar → Avisos | Conta pendente vencendo de hoje a +3 dias → Verificar vencimentos → abrir Avisos | Alerta automático, salvo regra de duplicidade |

**Para comprovar a arquitetura**, depois da operação visual, mostre o trecho de Service onde o padrão é chamado e as classes concretas.

## 7. Checklist dos seis CRUDs reais

Para cada tela selecionada, conferir: criar, visualizar após atualizar página, editar, alterar estado (quando houver), confirmar exclusão, verificar comportamento quando relacionamento impede DELETE. Usar registros descartáveis e preservar os dados reais.

## 8. Diagnóstico por sintoma

| Sintoma | Causas a investigar |
|---|---|
| `'vite' não é reconhecido` | `node_modules` removido; executar `npm install` e confirmar `vite` em `package.json` |
| `mvn` não reconhecido | Maven ausente do PATH; verificar instalação/terminal novo |
| `Port 8080 already in use` | Outro servidor (possivelmente Tomcat do XAMPP) já ocupa a porta |
| Browser mostra erro CORS | Origin frontend fora das permitidas; verificar `CorsConfig`, porta e preflight |
| Erro “Não foi possível conectar ao backend” | API indisponível, URL incorreta ou conexão bloqueada |
| Backend falha ao iniciar | Banco indisponível, schema não criado, credenciais ou porta incorretas |
| Cadastro retorna 400 | Payload inválido conforme DTO ou parâmetro de regra |
| Cadastro retorna 409 | Duplicidade, FK ou outra restrição de integridade |
| DELETE não remove | HTTP 409 por relacionamento protegido ou falha; analisar resposta |
| Observer não gera novo aviso | Condição não atingida, conta fora de hoje..+3, item inativo ou chave já existente |
| Dois GETs em desenvolvimento | `StrictMode` pode disparar verificações adicionais de efeito; investigar antes de supor duplicidade de POST |

## 9. Como responder a uma falha ao vivo sem improvisar

“Vou verificar se o problema está na interface, na requisição ou na camada de persistência. Primeiro verifico a mensagem de erro e a URL. Depois identifico o Controller e o Service responsáveis. Se for um conflito 409, verifico unicidade e FKs; se for conexão, verifico backend, MariaDB e CORS.”

## 10. O que deixar preparado para a apresentação

1. Frontend e backend iniciados e navegador na página inicial.
2. Um produto de teste adequado para demonstrar estoque.
3. Uma conta a pagar pendente dentro da janela de vencimento.
4. Uma conta a pagar e uma a receber com valores simples para simulação.
5. VS Code com as pastas de Strategy, Factory e Observer acessíveis.
6. Plano de contingência: se um evento já tiver aviso, explique idempotência em vez de apagar histórico indevidamente.
7. Se o professor pedir banco, abrir phpMyAdmin e mostrar as seis tabelas sem editar dados reais.
