-- Dados mínimos de demonstração. Execute após 01_schema.sql.
USE amt_solution;

INSERT INTO fornecedores (nome, documento, contato, telefone, email, ativo)
VALUES
  ('Café Brasil Ltda', '12.345.678/0001-90', 'Carlos Mendes', '(11) 98765-4321', 'comercial@cafebrasil.com.br', 1),
  ('Laticínios Norte S/A', '23.456.789/0001-01', 'Ana Paula Costa', '(21) 97654-3210', 'vendas@laticiniosnorte.com.br', 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), contato = VALUES(contato), telefone = VALUES(telefone), email = VALUES(email), ativo = VALUES(ativo);

INSERT INTO produtos (tipo, codigo, nome, categoria, unidade, preco_venda, quantidade_estoque, quantidade_minima, alergenos, ativo, fornecedor_id)
SELECT 'PRODUTO', 'CAF-001', 'Cappuccino 300ml', 'Bebidas', 'UN', 12.50, 0.000, 10.000, 'Leite', 1, id
FROM fornecedores WHERE documento = '12.345.678/0001-90'
ON DUPLICATE KEY UPDATE nome = VALUES(nome), preco_venda = VALUES(preco_venda), quantidade_estoque = VALUES(quantidade_estoque), quantidade_minima = VALUES(quantidade_minima), alergenos = VALUES(alergenos), ativo = VALUES(ativo), fornecedor_id = VALUES(fornecedor_id);

INSERT INTO produtos (tipo, codigo, nome, categoria, unidade, preco_venda, quantidade_estoque, quantidade_minima, lote, data_validade, ativo, fornecedor_id)
SELECT 'INSUMO', 'INS-001', 'Café em Grãos', 'Matéria-Prima', 'kg', NULL, 15.000, 10.000, 'L2026-08', '2027-12-31', 1, id
FROM fornecedores WHERE documento = '12.345.678/0001-90'
ON DUPLICATE KEY UPDATE nome = VALUES(nome), quantidade_estoque = VALUES(quantidade_estoque), quantidade_minima = VALUES(quantidade_minima), lote = VALUES(lote), data_validade = VALUES(data_validade), ativo = VALUES(ativo), fornecedor_id = VALUES(fornecedor_id);

INSERT INTO contas_pagar (descricao, categoria, fornecedor_id, vencimento, valor_original, estrategia_encargo, percentual_juros, percentual_multa, situacao, forma_pagamento, observacao)
SELECT 'Fornecimento de Leite — Laticínios Norte', 'Insumos', id, '2026-10-10', 420.00, 'MULTA_JUROS', 1.00, 2.00, 'PENDENTE', 'PIX', 'Conta utilizada no alerta de vencimento.'
FROM fornecedores WHERE documento = '23.456.789/0001-01'
AND NOT EXISTS (SELECT 1 FROM contas_pagar WHERE descricao = 'Fornecimento de Leite — Laticínios Norte' AND vencimento = '2026-10-10');

INSERT INTO contas_pagar (descricao, categoria, vencimento, valor_original, situacao, data_pagamento, valor_pago, forma_pagamento)
SELECT 'Energia Elétrica — Setembro 2026', 'Utilidades', '2026-09-10', 680.00, 'PAGO', '2026-09-10', 680.00, 'Boleto'
WHERE NOT EXISTS (SELECT 1 FROM contas_pagar WHERE descricao = 'Energia Elétrica — Setembro 2026' AND vencimento = '2026-09-10');

INSERT INTO contas_receber (descricao, categoria, cliente, vencimento, valor_original, estrategia_desconto, percentual_desconto, situacao, observacao)
SELECT 'Evento Corporativo — Empresa ABC', 'Serviços', 'Empresa ABC Ltda', '2026-10-20', 1200.00, 'PERCENTUAL', 5.00, 'PENDENTE', 'Recebível de demonstração.'
WHERE NOT EXISTS (SELECT 1 FROM contas_receber WHERE descricao = 'Evento Corporativo — Empresa ABC' AND vencimento = '2026-10-20');

INSERT INTO contas_receber (descricao, categoria, cliente, vencimento, valor_original, situacao, data_recebimento, valor_recebido, forma_recebimento)
SELECT 'Catering — Evento XYZ', 'Catering', 'XYZ Eventos', '2026-09-15', 850.00, 'RECEBIDO', '2026-09-15', 850.00, 'PIX'
WHERE NOT EXISTS (SELECT 1 FROM contas_receber WHERE descricao = 'Catering — Evento XYZ' AND vencimento = '2026-09-15');

INSERT INTO usuarios (nome, email, cargo, perfil, senha_hash, ativo)
VALUES
  ('João Alves', 'joao.alves@amtsolution.com.br', 'Proprietário', 'Administrador', NULL, 1),
  ('Fernanda Lopes', 'fernanda.l@amtsolution.com.br', 'Analista Financeiro', 'Financeiro', NULL, 1)
ON DUPLICATE KEY UPDATE nome = VALUES(nome), cargo = VALUES(cargo), perfil = VALUES(perfil), ativo = VALUES(ativo);

INSERT INTO avisos (titulo, corpo, tipo, prioridade, publico, inicio, fim, situacao, criado_por_usuario_id)
SELECT 'Reunião de equipe', 'Todos os colaboradores estão convocados para a reunião mensal de alinhamento.', 'MANUAL', 'ALTA', 'Todos', '2026-10-08', '2026-10-22', 'PUBLICADO', id
FROM usuarios WHERE email = 'joao.alves@amtsolution.com.br'
AND NOT EXISTS (SELECT 1 FROM avisos WHERE titulo = 'Reunião de equipe' AND tipo = 'MANUAL');

INSERT INTO avisos (titulo, corpo, tipo, prioridade, publico, inicio, fim, situacao, chave_evento, produto_origem_id)
SELECT 'Estoque baixo: Cappuccino 300ml', 'O produto Cappuccino 300ml atingiu quantidade igual ou inferior ao mínimo.', 'ESTOQUE_BAIXO', 'ALTA', 'Estoque/Compras', '2026-10-08', NULL, 'PUBLICADO', 'ESTOQUE_BAIXO:CAF-001', id
FROM produtos WHERE codigo = 'CAF-001'
ON DUPLICATE KEY UPDATE corpo = VALUES(corpo), situacao = VALUES(situacao), produto_origem_id = VALUES(produto_origem_id);

INSERT INTO avisos (titulo, corpo, tipo, prioridade, publico, inicio, fim, situacao, chave_evento, conta_pagar_origem_id)
SELECT 'Conta próxima do vencimento', 'A conta Fornecimento de Leite — Laticínios Norte vence em breve.', 'VENCIMENTO_PROXIMO', 'MEDIA', 'Financeiro', '2026-10-08', NULL, 'PUBLICADO', CONCAT('VENCIMENTO_PROXIMO:', id, ':2026-10-10'), id
FROM contas_pagar WHERE descricao = 'Fornecimento de Leite — Laticínios Norte' AND vencimento = '2026-10-10'
ON DUPLICATE KEY UPDATE corpo = VALUES(corpo), situacao = VALUES(situacao), conta_pagar_origem_id = VALUES(conta_pagar_origem_id);
