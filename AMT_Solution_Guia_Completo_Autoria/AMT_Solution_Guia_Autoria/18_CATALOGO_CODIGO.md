# 18 — Catálogo navegável dos arquivos do projeto e das classes reais

> Inventário compilado diretamente de `Frontend.zip` e `Backend.zip` enviados. **Caminhos estão relativos à pasta raiz que contém as pastas `Frontend/` e `Backend/`.** Os métodos listados servem como *pistas de navegação*; sobrecargas, métodos privados, acessores e multiline signatures podem não aparecer todos nesta extração simplificada. Para a definição oficial, abra a classe no VS Code.

## 1. Como localizar qualquer operação em segundos

Use pesquisa global do VS Code (`Ctrl+Shift+F`) para um nome como `simularEncargos`, `criarAvisoVencimento`, `existsByChaveEvento`, `verificarVencimentos` ou o endpoint `/api/contas-pagar`. Em seguida, navegue para a definição e identifique quem chama o método.

## 2. Arquivos Java de produção, agrupados por responsabilidade

### Pacote `com.amtsolution` — 1 arquivo(s)

- **`AmtSolutionApplication.java`** — `Backend/src/main/java/com/amtsolution/AmtSolutionApplication.java`. Métodos/construtores localizados: `main()`.

### Pacote `com.amtsolution.config` — 2 arquivo(s)

- **`CorsConfig.java`** — `Backend/src/main/java/com/amtsolution/config/CorsConfig.java`. Métodos/construtores localizados: `addCorsMappings()`.
- **`PasswordConfig.java`** — `Backend/src/main/java/com/amtsolution/config/PasswordConfig.java`. Inspecione os membros conforme necessidade.

### Pacote `com.amtsolution.controller` — 6 arquivo(s)

