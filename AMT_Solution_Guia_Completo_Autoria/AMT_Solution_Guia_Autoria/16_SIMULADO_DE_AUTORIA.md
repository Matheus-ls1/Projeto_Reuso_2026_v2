# 16 — Simulado de prova de autoria: perguntas e respostas comentadas

> Sugestão: um integrante lê as perguntas sem mostrar as respostas; outro responde oralmente e **abre o arquivo exato no VS Code para comprovar**. O terceiro aponta o que ficou incompleto. Respostas abaixo são modelos para compreensão, não scripts que precisam ser decorados.

## Parte A — Contexto, objetivo e escopo

### 1. O que é o AMT Solution?
É um protótipo acadêmico de gestão empresarial com frontend React, backend Java Spring Boot e MariaDB. A entrega se concentra em seis CRUDs reais; outros módulos representam o produto visual com mocks.

### 2. Qual problema o sistema pretende resolver?
Centralizar cadastros e operações administrativas/financeiras e permitir acompanhamento de produtos, contas, usuários, fornecedores e avisos. O recorte implementado demonstra algumas dessas necessidades com persistência real.

### 3. Por que não desenvolveram todo o ERP?
Porque o professor autorizou implementação parcial focada nos requisitos de reuso e CRUD. Completar todos os módulos aumentaria escopo sem ser necessário à atividade.

### 4. Quais são os seis CRUDs reais?
Produtos/Insumos, Fornecedores, Contas a Pagar, Contas a Receber, Usuários e Avisos.

### 5. Quantas tabelas reais existem?
Seis: `produtos`, `fornecedores`, `contas_pagar`, `contas_receber`, `usuarios` e `avisos`.

### 6. Produtos e Insumos contam como duas tabelas?
Não. Uma entidade `Produto`, uma tabela `produtos` e um campo `tipo` com `PRODUTO`/`INSUMO`; são diferentes visões de um módulo.

### 7. Que páginas são mockadas?
Principalmente Dashboard, PDV, Caixa, Estoque, Pedidos, Financeiro visual, Relatórios, Login e Permissões/Módulos. O controle de quantidade do CRUD Produtos é real, apesar de a página Estoque ser mockada.

### 8. Onde estão os três padrões de projeto escolhidos?
Nos pacotes Java `patterns/strategy`, `patterns/factory` e `patterns/observer`, integrados aos Services e às quatro telas reais Produtos, Contas Pagar, Contas Receber e Avisos.

## Parte B — Ferramentas e tecnologias

### 9. Qual é a diferença entre Java e Spring Boot?
Java é linguagem/plataforma; Spring Boot é framework que organiza inicialização, APIs, dependências e integração com bibliotecas.

### 10. O que React faz?
Renderiza interface a partir de componentes JSX e gerencia eventos/estados no navegador; não acessa MariaDB diretamente.

### 11. O que é Vite?
Servidor de desenvolvimento e ferramenta de build do frontend. Na configuração enviada a porta padrão é 8443, embora 5173 também possa ser usada.

### 12. Para que servem Node.js e npm?
Node executa as ferramentas JavaScript fora do navegador; npm instala as dependências e executa scripts do `package.json`.

### 13. O que o Maven faz?
Gerencia dependências e build do backend conforme `pom.xml`, podendo iniciar Spring Boot e gerar o JAR.

### 14. O que JPA e Hibernate fazem?
JPA define API/especificação de persistência; Hibernate implementa ORM que traduz operações de entidades para interações com banco.

### 15. Para que serve o driver MariaDB JDBC?
É a peça de runtime que permite a comunicação de banco do Java para o serviço MariaDB.

### 16. O XAMPP é o banco?
Não. O serviço MariaDB/MySQL é o banco; XAMPP é pacote para disponibilizar serviços locais; phpMyAdmin é interface de administração.

### 17. Para que serve Tailwind?
Classes CSS utilitárias para layout, espaçamento, cores e responsividade.

### 18. Por que Lucide e Recharts?
Lucide fornece ícones; Recharts fornece gráficos, principalmente usados em páginas de visão geral com mocks.

## Parte C — Arquitetura e fluxo

