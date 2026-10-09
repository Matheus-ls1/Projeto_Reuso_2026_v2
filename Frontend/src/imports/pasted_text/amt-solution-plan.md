Quero planejar o protótipo de um sistema web chamado **AMT Solution**.

Não inicie o desenvolvimento/build ainda. Primeiro crie um **plano completo e estruturado do produto e do protótipo**, para que eu possa revisar a arquitetura antes da geração das interfaces.

# 1. CONTEXTO DO PRODUTO

O AMT Solution é um **ERP modular para pequenos negócios**, especialmente:

* cafeterias;
* restaurantes;
* padarias e confeitarias;
* lojas;
* pequenos estabelecimentos comerciais.

O público principal são proprietários, gestores e funcionários de empresas de aproximadamente 5 a 20 colaboradores.

O problema atual desse público é trabalhar com informações espalhadas em planilhas, papéis, mensagens e sistemas pouco integrados.

Os usuários precisam controlar principalmente:

* vendas;
* caixa;
* estoque;
* compras;
* fornecedores;
* financeiro;
* contas a pagar;
* contas a receber;
* relatórios;
* usuários;
* permissões.

O principal diferencial do produto é a **modularidade**.

Cada empresa deve poder habilitar somente os módulos necessários para sua operação.

Exemplo:

Uma cafeteria pode utilizar:
Dashboard, Vendas, Caixa, Estoque, Compras, Financeiro e Alergênicos.

Um restaurante pode utilizar:
Dashboard, Vendas, Caixa, Estoque, Compras, Financeiro e Produção.

Uma loja pode utilizar:
Dashboard, Vendas, Caixa, Estoque, Compras e Financeiro, sem utilizar Produção ou funcionalidades específicas de alimentação.

A ideia central é:

**“Negócios diferentes. Necessidades diferentes. Um único sistema configurável para cada realidade.”**

---

# 2. OBJETIVO DO PROTÓTIPO

Preciso criar para um projeto acadêmico um protótipo navegável no Figma contendo entre **10 e 15 telas principais**.

Planeje preferencialmente **15 telas principais**, para representar adequadamente as funcionalidades do ERP sem criar telas redundantes.

Não considere cada modal como uma nova tela principal.

Modais, drawers, pop-ups e estados podem ser utilizados dentro das telas principais.

---

# 3. PERFIS DE USUÁRIOS

Considere diferentes perfis no sistema.

## Administrador / Proprietário

Possui visão geral do negócio.

Pode acessar:

* dashboards;
* vendas;
* caixa;
* estoque;
* compras;
* financeiro;
* relatórios;
* usuários;
* permissões;
* módulos da empresa.

Pode configurar quais módulos estão ativos.

## Gerente

Pode acessar áreas relacionadas à gestão da operação conforme suas permissões.

## Operador de Caixa / Atendente

Precisa de uma interface extremamente simples e rápida.

Suas principais operações são:

* abrir caixa;
* registrar vendas;
* receber pagamentos;
* consultar produtos;
* fechar caixa.

Não deve visualizar funcionalidades administrativas sem necessidade.

## Estoque / Compras

Precisa:

* consultar estoque;
* visualizar estoque mínimo;
* receber alertas;
* cadastrar insumos;
* acompanhar lotes e validade;
* registrar movimentações;
* gerenciar fornecedores;
* criar pedidos de compra.

## Administrativo-Financeiro

Precisa:

* consultar receitas e despesas;
* contas a pagar;
* contas a receber;
* vencimentos;
* fluxo de caixa;
* relatórios;
* informações gerenciais.

---

# 4. FUNCIONALIDADES OBRIGATÓRIAS

O planejamento deve contemplar:

## Autenticação

* Login com e-mail/usuário e senha.
* Recuperação de senha.
* Controle de acesso.

## Usuários

CRUD:

* criar;
* consultar;
* editar;
* excluir/desativar.

Campos como:

* nome;
* e-mail;
* cargo;
* perfil;
* status;
* módulos permitidos.

## Permissões

Permitir configurar quais módulos e funcionalidades cada perfil ou usuário pode utilizar.

Considerar permissões como:

* visualizar;
* criar;
* editar;
* excluir ou cancelar;
* aprovar;
* exportar.

## Gestão de módulos

O administrador deve conseguir habilitar ou desabilitar módulos da empresa.

Exemplos:

* Vendas;
* Caixa;
* Estoque;
* Compras;
* Financeiro;
* Produção;
* Alergênicos;
* Relatórios.

Um módulo desabilitado não deve aparecer na navegação dos usuários.

## Avisos

Criar módulo de comunicados internos.

CRUD de avisos:

* criar;
* consultar;
* editar;
* excluir;
* arquivar.

Permitir prioridade, público destinatário e período de publicação.

## Produtos e insumos

CRUD completo.

Campos principais:

* código/SKU;
* nome;
* categoria;
* preço;
* unidade;
* estoque;
* estoque mínimo;
* status.

Quando aplicável, permitir ingredientes e alergênicos.

## Fornecedores

CRUD completo.

## Caixa

Permitir:

* abrir caixa;
* informar saldo inicial;
* registrar operador, data e horário;
* visualizar movimentações;
* registrar entradas;
* registrar retiradas;
* fechar caixa;
* consultar resumo do período.

## Vendas / PDV

Permitir:

* pesquisar produtos;
* selecionar itens;
* alterar quantidade;
* calcular total;
* aplicar desconto quando permitido;
* escolher forma de pagamento;
* concluir venda.

Formas de pagamento:

* PIX;
* cartão;
* dinheiro.

Após uma venda, atualizar o estoque automaticamente.

## Estoque

Permitir:

* consultar saldo;
* entrada;
* saída;
* ajuste;
* histórico de movimentações;
* estoque mínimo;
* alertas de estoque baixo;
* lote;
* validade quando aplicável.

## Compras

Permitir:

* criar pedido de compra;
* consultar;
* editar;
* cancelar;
* acompanhar status;
* selecionar fornecedor;
* selecionar itens;
* quantidade;
* valor;
* previsão de recebimento.

Permitir gerar um pedido a partir de um alerta de estoque baixo.

## Financeiro

Criar dashboard financeiro com:

* receitas;
* despesas;
* saldo;
* contas a pagar;
* contas a receber;
* fluxo de caixa;
* faturamento;
* resultado do período.

## Contas a pagar

Permitir:

* cadastrar;
* consultar;
* editar;
* cancelar;
* registrar pagamento.

## Contas a receber

Permitir:

* cadastrar;
* consultar;
* editar;
* cancelar;
* registrar recebimento.

## Relatórios

Permitir consultar relatórios de:

* vendas;
* estoque;
* compras;
* financeiro;
* caixa.

Possibilitar filtros por período.

Planejar também opções de exportação em PDF e Excel.

---

# 5. REGRA IMPORTANTE SOBRE CRUD E RASTREABILIDADE

Não aplicar exclusão da mesma forma para todas as informações.

Cadastros administrativos, como produtos, fornecedores, usuários e avisos, podem possuir CRUD tradicional.

Entretanto, registros transacionais devem preservar rastreabilidade.

Por exemplo:

Uma venda concluída deve ser **cancelada ou estornada**, e não simplesmente apagada.

Uma movimentação financeira paga deve manter histórico.

Uma movimentação de estoque deve ser corrigida por ajuste ou cancelamento rastreável.

Um pedido enviado pode utilizar cancelamento em vez de exclusão definitiva.

Considere essa regra durante o planejamento das interfaces.

---

# 6. TELAS QUE DEVEM SER CONSIDERADAS

Planeje aproximadamente as seguintes **15 telas principais**:

1. Login
2. Dashboard Geral
3. Avisos
4. Caixa
5. PDV / Vendas
6. Produtos e Insumos
7. Estoque
8. Fornecedores
9. Pedidos de Compra
10. Dashboard Financeiro
11. Contas a Pagar
12. Contas a Receber
13. Relatórios
14. Usuários
15. Permissões e Módulos

Analise se essa arquitetura é coerente.

Você pode sugerir pequenos ajustes de agrupamento se houver uma justificativa clara, mas o resultado deve permanecer entre **10 e 15 telas principais** e cobrir todos os módulos essenciais.

---

# 7. DASHBOARD GERAL

Planeje um dashboard executivo que apresente informações importantes sem sobrecarregar visualmente o usuário.

Considerar indicadores como:

* vendas hoje;
* faturamento mensal;
* saldo do caixa;
* estoque baixo;
* contas próximas ao vencimento;
* pedidos de compra em aberto.

Também considerar:

* gráfico de vendas;
* evolução do faturamento;
* últimas vendas;
* estoque crítico;
* próximos vencimentos;
* pedidos recentes;
* avisos.

---

# 8. DASHBOARD FINANCEIRO

Separar a visão operacional do Dashboard Geral da visão financeira mais detalhada.

Considerar:

* saldo;
* faturamento;
* receitas;
* despesas;
* resultado;
* contas a pagar;
* contas a receber;
* fluxo de caixa.

Gráficos possíveis:

* receitas x despesas;
* evolução do faturamento;
* fluxo de caixa;
* despesas por categoria.

---

# 9. NAVEGAÇÃO

Planeje uma sidebar organizada por categorias.

Sugestão:

AMT Solution

Dashboard

OPERAÇÃO

* Vendas
* Caixa

ESTOQUE E COMPRAS

* Produtos e Insumos
* Estoque
* Fornecedores
* Pedidos de Compra

FINANCEIRO

* Visão Financeira
* Contas a Pagar
* Contas a Receber

GESTÃO

* Avisos
* Relatórios

ADMINISTRAÇÃO