- **`AvisoController.java`** — `Backend/src/main/java/com/amtsolution/controller/AvisoController.java`. Métodos/construtores localizados: `AvisoController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `excluir()`.
- **`ContaPagarController.java`** — `Backend/src/main/java/com/amtsolution/controller/ContaPagarController.java`. Métodos/construtores localizados: `ContaPagarController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `situacao()`, `simular()`, `excluir()`.
- **`ContaReceberController.java`** — `Backend/src/main/java/com/amtsolution/controller/ContaReceberController.java`. Métodos/construtores localizados: `ContaReceberController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `situacao()`, `simular()`, `excluir()`.
- **`FornecedorController.java`** — `Backend/src/main/java/com/amtsolution/controller/FornecedorController.java`. Métodos/construtores localizados: `FornecedorController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`.
- **`ProdutoController.java`** — `Backend/src/main/java/com/amtsolution/controller/ProdutoController.java`. Métodos/construtores localizados: `ProdutoController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`.
- **`UsuarioController.java`** — `Backend/src/main/java/com/amtsolution/controller/UsuarioController.java`. Métodos/construtores localizados: `UsuarioController()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`.

### Pacote `com.amtsolution.dto` — 8 arquivo(s)

- **`AtivoRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/AtivoRequest.java`. Métodos/construtores localizados: `AtivoRequest()`.
- **`AvisoRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/AvisoRequest.java`. Métodos/construtores localizados: `AvisoRequest()`.
- **`ContaPagarRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/ContaPagarRequest.java`. Métodos/construtores localizados: `ContaPagarRequest()`.
- **`ContaReceberRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/ContaReceberRequest.java`. Métodos/construtores localizados: `ContaReceberRequest()`.
- **`FornecedorRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/FornecedorRequest.java`. Métodos/construtores localizados: `FornecedorRequest()`.
- **`ProdutoRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/ProdutoRequest.java`. Métodos/construtores localizados: `ProdutoRequest()`.
- **`SituacaoRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/SituacaoRequest.java`. Métodos/construtores localizados: `SituacaoRequest()`.
- **`UsuarioRequest.java`** — `Backend/src/main/java/com/amtsolution/dto/UsuarioRequest.java`. Métodos/construtores localizados: `UsuarioRequest()`.

### Pacote `com.amtsolution.exception` — 3 arquivo(s)

- **`ApiExceptionHandler.java`** — `Backend/src/main/java/com/amtsolution/exception/ApiExceptionHandler.java`. Inspecione os membros conforme necessidade.
- **`ConflictException.java`** — `Backend/src/main/java/com/amtsolution/exception/ConflictException.java`. Métodos/construtores localizados: `ConflictException()`.
- **`ResourceNotFoundException.java`** — `Backend/src/main/java/com/amtsolution/exception/ResourceNotFoundException.java`. Métodos/construtores localizados: `ResourceNotFoundException()`.

### Pacote `com.amtsolution.model` — 6 arquivo(s)

- **`Aviso.java`** — `Backend/src/main/java/com/amtsolution/model/Aviso.java`. Métodos/construtores localizados: `getId()`, `getTitulo()`, `setTitulo()`, `getCorpo()`, `setCorpo()`, `getTipo()`, `setTipo()`, `getPrioridade()`, `setPrioridade()`, `getPublico()`, `setPublico()`, `getInicio()`, `setInicio()`, `getFim()` ....
- **`ContaPagar.java`** — `Backend/src/main/java/com/amtsolution/model/ContaPagar.java`. Métodos/construtores localizados: `getId()`, `getDescricao()`, `setDescricao()`, `getCategoria()`, `setCategoria()`, `getFornecedor()`, `setFornecedor()`, `getVencimento()`, `setVencimento()`, `getValorOriginal()`, `setValorOriginal()`, `getEstrategiaEncargo()`, `setEstrategiaEncargo()`, `getPercentualJuros()` ....
- **`ContaReceber.java`** — `Backend/src/main/java/com/amtsolution/model/ContaReceber.java`. Métodos/construtores localizados: `getId()`, `getDescricao()`, `setDescricao()`, `getCategoria()`, `setCategoria()`, `getCliente()`, `setCliente()`, `getVencimento()`, `setVencimento()`, `getValorOriginal()`, `setValorOriginal()`, `getEstrategiaDesconto()`, `setEstrategiaDesconto()`, `getPercentualDesconto()` ....
- **`Fornecedor.java`** — `Backend/src/main/java/com/amtsolution/model/Fornecedor.java`. Métodos/construtores localizados: `getId()`, `getNome()`, `setNome()`, `getDocumento()`, `setDocumento()`, `getContato()`, `setContato()`, `getTelefone()`, `setTelefone()`, `getEmail()`, `setEmail()`, `getAtivo()`, `setAtivo()`, `getCriadoEm()` ....
- **`Produto.java`** — `Backend/src/main/java/com/amtsolution/model/Produto.java`. Métodos/construtores localizados: `getId()`, `getTipo()`, `setTipo()`, `getCodigo()`, `setCodigo()`, `getNome()`, `setNome()`, `getCategoria()`, `setCategoria()`, `getUnidade()`, `setUnidade()`, `getPrecoVenda()`, `setPrecoVenda()`, `getQuantidadeEstoque()` ....
- **`Usuario.java`** — `Backend/src/main/java/com/amtsolution/model/Usuario.java`. Métodos/construtores localizados: `getId()`, `getNome()`, `setNome()`, `getEmail()`, `setEmail()`, `getCargo()`, `setCargo()`, `getPerfil()`, `setPerfil()`, `getSenhaHash()`, `setSenhaHash()`, `getAtivo()`, `setAtivo()`, `getCriadoEm()` ....

### Pacote `com.amtsolution.repository` — 6 arquivo(s)

- **`AvisoRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/AvisoRepository.java`. Inspecione os membros conforme necessidade.
- **`ContaPagarRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/ContaPagarRepository.java`. Inspecione os membros conforme necessidade.
- **`ContaReceberRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/ContaReceberRepository.java`. Inspecione os membros conforme necessidade.
- **`FornecedorRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/FornecedorRepository.java`. Inspecione os membros conforme necessidade.
- **`ProdutoRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/ProdutoRepository.java`. Inspecione os membros conforme necessidade.
- **`UsuarioRepository.java`** — `Backend/src/main/java/com/amtsolution/repository/UsuarioRepository.java`. Inspecione os membros conforme necessidade.

### Pacote `com.amtsolution.service` — 7 arquivo(s)

- **`AvisoService.java`** — `Backend/src/main/java/com/amtsolution/service/AvisoService.java`. Métodos/construtores localizados: `AvisoService()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `excluir()`, `criarAvisoEstoque()`, `criarAvisoVencimento()`, `validarChave()`, `preencher()`, `vazioParaNulo()`, `produto()`, `conta()`, `usuario()`.
- **`ContaPagarService.java`** — `Backend/src/main/java/com/amtsolution/service/ContaPagarService.java`. Métodos/construtores localizados: `ContaPagarService()`, `listar()`, `buscar()`, `criar()`, `simularEncargos()`, `atualizar()`, `atualizarSituacao()`, `excluir()`, `preencher()`, `fornecedor()`.
- **`ContaReceberService.java`** — `Backend/src/main/java/com/amtsolution/service/ContaReceberService.java`. Métodos/construtores localizados: `ContaReceberService()`, `listar()`, `buscar()`, `criar()`, `simularDesconto()`, `atualizar()`, `atualizarSituacao()`, `excluir()`, `preencher()`.
- **`FornecedorService.java`** — `Backend/src/main/java/com/amtsolution/service/FornecedorService.java`. Métodos/construtores localizados: `FornecedorService()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`, `preencher()`.
- **`ProdutoService.java`** — `Backend/src/main/java/com/amtsolution/service/ProdutoService.java`. Métodos/construtores localizados: `ProdutoService()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`, `preencher()`, `fornecedor()`.
- **`UsuarioService.java`** — `Backend/src/main/java/com/amtsolution/service/UsuarioService.java`. Métodos/construtores localizados: `UsuarioService()`, `listar()`, `buscar()`, `criar()`, `atualizar()`, `alterarAtivo()`, `excluir()`, `preencher()`.
- **`VerificadorVencimentosService.java`** — `Backend/src/main/java/com/amtsolution/service/VerificadorVencimentosService.java`. Métodos/construtores localizados: `VerificadorVencimentosService()`, `verificar()`.