### 19. O que acontece ao clicar Salvar em Contas Pagar?
`ContasPagar.jsx` valida entrada básica → `contasPagarService.js` monta payload → `api.js` faz POST JSON → `ContaPagarController` recebe `@Valid ContaPagarRequest` → `ContaPagarService` cria via `CriadorContaPagar`, preenche e salva por `ContaPagarRepository` → resposta 201 → frontend recarrega lista.

### 20. Qual é a primeira classe Java a receber a chamada de negócio web?
`ContaPagarController`, acionado pelo Spring MVC conforme rota e verbo HTTP.

### 21. Qual a diferença entre Controller e Service?
Controller trata contrato HTTP; Service executa regras de negócio e coordena persistência/padrões.

### 22. Qual a diferença entre Service JS e Service Java?
JS mapeia dados e chama API; Java implementa regras e usa Repositories/padrões.

### 23. O que é DTO?
Objeto de transporte que define dados aceitos pela API e restrições como `@NotBlank`/`@DecimalMin`; geralmente os `*Request.java`.

### 24. O que é Entity?
Classe anotada com `@Entity` e mapeada a tabela; por exemplo `ContaPagar` ↔ `contas_pagar`.

### 25. O que faz `JpaRepository<ContaPagar, Long>`?
Provê operações de banco para `ContaPagar` identificada por ID `Long`, sem escrever todo CRUD manualmente.

### 26. O que é injeção de dependências?
O Spring cria objetos colaboradores e os fornece a classes como Services pelos construtores, em vez de cada Service instanciar tudo diretamente.

### 27. Qual a diferença entre GET `/contas-pagar` e GET `/api/contas-pagar`?
O primeiro é URL de página React; o segundo é endpoint da API Java.

### 28. Para que serve `useEffect`?
Permite efeito no ciclo do componente, como carregar dados reais ao abrir página; com `[]` no código estudado é usado no carregamento inicial.

### 29. O que faz `useState`?
Guarda estado local (lista, formulário, modal, carregando), e seu setter desencadeia atualização visual.

### 30. O que faz `fetch()`?
Realiza uma requisição HTTP pelo navegador e retorna uma Promise de resposta.

### 31. Onde os dados são serializados para JSON?
No frontend, `JSON.stringify` em `api.js`; no backend, a infraestrutura Spring/Jackson desserializa/serializa JSON.

### 32. O que diferencia `map` e `payload` nos services JS?
`map` adapta resposta da API ao formato de tela; `payload` adapta formulário ao DTO aceito no backend.

## Parte D — HTTP, validações e banco

### 33. Diferença entre POST, PUT, PATCH e DELETE?
POST cria/dispara ação, PUT atualiza cadastro, PATCH altera parcela específica, DELETE remove recurso quando permitido.

### 34. Que significa 201 e 204?
201 recurso criado; 204 sucesso sem corpo, usado nas exclusões bem-sucedidas.

### 35. Quando há 400, 404 ou 409?
400 dados inválidos; 404 recurso/ID inexistente; 409 conflito por duplicidade ou integridade.

### 36. Por que não basta validar no React?
É possível chamar API diretamente ou alterar solicitações; backend e banco precisam proteger regras.

### 37. O que `@Valid` faz?
Dispara validação das anotações no `Request` durante processamento do corpo recebido.

### 38. Quem transforma falha de DTO em JSON de erro?
`ApiExceptionHandler`, pela anotação `@RestControllerAdvice` e tratamento de `MethodArgumentNotValidException`.

### 39. Onde é checado o e-mail duplicado do usuário?
Em `UsuarioService` com `UsuarioRepository.existsByEmail`/`existsByEmailAndIdNot`, além de UNIQUE no banco.

### 40. Por que BigDecimal e DECIMAL?
Para representar moeda decimal com precisão adequada e arredondamento explícito, evitando imprecisão de binário `double`.

### 41. O que é chave estrangeira?
Coluna que referencia outra tabela, mantendo integridade, como `avisos.produto_origem_id → produtos.id`.

### 42. Por que excluir um produto pode gerar 409?
Se houver aviso vinculado, Service e FK impedem perda de referência histórica.

