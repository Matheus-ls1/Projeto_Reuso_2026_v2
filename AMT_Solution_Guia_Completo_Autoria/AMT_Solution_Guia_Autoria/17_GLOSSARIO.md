# 17 — Glossário rápido do AMT Solution (PT-BR)

| Termo | Explicação em linguagem de prova |
|---|---|
| API | Contrato para comunicação entre aplicações |
| REST | Estilo arquitetural de recursos identificados por URLs e operações HTTP |
| Endpoint | Combinação de caminho/rota de API e ação HTTP |
| HTTP | Protocolo de requisições/respostas usado entre navegador e servidor |
| JSON | Formato textual estruturado de troca de dados |
| GET | Consultar recurso |
| POST | Criar ou disparar operação |
| PUT | Atualizar representação de cadastro |
| PATCH | Alterar parte pontual do recurso |
| DELETE | Solicitar remoção de recurso |
| 200/201/204 | OK / criado / sucesso sem corpo |
| 400/404/409 | Requisição inválida / não encontrado / conflito |
| Frontend | Parte executada no navegador, apresentação e interação |
| Backend | Parte do servidor que executa regras e persiste dados |
| SPA | Aplicação que muda telas no navegador sem recarregar página HTML completa |
| JSX | Sintaxe usada para compor interface React com JS |
| Componente | Bloco reutilizável de interface React |
| Props | Argumentos de componente |
| Estado | Dados que React acompanha para renderizar conteúdo |
| Hook | Recurso React, como `useState` e `useEffect` |
| `useState` | Mantém estado local e fornece setter |
| `useEffect` | Executa efeitos relacionados ao ciclo de vida/dependências |
| Promise | Valor assíncrono disponível futuramente |
| `async/await` | Sintaxe para lidar com Promises em sequência |
| `try/catch/finally` | Fluxos de sucesso/erro/limpeza |
| `fetch` | API JavaScript de comunicação HTTP |
| `JSON.stringify` | Serializa objeto JS em texto JSON |
| React Router | Biblioteca de rotas no frontend |
| `Outlet` | Local onde rota filha é renderizada |
| Tailwind CSS | Classes utilitárias de CSS |
| Lucide | Biblioteca de ícones para React |
| Recharts | Biblioteca de gráficos React |
| Vite | Bundler e servidor de desenvolvimento frontend |
| Node.js | Ambiente para executar ferramentas JavaScript fora do navegador |
| npm | Gerenciador de pacotes e scripts JavaScript |
| Maven | Gerenciador de dependências/build do Java |
| JDK | Ferramentas para desenvolver/compilar Java |
| Spring Boot | Framework para estruturar e iniciar aplicação Java |
| Spring MVC | Infraestrutura web de Controllers e mapeamento HTTP |
| IoC | Inversão de controle; contêiner organiza criação/uso dos componentes |
| DI | Injeção de dependências; objeto recebe colaboradores de fora |
| Bean | Objeto gerenciado pelo contêiner Spring |
| DTO | Objeto de transporte que define e valida dados de entrada/saída |
| `record` | Tipo Java conciso para dados imutáveis |
| Entity | Classe Java representando entidade/tabela persistida |
| Repository | Componente de acesso a dados |
| Service | Camada das regras de negócio e orquestração |
| Controller | Camada que recebe requisições e constrói respostas HTTP |
| JPA | Especificação/API de persistência Java |
| Hibernate | Implementação ORM utilizada para mapear objetos ↔ tabelas |
| ORM | Mapeamento objeto-relacional |
| JDBC | Interface Java de conexão/comunicação com bancos via drivers |
| MariaDB | Sistema gerenciador de banco de dados relacional |
| phpMyAdmin | Ferramenta web de administração SQL |
| XAMPP | Pacote de serviços para ambiente local |
| PK | Chave primária |
| FK | Chave estrangeira |
| UNIQUE | Restrição de unicidade |
| NOT NULL | Coluna não admite valor nulo |
| Index | Estrutura para acelerar certas consultas |
| Transação | Unidade de operação no banco que preserva consistência |
| Commit | Confirmação de transação, ou registro de versão no Git (contextos distintos) |
| Rollback | Desfaz alterações de transação em condições aplicáveis |
| `flush()` | Sincroniza alterações pendentes do ORM com o banco |
| BigDecimal | Tipo Java de aritmética decimal exata/precisa |
| LocalDate | Tipo de data sem horário |
| Polimorfismo | Invocar comportamento por um contrato, executado por implementação concreta |
| Interface | Contrato com operações que implementações cumprem |
| Herança | Especialização de uma classe base por subclasses |
| Encapsulamento | Organização que esconde detalhes internos e expõe operações controladas |
| Strategy | Algoritmos intercambiáveis por interface comum |
| Contexto Strategy | Objeto que seleciona e utiliza uma estratégia concreta |
| Factory Method | Método de criação cujo produto é decidido por implementações/subclasses |
| Creator | Classe criadora no Factory Method |
| Observer | Objeto notificado quando um sujeito publica evento |
| Subject/Sujeito | Objeto que notifica observadores |
| Evento | Objeto com dados relevantes da ocorrência publicada |
| Idempotência | Repetição da mesma operação/evento sem multiplicar indevidamente o efeito |
| Soft delete | Desativação lógica; não é o DELETE físico implementado |
| CORS | Política do navegador para requisições entre origens distintas |
| Origin | Protocolo + host + porta (identifica origem web) |
| BCrypt | Algoritmo de hash de senha com salt e custo configurável |
| Hash | Resultado unidirecional de função apropriada; não senha criptografada reversivelmente |
| Mock | Dado/comportamento simulado sem integração completa real |
| LPS/SPL | Linha de Produto de Software, família de soluções com partes comuns e variáveis |
| Feature | Característica selecionável de uma variante |
| Feature Model | Modelo de características e restrições de combinação |
| Requires | Regra: selecionar A exige B |
| Excludes | Regra: A e B não podem coexistir |
| Git | Controle de versão |
| `pom.xml` | Configuração Maven/dependências Java |
| `package.json` | Dependências e scripts npm |
| `package-lock.json` | Versões resolvidas da árvore de dependências npm |
| `.env` | Arquivo de configuração de ambiente; nunca guardar segredos em VITE_* |
| Build | Processo de compilação/empacotamento |
| `dist/` | Artefatos frontend gerados pelo build |
| `target/` | Artefatos Maven gerados pelo build |
| `node_modules/` | Dependências npm instaladas localmente |