### Pacote `com.amtsolution.patterns.strategy` — 11 arquivo(s)

- **`CalculoDescontoStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/CalculoDescontoStrategy.java`. Inspecione os membros conforme necessidade.
- **`CalculoEncargoStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/CalculoEncargoStrategy.java`. Inspecione os membros conforme necessidade.
- **`ContextoDesconto.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/ContextoDesconto.java`. Métodos/construtores localizados: `ContextoDesconto()`, `simular()`.
- **`ContextoEncargo.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/ContextoEncargo.java`. Métodos/construtores localizados: `ContextoEncargo()`, `simular()`.
- **`DescontoPercentualStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/DescontoPercentualStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`.
- **`DescontoValorFixoStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/DescontoValorFixoStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`.
- **`JurosDiariosStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/JurosDiariosStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`.
- **`MultaPercentualStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/MultaPercentualStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`, `validar()`.
- **`ResultadoCalculo.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/ResultadoCalculo.java`. Métodos/construtores localizados: `ResultadoCalculo()`.
- **`SemDescontoStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/SemDescontoStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`.
- **`SemEncargoStrategy.java`** — `Backend/src/main/java/com/amtsolution/patterns/strategy/SemEncargoStrategy.java`. Métodos/construtores localizados: `nome()`, `calcular()`.

### Pacote `com.amtsolution.patterns.factory` — 8 arquivo(s)