### 43. O que `ON DELETE SET NULL` significa?
Ao excluir registro referenciado, a FK dependente torna-se nula, sem apagar automaticamente o registro dependente, quando essa é a regra do schema.

### 44. O que `ddl-auto=validate` implica?
O Hibernate verifica mapeamento contra schema existente; não recria automaticamente tabelas.

### 45. O que faz `@Transactional`?
Delimita unidade transacional de operações no banco, favorecendo consistência.

## Parte E — Strategy

### 46. Defina Strategy em uma frase.
Encapsular algoritmos alternativos em implementações intercambiáveis de uma mesma interface, selecionadas pelo contexto.

### 47. Quais são os dois exemplos?
Encargos em Contas Pagar; descontos em Contas Receber.

### 48. Como são escolhidas as concretas?
Os contextos injetam `List<...Strategy>` do Spring, constroem `Map` por `nome` e executam `e.calcular(...)`.

### 49. Onde está o polimorfismo?
A referência interface Strategy recebe uma implementação concreta e chama o mesmo método `calcular` com comportamentos diferentes.

### 50. Fórmula de juros diários?
`valor × percentual × dias / 100`, com duas casas `HALF_UP`; no código é proporcional linear, não composto.

### 51. Diferença para multa percentual?
Multa `valor × percentual / 100` uma vez, sem multiplicar por dias.

### 52. Por que desconto fixo não gera resultado negativo?
`DescontoValorFixoStrategy` limita o desconto ao valor original com `min`.

### 53. Simulação altera a conta no banco?
Não. Service busca original e devolve `ResultadoCalculo`; não chama `save` no método de simulação.

### 54. Por que há SemEncargo/SemDesconto?
Expressam comportamento nulo (ajuste zero) como estratégias concretas válidas, sem necessidade de remover o padrão.

### 55. O parâmetro `estrategiaEncargo` salvo é sempre igual ao código do modal?
Não. Os códigos persistidos e os nomes das estratégias selecionadas na simulação têm conjuntos parcialmente diferentes; o modal não altera cadastro.

## Parte F — Factory Method

### 56. Defina Factory Method.
Criador base declara método de fábrica e subclasses definem a construção de produtos/objetos específicos.

### 57. Quais são os dois exemplos?
Avisos manuais/automáticos e lançamentos financeiros pagar/receber.

### 58. Onde está o Factory Method real do criador de avisos?
`CriadorAviso.fabricar()`, implementado por `CriadorAvisoManual` e `CriadorAvisoAutomatico`.

### 59. Quem preenche dados comuns dos avisos?
`CriadorAviso.criar(DadosAviso)` chama `fabricar()` e preenche campos compartilhados antes de retornar.

### 60. Qual é a diferença entre criar e persistir?
Criar é construir objeto em memória; persistir é salvar por Repository/JPA no banco.

### 61. Quem fabrica contas a pagar e receber?
`CriadorContaPagar` e `CriadorContaReceber`, subclasses de `CriadorLancamentoFinanceiro`.

### 62. O que significa `LancamentoFinanceiro.entidade()` retornar `Object`?
Produto abstrato genérico que retorna a entidade; o Service precisa fazer cast para `ContaPagar` ou `ContaReceber`.

### 63. Factory Method é o mesmo que Strategy?
Não. Factory escolhe como/qual objeto criar; Strategy escolhe qual algoritmo executar.

## Parte G — Observer

### 64. Defina Observer.
Sujeito comunica um evento a observadores inscritos por contrato; observadores reagem sem o sujeito conhecer sua lógica específica.

### 65. Qual o sujeito do alerta de estoque?
`SujeitoProduto`; `ProdutoService` publica `EventoProduto` e `ObservadorEstoqueBaixo` reage.

### 66. Quando estoque gera aviso?
Produto ativo e `quantidadeEstoque.compareTo(quantidadeMinima) <= 0`, isto é, igual ou inferior ao mínimo.

### 67. Qual o sujeito de vencimento?
`SujeitoVencimento`; `VerificadorVencimentosService` publica `EventoVencimento`, notificado a `ObservadorVencimentoProximo`.

