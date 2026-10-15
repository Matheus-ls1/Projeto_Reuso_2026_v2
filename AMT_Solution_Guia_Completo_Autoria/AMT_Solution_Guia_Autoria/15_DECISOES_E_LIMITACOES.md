# 15 — Decisões de arquitetura, justificativas, trade-offs e limites do protótipo

## 1. O que significa “decisão arquitetural”?

Não é apenas dizer “usamos Spring Boot”; é responder **por que uma alternativa foi escolhida e qual consequência ela traz**. Uma resposta de autoria madura reconhece benefícios e limitações, sem afirmar que a solução é perfeita.

## 2. React separado de Java Spring Boot

**Decisão:** UI com React/Vite e regras/persistência com API Java Spring Boot. **Benefícios:** responsabilidades claras, reutilização da API, frontend independente da modelagem SQL, possibilidade de evoluir interface e servidor separadamente. **Custo:** configurar dois processos, CORS e contratos HTTP; erros de rede são possíveis.

**Alternativa plausível:** renderização de HTML por backend monolítico. **Por que não foi escolhida:** o trabalho partiu de layout/protótipo React e exigiu integração real de alguns módulos com Java.

## 3. Arquitetura em camadas

**Controller** coordena HTTP; **DTO** delimita dados de entrada e valida; **Service** aplica regras e orquestra padrões; **Repository** opera persistência; **Entity** representa o domínio mapeado ao banco.

**Benefício:** legibilidade, teste e manutenção; **custo:** mais arquivos e algum código de encaminhamento. Isso é complexidade justificável, não apenas “classes a mais”.

## 4. Spring Data JPA em vez de SQL manual para todo CRUD

**Benefício:** CRUD comum disponível via `JpaRepository`, consultas derivadas como `existsByEmail`, integração ORM e transações. **Trade-off:** precisa compreender mapeamento JPA, ciclo de vida e SQL gerado; nem toda consulta complexa fica trivial. **Decisão acadêmica:** apropriada para as seis entidades e relações simples.

## 5. `ddl-auto=validate` e schema controlado por SQL

**Benefício:** preserva controle explícito da estrutura relacional e evita que startup modifique tabelas automaticamente. **Custo:** alguém deve criar/importar script e manter mapeamento e banco coerentes. **Não dizer:** “o Hibernate constrói o banco toda vez”.

## 6. Uma tabela para Produtos e Insumos

**Decisão:** `produtos.tipo` diferencia `PRODUTO` e `INSUMO`. **Benefícios:** reuso do CRUD, API, entidade e validações comuns. **Trade-off:** campos específicos de um tipo podem ser nulos para o outro (ex.: `precoVenda` de insumos). **Motivo acadêmico:** reduz escopo mantendo comportamento relevante e demonstrável.

## 7. `BigDecimal` no financeiro

**Benefício:** precisão decimal e arredondamento configurado. **Custo:** sintaxe mais verbosa (`multiply`, `divide`, `compareTo`, `min`), em vez de operadores aritméticos primitivos. **Exemplo:** `420 × 2 × 3 / 100 = 25,20` para juros diários no exemplo de estudo.

## 8. Strategy em duas operações de simulação

**Decisão:** encapsular algoritmos de encargos/descontos em implementações separadas, selecionadas por `ContextoEncargo` e `ContextoDesconto`. **Benefício:** acrescentar novos tipos de cálculo sem editar um bloco gigante de condicionais; comportamento testável e compreensível. **Custo:** interfaces/contextos/implementações adicionais. **Escopo:** é simulação por GET; não há persistência do resultado simulado.

**Decisão de manter `SemEncargoStrategy`/`SemDescontoStrategy`:** comportamento neutro expresso como implementação válida; não é preciso apagar só porque é classe pequena.

## 9. Factory Method em avisos e lançamentos

**Benefício:** separar criação especializada e procedimento comum; Services não montam diretamente todos os detalhes de fábrica. **Custo:** abstrações extras; no exemplo financeiro o retorno de `Object entidade()` exige cast, uma concessão de simplicidade acadêmica que deve ser reconhecida.

**Limite:** fábrica não substitui Repository nem transação; criar objeto em memória não significa persistir.