- **`CriadorAviso.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorAviso.java`. Métodos/construtores localizados: `criar()`, `fabricar()`.
- **`CriadorAvisoAutomatico.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorAvisoAutomatico.java`. Métodos/construtores localizados: `fabricar()`, `criarVencimento()`.
- **`CriadorAvisoManual.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorAvisoManual.java`. Métodos/construtores localizados: `fabricar()`.
- **`CriadorContaPagar.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorContaPagar.java`. Métodos/construtores localizados: `fabricar()`.
- **`CriadorContaReceber.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorContaReceber.java`. Métodos/construtores localizados: `fabricar()`.
- **`CriadorLancamentoFinanceiro.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/CriadorLancamentoFinanceiro.java`. Métodos/construtores localizados: `criar()`, `fabricar()`.
- **`DadosAviso.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/DadosAviso.java`. Métodos/construtores localizados: `DadosAviso()`.
- **`LancamentoFinanceiro.java`** — `Backend/src/main/java/com/amtsolution/patterns/factory/LancamentoFinanceiro.java`. Inspecione os membros conforme necessidade.

### Pacote `com.amtsolution.patterns.observer` — 8 arquivo(s)

- **`EventoProduto.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/EventoProduto.java`. Métodos/construtores localizados: `EventoProduto()`.
- **`EventoVencimento.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/EventoVencimento.java`. Métodos/construtores localizados: `EventoVencimento()`.
- **`ObservadorEstoqueBaixo.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/ObservadorEstoqueBaixo.java`. Métodos/construtores localizados: `ObservadorEstoqueBaixo()`, `atualizar()`.
- **`ObservadorProduto.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/ObservadorProduto.java`. Inspecione os membros conforme necessidade.
- **`ObservadorVencimento.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/ObservadorVencimento.java`. Inspecione os membros conforme necessidade.
- **`ObservadorVencimentoProximo.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/ObservadorVencimentoProximo.java`. Métodos/construtores localizados: `ObservadorVencimentoProximo()`, `atualizar()`.
- **`SujeitoProduto.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/SujeitoProduto.java`. Métodos/construtores localizados: `SujeitoProduto()`, `publicar()`.
- **`SujeitoVencimento.java`** — `Backend/src/main/java/com/amtsolution/patterns/observer/SujeitoVencimento.java`. Métodos/construtores localizados: `SujeitoVencimento()`, `publicar()`.

## 3. Páginas React e escopo da implementação

| Arquivo em `Frontend/src/pages/` | Rota | Natureza |
|---|---|---|
| `Login.jsx` | `/` | visual/mock |
| `Dashboard.jsx` | `/dashboard` | mock |
| `PDV.jsx` | `/pdv` | mock |
| `Caixa.jsx` | `/caixa` | mock |
| `Produtos.jsx` | `/produtos` | CRUD real |
| `Estoque.jsx` | `/estoque` | mock |
| `Fornecedores.jsx` | `/fornecedores` | CRUD real |
| `PedidosCompra.jsx` | `/pedidos` | mock |
| `DashboardFinanceiro.jsx` | `/financeiro` | mock |
| `ContasPagar.jsx` | `/contas-pagar` | CRUD real |
| `ContasReceber.jsx` | `/contas-receber` | CRUD real |
| `Relatorios.jsx` | `/relatorios` | mock |
| `Avisos.jsx` | `/avisos` | CRUD real |
| `Usuarios.jsx` | `/usuarios` | CRUD real |
| `PermissoesModulos.jsx` | `/permissoes` | mock |

## 4. Services JS reais

| Arquivo | Responsabilidade principal |
|---|---|
| `src/services/api.js` | `fetch`, URL, JSON, erros HTTP, conversores de datas/números/status |
| `src/services/produtosService.js` | contrato CRUD produtos/insumos e PATCH ativo |
| `src/services/fornecedoresService.js` | contrato CRUD fornecedores e PATCH ativo |
| `src/services/contasPagarService.js` | CRUD, PATCH situação, simulação encargos, verificação vencimentos |
| `src/services/contasReceberService.js` | CRUD, PATCH situação e simulação descontos |
| `src/services/usuariosService.js` | CRUD usuários, PATCH ativo, senha no payload |
| `src/services/avisosService.js` | CRUD avisos e tradução de datas/prioridade/status |

