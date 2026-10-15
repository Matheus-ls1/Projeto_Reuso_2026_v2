# AMT Solution — Guia completo para a prova de autoria

> **Edição de estudo baseada no código-fonte enviado em `Frontend.zip` e `Backend.zip` em 14/10/2026.** Este material **não modifica o projeto** e procura distinguir rigorosamente **o que está implementado**, **o que é conhecimento teórico** e **o que é uma sugestão para a apresentação**.

## Como utilizar este material

Esta apostila foi organizada em progressão: primeiro *o que é o sistema e por quê*, depois *quais tecnologias o constroem*, *como os dados trafegam*, *como funcionam os CRUDs*, *como os padrões são aplicados*, e por fim *como defendê-los numa prova de autoria*.

**Ordem recomendada de leitura:**

1. [01 — Contexto, objetivos, requisitos e escopo](01_CONTEXTO_E_ESCOPO.md)
2. [02 — Tecnologias, ferramentas, bibliotecas e comandos](02_FERRAMENTAS_E_BIBLIOTECAS.md)
3. [03 — Arquitetura e fluxo ponta a ponta](03_ARQUITETURA_E_FLUXOS.md)
4. [04 — React, JSX, estados, eventos e navegação](04_FRONTEND_REACT.md)
5. [05 — HTTP, REST, JSON e serviços JavaScript](05_API_HTTP_E_INTEGRACAO.md)
6. [06 — Java, orientação a objetos e Spring Boot](06_BACKEND_JAVA_SPRING.md)
7. [07 — Banco de dados, SQL, JPA e validação](07_BANCO_DADOS_JPA.md)
8. [08 — Os seis CRUDs explicados](08_CRUDS_PONTA_A_PONTA.md)
9. [09 — Strategy: teoria e implementação real](09_PADRAO_STRATEGY.md)
10. [10 — Factory Method: teoria e implementação real](10_PADRAO_FACTORY_METHOD.md)
11. [11 — Observer: teoria e implementação real](11_PADRAO_OBSERVER.md)
12. [12 — Validações, segurança, erros e integridade](12_VALIDACOES_ERROS_SEGURANCA.md)
13. [13 — Variabilidade e linha de produtos de software](13_VARIABILIDADE_LPS.md)
14. [14 — Execução, demonstração pelo navegador e diagnóstico](14_EXECUCAO_E_DEMONSTRACAO.md)
15. [15 — Decisões de arquitetura, vantagens e limitações](15_DECISOES_E_LIMITACOES.md)
16. [16 — Banco de perguntas e respostas para a prova](16_SIMULADO_DE_AUTORIA.md)
17. [17 — Glossário técnico de consulta rápida](17_GLOSSARIO.md)
18. [18 — Catálogo dos arquivos e classes do projeto](18_CATALOGO_CODIGO.md)
19. [19 — Exercícios práticos, roteiros e avaliação](19_EXERCICIOS_E_ROTEIROS.md)
20. [20 — Dicionário detalhado de entidades, DTOs e métodos](20_DICIONARIO_ENTIDADES_DTO_METODOS.md)
21. [21 — Componentes UI reutilizáveis e páginas mockadas](21_COMPONENTES_UI_E_MOCKS.md)

## Os cinco conceitos indispensáveis

**Interface não é banco:** a interface React dispara uma requisição HTTP; o backend Spring Boot processa; JPA/Hibernate acessa o banco MariaDB; a resposta volta em JSON.

**Uma tela CRUD real não é um mock:** os seis módulos selecionados utilizam serviços HTTP e persistência. Dashboard, PDV, Caixa, Estoque, Pedidos de Compra, Relatórios, Visão Financeira, Login e Permissões/Módulos têm comportamento parcial ou mockado e não devem ser descritos como módulos completos.

**Controller não deveria concentrar regra de negócio:** Controllers recebem requisições; Services orquestram regras; Repositories acessam a persistência; DTOs validam entradas; Entities representam dados persistidos.

**Padrão de projeto não é apenas nome de pasta:** Strategy é usado para intercambiar cálculos; Factory Method delega a criação de objetos; Observer notifica interessados em eventos. Há dois **contextos de aplicação** de cada um.

**Demonstração visual e comprovação pelo código são complementares:** ver um aviso na tela prova um efeito; abrir as classes Sujeito/Observer/Service comprova a arquitetura que produziu o efeito.

## Alcance e limites das fontes

- Fontes verificadas: `Frontend/src`, `Frontend/database/{01_schema.sql,02_seed.sql}`, `Frontend/package.json`, `Frontend/vite.config.js`, `Frontend/.env.example`, `Backend/src/main`, `Backend/pom.xml` e `Backend/src/main/resources/application.properties`.
- **Não havia arquivo `VARIABILIDADE_LPS.md` nem README acadêmico nos dois ZIPs fornecidos**. O capítulo 13 explica os conceitos de LPS e usa o planejamento anteriormente discutido como **exemplo de estudo, não como transcrição literal do documento final**. Se essa documentação estiver fora dos ZIPs, compare-a antes da entrega.
- Este guia é uma leitura estática dos arquivos e inclui relatos de testes anteriores do grupo; **não substitui a execução no computador dos integrantes**, especialmente em pontos que dependem de configuração local e registros existentes.
- Códigos mostrados no guia são trechos didáticos ou recortes identificados; não devem ser copiados automaticamente para o sistema.

## Orientação para estudar em equipe

**Primeira passagem:** cada colega lê capítulos 01–08 e descreve em voz alta como uma conta a pagar é cadastrada. **Segunda passagem:** capítulos 09–13, com cada padrão explicado usando os nomes reais das classes. **Terceira passagem:** capítulos 14–19, revezando quem faz o papel de professor. Cada integrante deve conhecer seu par de CRUDs e ser capaz de explicar os três padrões, ainda que não os tenha implementado diretamente.

## Mapa compacto para memorizar

```text
Navegador
  └─ Frontend/src/pages/ContasPagar.jsx
       └─ Frontend/src/services/contasPagarService.js
            └─ Frontend/src/services/api.js → fetch + JSON
                 └─ POST /api/contas-pagar
                      └─ ContaPagarController
                           └─ @Valid ContaPagarRequest
                                └─ ContaPagarService
                                     ├─ CriadorContaPagar (Factory Method)
                                     └─ ContaPagarRepository (Spring Data JPA)
                                          └─ MariaDB: contas_pagar
```

**Faça a pergunta-guia em todo tópico:** *Quem chama? O que recebe? Quem valida? Que regra executa? Onde persiste? O que devolve? Como eu mostro isso?*
