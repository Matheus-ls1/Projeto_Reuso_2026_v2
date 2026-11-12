# Parte III — Database First — AMT Solutions

## Objetivo
Demonstrar que as classes Java e as operações CRUD podem ser **geradas a partir da estrutura de uma tabela JÁ EXISTENTE no MariaDB**. O banco vem primeiro; a ferramenta de *reverse engineering* lê metadados da tabela `fornecedores` e gera automaticamente modelo, interface Mapper e SQL de acesso.

**Ferramenta:** MyBatis Generator 2.0.0 (Maven). **Projeto original:** AMT Solutions (React + Spring Boot/JPA + MariaDB). Esta pasta é uma demonstração isolada. **Não substitui** as entidades/Services/Repositories do projeto existente.

## Preparação
1. No Windows, copie a pasta `DatabaseFirst_Demo` para `Reuso/DatabaseFirst_Demo`, ao lado de `Frontend` e `Backend`.
2. Inicie o MySQL/MariaDB no XAMPP, sem precisar iniciar o Tomcat. Confirme que o banco `amt_solution` e a tabela `fornecedores` existem no phpMyAdmin.
3. Abra `DatabaseFirst_Demo` no IntelliJ IDEA como um projeto Maven, ou no VS Code com suporte Maven.
4. Em `src/main/resources/generatorConfig.xml`, confira `connectionURL`, `userId` e `password`. Os valores fornecidos são os defaults comuns do XAMPP (`root`, senha vazia) e precisam ser ajustados se sua instalação usar outras credenciais. **Não envie senhas reais ao GitHub**.
5. Use JDK 17+ e Maven. Se o comando `mvn` não existir no PowerShell, execute o goal pelo painel **Maven** do IntelliJ.

## Demonstração de geração real
Antes da execução, mostre que `src/main/java/com/amtsolutions/databasefirst/model` e `/mapper` ainda NÃO contêm classes geradas.

No terminal aberto na pasta `DatabaseFirst_Demo`, execute:

```powershell
mvn mybatis-generator:generate
```

Ou, no IntelliJ, painel **Maven → Plugins → mybatis-generator → mybatis-generator:generate**.

O gerador conecta-se ao MariaDB e cria, conforme a tabela real:

- `src/main/java/com/amtsolutions/databasefirst/model/FornecedorGerado.java` — classe com campos, getters e setters derivados das colunas;
- `src/main/java/com/amtsolutions/databasefirst/mapper/FornecedorGeradoMapper.java` — interface com operações `insert`, `selectAll`, `selectByPrimaryKey`, `updateByPrimaryKey`, `deleteByPrimaryKey` etc., de acordo com a chave primária existente;
- `src/main/resources/com/amtsolutions/databasefirst/mapper/FornecedorGeradoMapper.xml` — instruções SQL para as operações.

Se a geração não encontrar a tabela, confira o nome exato do schema, a porta, as credenciais e a existência da chave primária.

## Teste de execução (somente leitura)
Após gerar, execute:

```powershell
mvn compile exec:java
```

Este programa usa **a interface e o SQL gerados**, executa `selectAll()` sobre `fornecedores`, mostra a quantidade de linhas lidas e os atributos Java gerados. Ele **não modifica registros** da base original.

Se a conta do banco não for `root`/senha vazia, ajuste as variáveis de ambiente apenas para este teste (em PowerShell):

```powershell
$env:AMT_DB_USER="seu_usuario"
$env:AMT_DB_PASSWORD="sua_senha"
mvn compile exec:java
```

As credenciais do gerador devem ser ajustadas separadamente em `generatorConfig.xml`.

## Demonstração ao professor: sequência sugerida
1. **Banco primeiro:** no phpMyAdmin, abrir `amt_solution > fornecedores > Estrutura` e mostrar colunas e PK.
2. **Código ainda não existe:** mostrar pastas `model` e `mapper` vazias (antes da geração, preferencialmente em uma cópia limpa).
3. **Geração:** executar `mvn mybatis-generator:generate` na frente do professor.
4. **Classes geradas:** abrir `FornecedorGerado.java` e comparar atributos com as colunas do banco.
5. **CRUD gerado:** abrir `FornecedorGeradoMapper.java` e `FornecedorGeradoMapper.xml`, apontar INSERT, SELECT, UPDATE e DELETE.
6. **Execução real:** executar `mvn compile exec:java` e mostrar a quantidade de fornecedores consultados.
7. **Limite da automação:** explicar que a ferramenta gera modelo e persistência, mas **não cria automaticamente páginas React ou as regras de negócio do Spring Boot** nesta configuração.

## Por que esta pasta é separada?
O backend original já utiliza **Spring Data JPA**. O MyBatis Generator utiliza outra tecnologia de persistência; misturar os dois sem planejamento criaria duplicação e confusão. A atividade pede demonstrar **Database First**, não substituir a arquitetura pronta. A demonstração usa a mesma estrutura de banco, mas em uma implementação gerada independente.

## Erros frequentes
- `mvn not recognized`: Maven não está no PATH; use painel Maven do IntelliJ ou configure Maven.
- `Connection refused`: inicie o MariaDB no XAMPP e confirme porta 3306.
- `Access denied`: usuário ou senha do banco diferente dos configurados.
- `Table not found`: confira que o banco é `amt_solution` e a tabela é `fornecedores`.
- `Cannot find class FornecedorGeradoMapper`: o passo de geração não foi executado ou o Maven não recarregou o projeto.
- `Duplicate class`: não copie estes arquivos gerados para o pacote `model` do backend original.

## Observação acadêmica
O código desta pasta **não está previamente gerado**; ele só será gerado após conexão real com o banco do estudante. Assim, na apresentação fica possível demonstrar a transformação banco de dados → classe Java → Mapper/SQL CRUD → teste de consulta, sem afirmar incorretamente que a tela React foi gerada.
