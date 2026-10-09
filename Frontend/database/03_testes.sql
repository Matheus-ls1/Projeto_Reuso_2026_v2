-- Consultas de validação. Execute após 01_schema.sql e 02_seed.sql.
USE amt_solution;

-- 1. Confirma a existência das seis tabelas do escopo.
SHOW TABLES LIKE 'fornecedores';
SHOW TABLES LIKE 'produtos';
SHOW TABLES LIKE 'contas_pagar';
SHOW TABLES LIKE 'contas_receber';
SHOW TABLES LIKE 'usuarios';
SHOW TABLES LIKE 'avisos';

-- 2. Confirma os campos, índices e chaves estrangeiras criados.
DESCRIBE produtos;
SHOW CREATE TABLE avisos;

-- 3. Consulta com JOIN: fornecedor, produto e situação do estoque.
SELECT p.codigo, p.nome, p.tipo, p.quantidade_estoque, p.quantidade_minima, f.nome AS fornecedor
FROM produtos p
LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
ORDER BY p.nome;

-- 4. Dados necessários ao Observer de estoque baixo.
SELECT id, codigo, nome, quantidade_estoque, quantidade_minima
FROM produtos
WHERE ativo = 1 AND quantidade_estoque <= quantidade_minima;

-- 5. Dados necessários ao Observer de vencimento próximo (próximos sete dias).
SELECT cp.id, cp.descricao, cp.vencimento, cp.valor_original, cp.estrategia_encargo, f.nome AS fornecedor
FROM contas_pagar cp
LEFT JOIN fornecedores f ON f.id = cp.fornecedor_id
WHERE cp.situacao IN ('PENDENTE', 'VENCIDO')
  AND cp.vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY cp.vencimento;

-- 6. Confere os avisos automáticos persistidos e suas origens.
SELECT a.titulo, a.tipo, a.chave_evento, p.nome AS produto_origem, cp.descricao AS conta_origem
FROM avisos a
LEFT JOIN produtos p ON p.id = a.produto_origem_id
LEFT JOIN contas_pagar cp ON cp.id = a.conta_pagar_origem_id
WHERE a.tipo <> 'MANUAL';

-- 7. Exercita inserção, atualização, consulta e exclusão sem alterar os dados iniciais.
START TRANSACTION;

INSERT INTO fornecedores (nome, documento, contato, telefone, email, ativo)
VALUES ('Fornecedor de Teste', '99.999.999/0001-99', 'Pessoa de Teste', '(11) 90000-0000', 'teste@amt.local', 1);

INSERT INTO produtos (tipo, codigo, nome, categoria, unidade, preco_venda, quantidade_estoque, quantidade_minima, fornecedor_id)
VALUES ('PRODUTO', 'TESTE-CRUD-001', 'Produto Temporário', 'Teste', 'UN', 1.00, 5.000, 1.000, LAST_INSERT_ID());

UPDATE produtos
SET preco_venda = 2.50, quantidade_estoque = 3.000
WHERE codigo = 'TESTE-CRUD-001';

SELECT p.codigo, p.nome, p.preco_venda, f.nome AS fornecedor
FROM produtos p
INNER JOIN fornecedores f ON f.id = p.fornecedor_id
WHERE p.codigo = 'TESTE-CRUD-001';

DELETE FROM produtos WHERE codigo = 'TESTE-CRUD-001';
DELETE FROM fornecedores WHERE documento = '99.999.999/0001-99';

ROLLBACK;

-- 8. Verifica que os registros de teste não persistiram.
SELECT COUNT(*) AS registros_de_teste_restantes
FROM produtos
WHERE codigo = 'TESTE-CRUD-001';