## 5. Componentes reutilizados do frontend

- `Frontend/src/components/ui/Badge.jsx`
- `Frontend/src/components/ui/Button.jsx`
- `Frontend/src/components/ui/ConfirmDialog.jsx`
- `Frontend/src/components/ui/DataTable.jsx`
- `Frontend/src/components/ui/Drawer.jsx`
- `Frontend/src/components/ui/FilterBar.jsx`
- `Frontend/src/components/ui/Input.jsx`
- `Frontend/src/components/ui/KPICard.jsx`
- `Frontend/src/components/ui/Modal.jsx`
- `Frontend/src/components/ui/PageHeader.jsx`
- `Frontend/src/components/ui/Select.jsx`
- `Frontend/src/components/ui/StatusBadge.jsx`
- `Frontend/src/components/ui/Tabs.jsx`
- `Frontend/src/components/ui/Toast.jsx`

## 6. Arquivos e configurações de infraestrutura

- `Frontend/src/main.jsx`: montagem do React.
- `Frontend/src/App.jsx`: rotas da SPA.
- `Frontend/src/components/layout/AppShell.jsx`: layout com `Outlet`.
- `Frontend/src/components/layout/Sidebar.jsx`: navegação principal.
- `Frontend/src/components/layout/TopBar.jsx`: título/cabeçalho.
- `Frontend/src/index.css`: estilos globais.
- `Frontend/src/data/mock.js`: dados simulados e helpers de visualização.
- `Frontend/package.json`: dependências e scripts.
- `Frontend/package-lock.json`: lock de dependências.
- `Frontend/vite.config.js`: plugins, build e porta padrão 8443.
- `Frontend/.env.example`: exemplo da URL da API.
- `Frontend/database/01_schema.sql`: definição das seis tabelas.
- `Frontend/database/02_seed.sql`: dados iniciais de demonstração.
- `Backend/pom.xml`: dependências Java 17/Spring Boot 3.5.0.
- `Backend/src/main/resources/application.properties`: MariaDB, porta 8080, JPA validate.

## 7. O que NÃO estava nos ZIPs entregues para estudo

Os pacotes recebidos não incluíam `VARIABILIDADE_LPS.md` ou README acadêmico no conteúdo extraído. Não é prova de que esses arquivos não existam no projeto local: eles podem estar na pasta raiz `Reuso/` fora dos dois ZIPs. Consulte o documento final correspondente antes de defender detalhes específicos do Feature Model.

## 8. Sequências de arquivos para os padrões

- **Strategy Encargos:** `ContasPagar.jsx` → `contasPagarService.js` → `ContaPagarController` → `ContaPagarService` → `ContextoEncargo` → `CalculoEncargoStrategy` → concretas.
- **Strategy Descontos:** `ContasReceber.jsx` → `contasReceberService.js` → `ContaReceberController` → `ContaReceberService` → `ContextoDesconto` → `CalculoDescontoStrategy` → concretas.
- **Factory Avisos:** `Avisos.jsx` → `avisosService.js` → `AvisoController` → `AvisoService` → `CriadorAviso` → criadores concretos.
- **Factory Financeiro:** páginas financeiras → Controllers → Services → `CriadorLancamentoFinanceiro` → concretos → `LancamentoFinanceiro`.
- **Observer Estoque:** `Produtos.jsx` → `ProdutoService` → `SujeitoProduto` → `ObservadorEstoqueBaixo` → `AvisoService` → tabela `avisos`.
- **Observer Vencimento:** `ContasPagar.jsx` → `VerificadorVencimentosService` → `SujeitoVencimento` → `ObservadorVencimentoProximo` → `AvisoService` → tabela `avisos`.