* Usuários
* Permissões e Módulos

A navegação deve respeitar as permissões do usuário.

Não exibir módulos aos quais o usuário não possui acesso.

---

# 10. ESTILO VISUAL

Quero um sistema com aparência:

* sofisticada;
* profissional;
* moderna;
* clean;
* tecnológica;
* corporativa;
* confiável.

Evitar aparência muito colorida, infantil ou genérica.

Usar como referência estética softwares SaaS B2B modernos.

## Paleta sugerida

Background:
cinza muito claro próximo de **#F7F8FA**

Cards:
branco

Cor institucional:
azul-marinho próximo de **#142B4A**

Ações principais:
azul próximo de **#2563EB**

Accent secundário:
roxo próximo de **#7C3AED**

Verde:
somente sucesso e indicadores positivos.

Laranja:
alertas.

Vermelho:
erros, atrasos ou ações destrutivas.

Texto:
cinza escuro.

Usar roxo de maneira discreta.

Não quero uma interface predominantemente roxa.

---

# 11. DESIGN SYSTEM

Planeje componentes reutilizáveis para manter consistência entre as telas.

Considerar:

* sidebar;
* header;
* breadcrumbs;
* cards;
* KPIs;
* tabelas;
* botões;
* inputs;
* selects;
* filtros;
* pesquisa;
* tabs;
* badges;
* paginação;
* modais;
* drawers;
* dropdowns;
* tooltips;
* alertas;
* notificações;
* toast;
* confirmação;
* estados vazios;
* loading.

Considerar estados:

* default;
* hover;
* focus;
* disabled;
* success;
* warning;
* error.

---

# 12. EXPERIÊNCIA DO USUÁRIO

A principal característica do AMT Solution deve ser:

**um ERP completo que não pareça complicado.**

Planeje as interfaces priorizando:

* poucos cliques;
* baixa carga cognitiva;
* informação hierarquizada;
* feedback imediato;
* consistência;
* facilidade de aprendizado;
* prevenção de erros;
* ações principais claramente destacadas.

Utilizar progressive disclosure.

Não mostrar todas as opções simultaneamente quando não forem necessárias.

Usar modais ou drawers para operações secundárias.

---

# 13. RESPONSIVIDADE

O projeto será inicialmente desktop-first, aproximadamente 1440px.

Entretanto, a arquitetura visual deve possibilitar adaptação futura para:

* desktop;
* tablet;
* smartphone.

O PDV e operações rápidas devem possuir especial atenção à utilização em tablet.

---

# 14. DADOS DE EXEMPLO

Utilize futuramente dados fictícios, porém realistas e em português brasileiro.

Formato monetário:

R$ 1.250,00

Formato de data:

18/08/2026

Formato de horário:

14:30

Evitar Lorem Ipsum.

---

# 15. O QUE QUERO RECEBER AGORA

**Neste momento, não faça o Build.**

Gere primeiro um plano detalhado contendo:

### A. Arquitetura do protótipo

Liste todas as telas propostas e explique o objetivo de cada uma.

### B. Estrutura de navegação

Explique como os módulos estarão organizados na sidebar e como o usuário navegará entre eles.

### C. Fluxos principais

Planeje pelo menos os seguintes fluxos:

Login → Dashboard

Dashboard → demais módulos

Abrir caixa → registrar venda → receber pagamento

Venda → atualização de estoque

Estoque baixo → gerar pedido de compra

Pedido de compra → recebimento → entrada no estoque

Conta a pagar → registrar pagamento

Conta a receber → registrar recebimento

Usuários → configurar permissões

Administrador → habilitar/desabilitar módulos

Avisos → criar/editar/publicar

### D. CRUD

Identifique quais entidades terão CRUD completo e quais utilizarão cancelamento, estorno ou inativação para manter rastreabilidade.

### E. Componentes reutilizáveis

Liste os principais componentes que deverão formar o design system.

### F. Hierarquia de usuários

Explique como Administrador, Gerente, Operador, Estoque/Compras e Financeiro terão acessos diferentes.

### G. Estrutura de cada tela

Para cada tela indique:

* informações principais;
* cards;
* tabelas;
* filtros;
* botões;
* formulários;
* modais/drawers;
* estados importantes.

### H. Consistência visual

Defina como cores, tipografia, espaçamento, ícones, tabelas, cards e componentes serão utilizados de maneira consistente.

### I. Protótipo

Indique quais interações deverão ser configuradas posteriormente no protótipo navegável.

### J. Análise crítica

Antes de finalizar o plano, identifique:

* funcionalidades redundantes;
* telas que poderiam ser agrupadas;
* funcionalidades importantes ausentes;
* riscos de sobrecarga da interface;
* pontos onde a modularidade deve ficar evidente.

Depois apresente uma **versão final recomendada da arquitetura com no máximo 15 telas**.

Não inicie o Build até que esse plano seja revisado.