### 68. Quando a verificação encontra contas?
Situação `PENDENTE` ou `VENCIDO`, com data de vencimento entre hoje e hoje+3; vencimentos passados fora da janela não entram.

### 69. O número `contasVerificadas` significa “avisos criados”?
Não. Representa contas consultadas/notificadas; avisos podem ser deduplicados por chave.

### 70. Como se evita gerar alertas iguais várias vezes?
`AvisoService` consulta `existsByChaveEvento`, e a tabela tem UNIQUE em `chave_evento`.

### 71. Observer é assíncrono neste projeto?
Não: os sujeitos iteram lista de observadores e chamam `atualizar` diretamente no processo Spring.

### 72. Que outros padrões participam quando Observer gera um aviso?
Observer recebe evento; `AvisoService` usa Factory Method para fabricar Aviso; Repository/JPA salva.

## Parte H — Segurança, variabilidade e limitações

### 73. Senhas ficam armazenadas em texto puro?
No CRUD de Usuários, senha recebida preenchida é transformada em hash BCrypt por `UsuarioService`; campo hash tem `@JsonIgnore` nas respostas de entidade.

### 74. Isso significa que o login é seguro e funcional?
Não. `Login.jsx` navega para dashboard visualmente; não implementa autenticação com API/controle de acesso real.

### 75. O que é CORS?
Política aplicada pelo navegador para restringir chamadas entre origens diferentes. `CorsConfig` permite localhost 5173/8443; não é autorização de usuário.

### 76. O que é LPS?
Planejar família de variantes de software com ativos comuns e features opcionais sob regras de combinação.

### 77. Qual configuração inválida você explicaria?
PDV ativo com Produtos desativado quando PDV requer Produtos.

### 78. A página Permissões/Módulos já implementa LPS?
Não; é uma tela mockada/local e não configura realmente variantes de produto no backend.

### 79. Qual é a principal limitação do sistema?
É um protótipo acadêmico: só seis CRUDs reais; login, PDV, relatórios e outras telas não são módulos completos. Não é seguro afirmar prontidão para produção.

### 80. Como explicar a autoria sem decorar código?
Abrir a operação no navegador, localizar página/service JS, Controller/DTO, Service, padrão aplicado, Repository/Entity e tabela. Explicar o motivo das decisões e limites observáveis.

## Parte I — Rodada relâmpago: “mostre onde está”

1. `App.jsx`: quais páginas estão associadas às rotas?
2. `ContasPagar.jsx`: onde `useEffect` carrega o array real?
3. `contasPagarService.js`: onde converte `valor` em `valorOriginal`?
4. `api.js`: onde monta URL do backend e faz JSON.stringify?
5. `ContaPagarController`: onde aparece `@PostMapping` e `@Valid`?
6. `ContaPagarService`: onde usa `CriadorContaPagar`?
7. `ContextoEncargo`: onde seleciona implementação no mapa?
8. `JurosDiariosStrategy`: onde entra `dias` na fórmula?
9. `ProdutoService`: onde `sujeito.publicar(new EventoProduto(...))`?
10. `ObservadorEstoqueBaixo`: onde verifica ativo e quantidade mínima?
11. `AvisoService`: onde se monta `ESTOQUE:id` e `VENCIMENTO:id:data`?
12. `AvisoRepository`: onde está `existsByChaveEvento`?
13. `01_schema.sql`: onde estão as FKs com `ON DELETE RESTRICT`?
14. `PasswordConfig`: onde cria o `BCryptPasswordEncoder`?
15. `application.properties`: onde está `ddl-auto=validate`?

## Critério de avaliação em cada resposta

- **0:** não sabe o conceito nem o arquivo.
- **1:** sabe a definição, mas não relaciona ao AMT Solution.
- **2:** explica aplicação com classe e operação reais.
- **3:** explica aplicação, fluxo, justificativa, limite e sabe apontar o trecho no VS Code.

Meta para prova individual: chegar a **3** nos padrões de projeto e nos dois CRUDs do integrante; a pelo menos **2** nos demais módulos.
