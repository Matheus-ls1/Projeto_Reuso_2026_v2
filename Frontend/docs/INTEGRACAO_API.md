# Integração React e API — Etapa 04

## Serviços

`src/services/api.js` concentra `fetch`, URL base, JSON, respostas 204 e erros de HTTP/conexão. Os serviços por recurso (`fornecedoresService`, `produtosService`, `contasPagarService`, `contasReceberService`, `usuariosService` e `avisosService`) chamam os endpoints e adaptam os nomes da API para a interface.

A URL é `VITE_API_URL`, documentada em `.env.example`; sem variável, usa `http://localhost:8080/api`.

## Mapeamentos principais

- Fornecedor: `documento` ↔ `cnpj`; `ativo` ↔ `status`.
- Produto: `codigo` ↔ `sku`, `precoVenda` ↔ `preco`, quantidades ↔ estoque, e fornecedor é enviado por `fornecedorId`.
- Financeiro: `valorOriginal` ↔ `valor`, datas ISO ↔ `DD/MM/AAAA`, e enums da API ↔ textos de status.
- Aviso: prioridades/situações da API usam maiúsculas; a interface mostra os textos em português.
- Usuário: `senha` é opcional e nunca recebe nem exibe `senha_hash`.

## Endpoints e comportamento

As seis telas carregam dados reais no acesso e usam POST/PUT/DELETE pelos serviços. Contas a pagar e receber usam PATCH de situação nos modais de pagamento/recebimento. Fornecedor, produto e usuário usam desativação lógica pelo backend; contas e avisos são removidos fisicamente.

Erros HTTP e indisponibilidade do backend são mostrados por toast; não há fallback para mocks nas seis telas integradas. As páginas restantes continuam utilizando `src/data/mock.js`.

## Como executar

1. Inicie MariaDB/XAMPP e o backend em `Backend` (`mvn spring-boot:run`).
2. Em `Frontend`, copie `.env.example` para `.env` se precisar de outra URL.
3. Execute `npm run dev` e acesse o Vite.

## Testes

- `npm run build`: aprovado.
- A validação HTTP da Etapa 04.1 foi executada com MariaDB ativo: GET, POST, PUT e DELETE foram confirmados nos seis recursos; PATCH foi confirmado nas contas financeiras; e arquivamento de aviso foi confirmado por PUT.
- O build valida imports e JSX, mas não substitui o teste visual no navegador.
- Para o teste manual, inicie backend e frontend, cadastre um registro identificável em cada tela, edite-o e confirme que a tabela é recarregada. Para fornecedor, produto e usuário, o resultado final esperado é `Inativo`.

Limitação atual: a tela de usuários não possui campo de senha no design original; por segurança ela envia `senha: null` e não cria nem preenche senhas fictícias. A autenticação continua fora do escopo.
# Situação da integração (Etapa 04.1)

As seis telas abaixo usam exclusivamente `Frontend/src/services/` para seus dados reais: Produtos, Fornecedores, Contas a Pagar, Contas a Receber, Usuários e Avisos. Não há fallback silencioso para `mock.js` nesses módulos.

Operações de pagamento e recebimento usam os endpoints `PATCH .../situacao`; arquivamento de aviso usa `PUT` com `situacao: "ARQUIVADO"`. Exclusões físicas aplicam-se a contas e avisos; produtos, fornecedores e usuários usam a desativação lógica implementada pelo backend.

Consulte [VALIDACAO_CRUDS.md](VALIDACAO_CRUDS.md) para a matriz completa, limites e roteiro de teste.

