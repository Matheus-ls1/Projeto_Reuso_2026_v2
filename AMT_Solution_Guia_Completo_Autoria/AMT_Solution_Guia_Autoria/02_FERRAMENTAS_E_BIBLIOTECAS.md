# 02 — Ferramentas, bibliotecas, frameworks e responsabilidades

## 1. Quatro categorias que não devem ser confundidas

- **Linguagem:** Java no backend; JavaScript e JSX no frontend; SQL para banco; CSS para estilos.
- **Framework/biblioteca:** Spring Boot, React, Spring Data JPA, Hibernate, React Router, Tailwind, Lucide, Recharts.
- **Ferramenta de execução/build:** Java/JDK, Maven, Node.js, npm, Vite.
- **Serviço de infraestrutura:** MariaDB/MySQL como SGBD; XAMPP como ambiente que disponibiliza MariaDB localmente; VS Code como editor; Git como controle de versão.

**Uma biblioteca** é código reutilizável chamado pela aplicação. **Um framework** oferece uma estrutura e frequentemente controla o ciclo de vida/fluxo da aplicação. A fronteira pode ser contextual: React costuma ser classificado como biblioteca de UI, enquanto Spring Boot é framework.

## 2. Backend — componentes comprovados no `Backend/pom.xml`

| Item | Uso no projeto | Como explicar |
|---|---|---|
| JDK/Java 17 | Compilação e classes do backend | Linguagem tipada, orientada a objetos, com `class`, `interface`, `record`, `BigDecimal` |
| Spring Boot **3.5.0** | Inicialização, configuração e injeção | Organiza aplicação web Java e autoconfigura dependências |
| `spring-boot-starter-web` | `@RestController`, mapeamento HTTP e serialização JSON | Cria endpoints REST |
| `spring-boot-starter-data-jpa` | `JpaRepository`, ORM | Evita escrever SQL básico para cada cadastro |
| `spring-boot-starter-validation` | `@Valid`, `@NotBlank`, `@DecimalMin` etc. | Validação declarativa do corpo das requisições |
| `mariadb-java-client` | Driver JDBC de runtime | Faz a comunicação de baixo nível entre Java e MariaDB |
| `spring-security-crypto` | `PasswordEncoder`/`BCryptPasswordEncoder` | Hash de senhas cadastradas; **não** implementa login completo |
| Maven | `pom.xml`, resolução de dependências, empacotamento | Produz o artefato `.jar` e executa comandos de build |

**JPA ≠ Hibernate ≠ JDBC:** JPA é especificação/API de persistência; Hibernate é implementação ORM utilizada pelo Spring Data JPA; JDBC é a API de acesso a bancos por drivers. O driver MariaDB realiza a conexão. Spring Data abstrai operações de repositório.

**Java 17 no `pom.xml`** é o alvo de compilação; ter um JDK mais novo instalado localmente não muda a versão-alvo declarada.

## 3. Frontend — itens reais do `Frontend/package.json`

| Item | Versão declarada | Uso |
|---|---|---|
| `react` | `^19.0.0` | Componentes e estado da interface |
| `react-dom` | `^19.0.0` | Montagem dos componentes no DOM do navegador |
| `react-router-dom` | `^7.18.2` | `BrowserRouter`, `Routes`, `Route`, `Navigate`, `NavLink`, `Outlet` |
| `lucide-react` | `^1.32.0` | Ícones JSX como `Trash2`, `Plus`, `Bell` |
| `recharts` | `^3.10.1` | Gráficos em páginas como Dashboard e Financeiro |
| `vite` | `^8.0.0` | Servidor local, build, hot reload |
| `@vitejs/plugin-react` | `^6.0.0` | Integração do React com Vite |
| `tailwindcss` e `@tailwindcss/vite` | `^4.0.0` | Classes utilitárias CSS e integração ao build |
| `oxfmt` | `^0.2.0` | Formatador opcional (`npm run format`) |

O sinal `^` em dependências npm permite versões compatíveis dentro da mesma faixa principal em condições normais; para reproduzir exatamente versões resolvidas, o projeto inclui `package-lock.json`.

## 4. Node, npm, Vite, React: como se relacionam?

- **Node.js** executa as ferramentas JavaScript fora do navegador.
- **npm** gerencia e instala pacotes descritos em `package.json`.
- **Vite** serve módulos durante o desenvolvimento e cria um build otimizado (`dist/`).
- **React** executa no navegador após carregar o bundle e renderiza a interface.
- `npm install` reinstala `node_modules/`; `npm run dev` inicia Vite; `npm run build` verifica/gera a versão distribuível.

A remoção de `node_modules` não significa remoção do React ou Vite do projeto: a pasta é recriável a partir dos arquivos de dependência, desde que haja Node/npm e acesso aos pacotes.

## 5. Ferramentas de desenvolvimento e ambiente

| Ferramenta | Responsabilidade | Atenção |
|---|---|---|
| VS Code | Editar código, extensões, terminal e depuração | Editor não é parte obrigatória da aplicação em execução |
| Git | Histórico de versões e comparação | Não confundir commit com deploy |
| GitHub | Hospedagem remota do repositório | Não executa automaticamente a aplicação local |
| XAMPP | Ambiente local que disponibiliza MariaDB e phpMyAdmin | **Tomcat do XAMPP não precisa iniciar**; pode disputar a porta 8080 |
| phpMyAdmin | Interface web para consultar o banco | É uma ferramenta administrativa, não banco de dados |
| MariaDB | Serviço de banco relacional | Normalmente porta 3306 |
| Maven | Build/execução do backend | O comando `mvn` exige Maven disponível no PATH ou wrapper |

## 6. Bibliotecas versus padrões de projeto

Strategy, Factory Method e Observer **não são dependências extras no `pom.xml`**: são estruturas arquiteturais implementadas em classes Java do próprio projeto. Spring também emprega inversão de controle e injeção de dependência, mas isso não substitui os três padrões exigidos na atividade.

## 7. Por que foram escolhidas essas tecnologias?

**React** simplifica a construção da interface reutilizável; **Vite** facilita desenvolvimento e build; **Spring Boot** estrutura a API e integra validações e injeção; **Spring Data JPA** reduz repetição no acesso ao banco; **MariaDB** oferece persistência relacional com chaves e integridade; **Java** permite demonstrar OOP e padrões por interfaces, implementações e polimorfismo; **BigDecimal** evita problemas de precisão binária em cálculos monetários.

## 8. Coisas que vocês NÃO devem afirmar

- “React acessa o MariaDB diretamente.” — falso: passa pela API.
- “Maven é uma biblioteca Java executada pelo navegador.” — falso: é ferramenta de build.
- “BCrypt autentica os usuários na tela de login.” — falso: há hash no cadastro, mas o login é prototipado.
- “JPA cria as tabelas ao iniciar.” — falso para esta configuração, que usa `ddl-auto=validate`.
- “Vite é o backend de negócio.” — falso: é servidor/bundler do frontend.
- “Todas as páginas usam a API.” — falso: várias telas têm mocks.

## 9. Exercício de resposta

Explique, em 30 segundos, o papel de **Java**, **Spring Boot**, **React**, **Vite**, **Maven**, **npm**, **JPA/Hibernate** e **MariaDB**, sem usar a palavra “ferramenta” para tudo. Depois localize suas evidências em `pom.xml`, `package.json`, `vite.config.js` e `application.properties`.
