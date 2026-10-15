# 19 — Treino guiado: roteiros, tarefas práticas, desafios e apresentações

## 1. Método de estudo ativo

Em vez de apenas ler a apostila: **prever o fluxo → abrir o arquivo → conferir método e nome → explicar o porquê → mostrar efeito no navegador → responder pergunta crítica**. Se conseguir executar essas etapas, estará construindo autoria técnica, não só memorização.

## 2. Exercício A — Navegação no React (15 minutos)

**Objetivo:** compreender como uma URL abre uma tela.

1. Abra `Frontend/src/main.jsx`: encontre o `createRoot` e `<App />`.
2. Abra `Frontend/src/App.jsx`: localize as rotas `/contas-pagar`, `/produtos`, `/avisos`.
3. Abra `Frontend/src/components/layout/AppShell.jsx`: aponte `Sidebar` e `Outlet`.
4. Abra `Sidebar.jsx`: aponte `NavLink` e observe como o endereço navega.
5. Explique por que trocar rota no navegador não muda automaticamente o banco.

**Desafio:** explique em 60 segundos por que `/contas-pagar` não é o mesmo endereço de `/api/contas-pagar`.

## 3. Exercício B — Rastrear POST real de Fornecedores (20 minutos)

1. `Fornecedores.jsx`: localize `salvar` e `fornecedoresService.criar`.
2. `fornecedoresService.js`: compare `cnpj` do formulário e `documento` do payload.
3. `api.js`: mostre onde define URL e `JSON.stringify`.
4. `FornecedorController.java`: encontre POST e `@Valid FornecedorRequest`.
5. `FornecedorRequest.java`: anote campos obrigatórios e validação de e-mail.
6. `FornecedorService.java`: encontre `existsByDocumento`, `preencher` e `repository.save`.
7. `FornecedorRepository.java`: explique como o Spring cria essa consulta.
8. `Fornecedor.java` e `01_schema.sql`: relacione atributos/colunas.
9. Explique o que acontece se o documento já existir.

**Resposta-alvo:** API responde 409 via `ConflictException`/handler e frontend mostra erro sem declarar sucesso.

## 4. Exercício C — Rastrear cadastro de Conta a Pagar com Factory (25 minutos)

Localize e explique, sem pular nenhuma etapa:

`ContasPagar.jsx.salvar` → `contasPagarService.criar` → `api.request` → `ContaPagarController.criar` → `ContaPagarRequest` → `ContaPagarService.criar` → `CriadorContaPagar.criar/fabricar` → `preencher` → `repository.save` → tabela `contas_pagar` → resposta 201 → `carregar`.

**Desafio 1:** qual a diferença entre o `ContaPagar` Entity e o `ContaPagarRequest` record?

**Desafio 2:** como a criação seria feita se não houvesse Factory? O que se perderia em reutilização e separação?

## 5. Exercício D — Strategy pelo navegador + código (20 minutos)

1. No browser, escolha uma conta a pagar com valor original de referência.
2. Clique **Simular** → escolha juros diários → percentual e dias; anote ajuste/total.
3. Sem salvar a conta, escolha multa percentual; anote resultado.
4. Abra `ContextoEncargo.java`: mostre o `Map` e `e.calcular(...)`.
5. Abra as concretas e compare fórmulas.
6. Abra `ContaPagarService.simularEncargos` e confirme que **não** chama `repository.save`.
7. Repita com descontos e compare o sinal da operação (`add` para encargo, `subtract` para desconto).

**Desafio:** explicar para o professor por que os dois cálculos são padrões Strategy diferentes por domínio e não apenas duas opções de UI.

## 6. Exercício E — Factory Method (20 minutos)

Desenhe no papel:

```text
CriadorAviso
  ├─ CriadorAvisoManual
  └─ CriadorAvisoAutomatico

CriadorLancamentoFinanceiro
  ├─ CriadorContaPagar
  └─ CriadorContaReceber
```

Em cada árvore, destaque **qual método é abstrato**, **qual é o método público usado pelo Service**, **qual concreta implementa `fabricar()`**, **qual objeto é produzido** e **onde ocorre a persistência**.

**Desafio:** por que `LancamentoFinanceiro.entidade()` tem um cast no Service? É um ponto fraco de tipagem ou uma dependência de banco?

## 7. Exercício F — Observer ponta a ponta (25 minutos)

1. No browser, use um produto ativo com quantidade igual ou abaixo do mínimo e sem alerta prévio igual, quando disponível.
2. Edite e salve.
3. Encontre o aviso na tela Avisos.
4. No Java, percorra `ProdutoService` → `EventoProduto` → `SujeitoProduto` → `ObservadorEstoqueBaixo` → `AvisoService`.
5. Encontre a chave `ESTOQUE:id` e explique deduplicação.
6. Repita para conta a pagar com vencimento entre hoje e +3, usando o botão `Verificar vencimentos`.
7. Mostre `SujeitoVencimento`, `ObservadorVencimentoProximo` e chave `VENCIMENTO:id:data`.

**Desafio:** se o botão disser que verificou duas contas e aparecer somente um novo aviso, há erro? Explique como a prevenção de duplicidade funciona.

## 8. Exercício G — Banco de dados e FK (15 minutos)

