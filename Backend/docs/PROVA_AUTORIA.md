# Prova de autoria — roteiro AMT Solution

## Como iniciar a demonstração

```powershell
# Terminal Backend (MariaDB/XAMPP deve estar ativo)
mvn spring-boot:run

# Terminal Frontend
npm run dev
```

API: `http://localhost:8080/api`. Frontend: URL mostrada pelo Vite, normalmente `http://localhost:5173`.

Não use IDs fixos na apresentação: primeiro liste o recurso e copie um ID existente. Para criar dados, use prefixos como `DEMO-07-AAAAMMDDHHMM` e preserve referências de avisos automáticos.

## Integrante 1 — Produtos e Fornecedores

**Demonstração:** abra Produtos, cadastre/edite um item; abra Fornecedores e relacione um fornecedor. Para Observer, crie ou atualize um produto ativo com `quantidadeEstoque <= quantidadeMinima`, então consulte Avisos.

**Explique:** `ProdutoController` recebe HTTP e chama `ProdutoService`; o service usa `ProdutoRepository` e, depois de salvar, publica `EventoProduto` em `SujeitoProduto`. `ObservadorEstoqueBaixo` não é conhecido diretamente pelo service: ele recebe o evento e usa `AvisoService`. `Fornecedor` é uma relação opcional de `Produto`.

**HTTP útil:**

```powershell
Invoke-RestMethod http://localhost:8080/api/produtos
Invoke-RestMethod http://localhost:8080/api/avisos
```

## Integrante 2 — Contas a Pagar e Receber

**Demonstração:** cadastre uma conta de cada tipo, altere a situação para PAGO/RECEBIDO e faça uma simulação sem persistir. Para vencimento, cadastre conta PENDENTE com data entre hoje e três dias e execute a verificação.

**Explique:** valores usam `BigDecimal`; `ContextoEncargo` e `ContextoDesconto` recebem implementações de interface e aplicam polimorfismo. `CriadorContaPagar` e `CriadorContaReceber` são usados pelos services nos cadastros. `VerificadorVencimentosService` publica evento apenas para conta PENDENTE/VENCIDO no intervalo.

```powershell
Invoke-RestMethod 'http://localhost:8080/api/contas-pagar/{id}/simulacao-encargos?estrategia=JUROS_DIARIOS&percentual=2&dias=3'
Invoke-RestMethod 'http://localhost:8080/api/contas-receber/{id}/simulacao-descontos?estrategia=VALOR_FIXO&parametro=10&dias=0'
Invoke-RestMethod -Method Post http://localhost:8080/api/contas-pagar/verificar-vencimentos
```

## Integrante 3 — Usuários e Avisos

**Demonstração:** crie/edite/desative usuário e crie/edite/arquive aviso. Consulte avisos automáticos gerados pelos exemplos dos colegas.

**Explique:** `Usuario.senhaHash` não é exposto; `PasswordConfig` fornece BCrypt e `UsuarioService` só grava hash. `AvisoService.criar` utiliza `CriadorAvisoManual`; os observers usam `CriadorAvisoAutomatico`. `chaveEvento` evita duplicidade e as FKs preservam a origem do aviso.

## Os três padrões em uma frase

- **Strategy:** troca o algoritmo de encargo/desconto por implementações da mesma interface.
- **Factory Method:** uma classe criadora abstrata delega à subclasse qual objeto concreto criar.
- **Observer:** um sujeito publica evento; observador interessado reage sem o sujeito depender da regra concreta.

## Perguntas e respostas objetivas

1. **O que é padrão de projeto?** Solução reutilizável para um problema recorrente de design; aqui estão em `patterns/strategy`, `factory` e `observer`.
2. **Qual problema Strategy resolve?** Varia cálculos sem condicional concentrada; veja `ContextoEncargo` e `ContextoDesconto`.
3. **Como há polimorfismo?** O contexto chama a interface `CalculoEncargoStrategy`/`CalculoDescontoStrategy`, independentemente da classe concreta.
4. **Strategy x Factory Method?** Strategy escolhe comportamento; Factory Method escolhe qual objeto concreto criar.
5. **O que é Factory Method?** Método abstrato sobrescrito por criadores concretos, como `CriadorAviso.fabricar`.
6. **Por que não instanciar direto?** O service usa o criador e não precisa conhecer a classe concreta de lançamento/aviso.
7. **Como Observer funciona?** `SujeitoProduto.publicar` chama observadores registrados, que recebem `EventoProduto`.
8. **O que são sujeito e observador?** Sujeito publica eventos; observador implementa a reação, por exemplo `ObservadorEstoqueBaixo`.
9. **Onde Observer é chamado?** Em `ProdutoService.criar/atualizar` e em `VerificadorVencimentosService.verificar`.
10. **Por que interfaces?** Permitem polimorfismo e baixo acoplamento, especialmente nas Strategies e Observers.
11. **Função do Controller?** Expor rota HTTP e delegar ao service; ex.: `ContaPagarController`.
12. **Função do Service?** Reunir regra de negócio e transação; ex.: `AvisoService`.
13. **Função do Repository?** Persistência JPA; ex.: `ProdutoRepository`.
14. **O que é entidade JPA?** Classe mapeada para tabela, como `ContaReceber` para `contas_receber`.
15. **O que é CRUD?** Create, Read, Update e Delete; nos controllers são POST, GET, PUT e DELETE.
16. **Como React fala com Java?** Serviços em `Frontend/src/services` usam `fetch` para `/api`; controllers retornam JSON.
17. **Como os dados chegam ao MySQL?** Controller → Service → `JpaRepository` → JPA/MariaDB.
18. **Como funciona exclusão lógica?** `ProdutoService.desativar`, e equivalentes, definem `ativo=false`; contas e avisos são físicos.
19. **O que é variabilidade?** Seleção planejada de módulos de uma variante da LPS.
20. **Variabilidade x permissões?** Variabilidade define módulos da configuração; permissão define ações de usuário no módulo ativo.
21. **Como explicar Feature Model?** Ele mostra base comum, módulos opcionais e dependências como PDV → Produtos em `VARIABILIDADE_LPS.md`.
22. **Como demonstrar reuso?** As variantes Loja de Doces e Prestador de Serviços compartilham a mesma base, CRUDs e padrões sem sistemas duplicados.

## Sequência curta de apresentação

1. Mostre a arquitetura React + Spring Boot + MariaDB e as seis tabelas.
2. Cada integrante demonstra um CRUD de sua dupla de telas.
3. Execute uma URL Strategy de cada conta e explique que é simulação.
4. Mostre cadastro de aviso manual e um aviso automático na tabela de Avisos.
5. Mostre `POST /api/contas-pagar/verificar-vencimentos` e a chave de evento sem duplicidade.
6. Abra `PADROES_DE_PROJETO.md` para os diagramas e `VARIABILIDADE_LPS.md` para Feature Model e variantes.
7. Declare limites reais: telas mockadas, login sem autenticação completa e variabilidade apenas planejada.