## 10. Observer em estoque e vencimento

**Benefício:** produtor de eventos separado do consumidor; criação de aviso acontece como reação a evento e ainda reaproveita Factory Method. **Custo:** rastrear fluxo de várias classes exige disciplina; publicação é síncrona, logo uma falha do observador pode repercutir na operação transacional conforme o contexto.

**Decisão de criar evento de estoque ao salvar:** integração a CRUD real, não a tela mockada Estoque. **Decisão de verificar vencimento sob demanda:** botão permite demonstração e evita infraestrutura de agendamento fora do escopo. **Custo:** sem o botão/algum acionador externo, não há processo automático diário demonstrado no código.

## 11. Duplicidade e histórico

**Decisão:** `chave_evento` identifica um evento e evita gerar avisos repetidos. **Benefício:** idempotência e proteção do histórico. **Trade-off:** se o mesmo produto continuar abaixo do mínimo, não gera um novo aviso para o mesmo ID automaticamente. Isso deve ser explicado como resultado da chave `ESTOQUE:id`, não como garantia de que o alerta será reemitido diariamente.

## 12. Exclusão física separada de status

**Decisão:** `DELETE` remove, `PATCH /ativo` desativa, `PUT` pode arquivar aviso. **Benefício:** comandos com semânticas claras. **Custo:** tratar FKs e avisar ao usuário quando não é possível excluir registros com dependências.

**Proteção consciente:** avisos associados impedem DELETE de Produto/ContaPagar. Fornecedor relacionado pode ser excluído com FK `SET NULL`, preservando itens mas retirando vínculo.

## 13. Persistência parcial versus sistema completo

**Decisão:** seis CRUDs reais; restantes páginas mockadas. **Benefício:** foco nos requisitos acadêmicos, menor tempo e complexidade. **Limitação:** Dashboard/Relatórios podem apresentar números sem correspondência aos registros reais; PDV pode simular venda sem gravação. É incorreto vender o protótipo como ERP comercial pronto.

## 14. Usuários, BCrypt e autenticação

**Decisão:** senha recebida pode ser transformada em hash BCrypt antes de persistir. **Benefício:** não guardar senha em texto claro no banco. **Limitação:** o `Login.jsx` é navegação visual; não há autenticação de ponta a ponta baseada em credenciais e autorização efetiva dos endpoints nesta versão. **Não confundir:** status ativo/perfil administrativo com controle de acesso aplicado no servidor.

## 15. Variabilidade planejada, não executada

**Decisão:** modelar features obrigatórias/opcionais e regras de combinação para futuras variantes, sem implementar mecanismo completo de feature flags. **Benefício:** atende ao caráter conceitual do requisito; **limitação:** página Permissões/Módulos mockada não constitui configurador LPS real.

## 16. Figma e ferramentas de build

**Decisão:** preservar layout vindo do protótipo Figma com CSS utilitário e componentes JSX; Vite tem plugins adicionais relacionados ao ambiente Figma. **Benefício:** fidelidade visual e rapidez de prototipação. **Trade-off:** configuração de Vite mais longa, não toda escrita à mão para as regras de negócio.

## 17. Perguntas provocativas do professor

**“Por que seu projeto tem tantas classes?”** Porque separa camadas e concretiza padrões que precisam de contrato/contexto/implementações; a quantidade não foi criada artificialmente para alcançar dez.

**“Por que não fez tudo no React?”** Regras e persistência devem estar no servidor, para não depender de cliente manipulável.

**“Isso não está exagerado para uma faculdade?”** O escopo foi intencionalmente limitado a seis CRUDs; a complexidade adicional está concentrada nos três padrões exigidos.

**“Qual arquitetura você mudaria num produto real?”** Acrescentaria autenticação/autorização, testes de regressão, melhorias de observabilidade, migrações versionadas e tratamento de casos comerciais mais amplos — sem dizer que esses itens já existem.

**“Algum lugar tem simplificação excessiva?”** O método financeiro `Object entidade()` requer cast; módulo de login é mock; verificador não é scheduler; conversão de números JS supõe formatos específicos. Reconhecer limitações mostra domínio do projeto.