Leia `01_schema.sql` e encontre: `CREATE DATABASE`, `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, `ON DELETE SET NULL`, `ON DELETE RESTRICT`. Explique um exemplo prático para cada um. Identifique a correspondência JPA com `@JoinColumn` nos Models.

**Desafio:** por que ProdutoService recusa DELETE quando há aviso? Quais registros históricos seriam comprometidos?

## 9. Exercício H — Validação em quatro camadas (15 minutos)

Escolha cadastro de usuário. Responda:

- Qual validação básica aparece no React?
- Qual `UsuarioRequest` usa `@Email`, `@NotBlank`, `@Size`?
- Onde o Service impede e-mail duplicado?
- Onde a tabela define `UNIQUE`?
- Onde a senha se torna BCrypt?
- Como o JSON evita expor `senhaHash`?
- O Login realmente usa senha informada para chamar backend?

**Desafio:** diferenciar armazenamento de senha com hash de autenticação e autorização de endpoints.

## 10. Exercício I — Defesa de escopo (10 minutos)

O professor aponta uma venda concluída no PDV e pergunta em qual tabela foi gravada. Responda corretamente: a versão analisada **não** implementa o CRUD real de vendas; PDV usa mocks/estado de interface. Mostre os seis módulos efetivos e a autorização de implementação parcial.

**Desafio:** explicar por que o Dashboard também não é um relatório financeiro confiável do banco real nesta versão.

## 11. Exercício J — Decisões e alternativas (20 minutos)

Responder cada escolha com **motivo, benefício, custo e limitação**:

1. React separado do backend.
2. Spring Boot vs apenas Java puro com SQL manual.
3. JPA/Repository.
4. Uma tabela Produtos/Insumos.
5. BigDecimal no financeiro.
6. Classes de Strategy em vez de `switch` de fórmulas.
7. Factory Method no cadastro.
8. Observer nos alertas.
9. Evitar duplicidade por `chaveEvento`.
10. Planejamento LPS sem implementação completa.

## 12. Sessão de treino de autoria — divisão por integrantes

### Integrante 1 (Produtos + Fornecedores)

**Demonstração principal:** CRUD Produtos e Fornecedores, separação produto/insumo, código único, documento único, ativação e exclusão, Observer de estoque. **Perguntas extras obrigatórias:** reconhecer Strategy e Factory Method com os fluxos financeiros e de avisos.

### Integrante 2 (Contas a Pagar + Contas a Receber)

**Demonstração principal:** registros financeiros, criação via Factory, Strategy de encargos/descontos, PATCH situação, Observer de vencimento, `BigDecimal`. **Perguntas extras:** saber mostrar Produto/Fornecedor e Aviso.

### Integrante 3 (Usuários + Avisos)

**Demonstração principal:** cadastro e hash BCrypt; aviso manual/automático por Factory; vínculo de Observer; arquivamento e exclusão; `chaveEvento`. **Perguntas extras:** saber por que login é protótipo e apresentar simulações Strategy.

**Regra de equipe:** cada um domina seus dois CRUDs, mas todos conseguem narrar os seis exemplos dos padrões.

## 13. Roteiro de apresentação de 8–12 minutos

| Tempo aproximado | Conteúdo |
|---|---|
| 0:00–1:00 | Visão geral, problema e escopo parcial |
| 1:00–2:00 | Tecnologias e desenho em camadas |
| 2:00–3:30 | Demonstrar um CRUD e fluxo até banco |
| 3:30–5:00 | Strategy: simulação encargo e desconto |
| 5:00–6:30 | Factory: aviso manual e lançamento financeiro |
| 6:30–8:00 | Observer: estoque e vencimento → aviso |
| 8:00–9:00 | Banco, validações, integridade e BCrypt |
| 9:00–10:00 | Variabilidade planejada; duas configurações |
| 10:00–12:00 | Perguntas, decisões e limites do protótipo |

O cronograma é sugestão de estudo: adequar ao tempo permitido pelo professor e aos dados disponíveis para a demonstração.

## 14. Rubrica de avaliação de cada integrante

Marque cada critério como **não sabe / explica / explica e mostra no código**:

- Consegue desenhar a arquitetura React → Spring → JPA → MariaDB.
- Sabe localizar os dois CRUDs do seu grupo.
- Explica GET/POST/PUT/PATCH/DELETE e status 201/204/400/404/409.
- Mostra validações do DTO e Service.
- Identifica onde cada padrão entra no fluxo real.
- Calcula manualmente exemplos simples de juros/multa/desconto.
- Explica `chaveEvento` e Observer.
- Diferencia mock de implementação real.
- Comenta decisões e limitações sem esconder problemas.
- Explica o Feature Model e configurações válidas/inválidas.

Se qualquer item estiver em “não sabe”, voltar ao capítulo correspondente.

## 15. Checklist de véspera

1. Não alterar a versão final do código para estudar.
2. Confirmar cópia de segurança/Git.
3. Abrir os capítulos 00–03 para visão macro.
4. Dominar seus dois CRUDs com capítulo 08.
5. Revisar diagramas dos capítulos 09–11.
6. Praticar a rodada relâmpago do capítulo 16.
7. Preparar registros demonstráveis sem destruir dados.
8. Saber dizer quais páginas são mocks.
9. Ler o arquivo real de variabilidade da entrega, se disponível fora dos ZIPs.
10. Simular questões com os três colegas alternando o professor.
