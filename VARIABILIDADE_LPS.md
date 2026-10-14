# Variabilidade — Linha de Produto de Software

Variabilidade é o planejamento de funcionalidades comuns e opcionais para gerar produtos relacionados a partir de uma mesma base. No AMT Solution, ela é uma proposta acadêmica: a seleção dinâmica de módulos ainda não foi implementada.

## Funcionalidades

- Obrigatórias: Usuários, Produtos, Fornecedores, Contas a Pagar e Avisos.
- Opcionais: Contas a Receber, Estoque, PDV, Caixa, Pedidos de Compra e Relatórios Financeiros.

## Feature Model

```text
AMT Solution
├── Base comum (obrigatória)
│   ├── Usuários
│   ├── Produtos
│   ├── Fornecedores
│   ├── Contas a Pagar
│   └── Avisos
└── Módulos opcionais
    ├── Contas a Receber
    ├── Estoque
    ├── PDV
    │   └── Caixa
    ├── Pedidos de Compra
    └── Relatórios Financeiros
```

## Configurações exemplificadas

| Produto | Módulos selecionados |
| --- | --- |
| Loja de doces | Base comum, Contas a Receber, Estoque, PDV, Caixa e Pedidos de Compra |
| Prestador de serviços | Base comum, Contas a Receber e Relatórios Financeiros; estoque, PDV, caixa e pedidos inativos |

## Regras de dependência

- PDV requer Produtos.
- Caixa requer PDV.
- Estoque requer Produtos.
- Pedidos de Compra requer Produtos e Fornecedores.
- Relatórios Financeiros requer Contas a Pagar e Contas a Receber.

## Exemplo de configuração inválida

Uma configuração com **PDV ativo** e **Produtos inativo** é inválida, pois o PDV depende do cadastro de produtos para realizar operações de venda. Para torná-la válida, é necessário ativar o módulo Produtos ou desativar o PDV, conforme a regra de dependência apresentada no Feature Model.

## Possível implementação futura

Uma configuração por estabelecimento poderia registrar os módulos ativos. O frontend mostraria apenas menus selecionados e o backend validaria as dependências e recusaria rotas de módulos inativos. Essa evolução exigiria modelagem, endpoints e controles próprios; não faz parte desta versão.
