# projeto-site-de-estoque-StockCloud


# Descrição Geral

 é uma aplicação web moderna criada para auxiliar pequenos empreendedores e gestores a controlarem seus estoques de forma simples, eficiente e visual. 
O sistema foi pensado para resolver um problema comum em negócios locais: a dificuldade em registrar, monitorar e analisar produtos em tempo real. Com essa aplicação, é possível cadastrar itens, acompanhar quantidades, visualizar relatórios e identificar produtos com baixo estoque, tudo diretamente do navegador. 
A proposta é transformar uma rotina administrativa em uma experiência digital intuitiva, utilizando a integração entre HTML, CSS e JavaScript para criar uma ferramenta interativa e funcional. 

# Status do Projeto

Em desenvolvimento

# Funcionalidades

- [ ] **Estrutura de Dados Inicial:**
Crie um array de objetos para representar os produtos cadastrados no estoque. 
Cada objeto deve conter os campos: id, nome, categoria, quantidade, preco e dataEntrada. 
const produtos = [ 
{ 
id: 1, nome: 'Teclado USB', categoria: 'Informática', quantidade: 35, preco: 120.00, 
dataEntrada: '2025-03-05' }, 
{ 
id: 2, nome: 'Mouse Óptico', categoria: 'Informática', quantidade: 50, preco: 60.00, 
dataEntrada: '2025-03-10' } 
];

- [ ] **Cadastro de Produtos:**
A página “Adicionar Item” deve conter um formulário para incluir novos produtos no array. 
Valide os campos obrigatórios e exiba mensagens de sucesso ou erro. 
Após o cadastro, atualize automaticamente a tabela e salve os dados em localStorage.

- [ ] **Listagem e Filtros:**
A página de inventário deve exibir todos os produtos cadastrados em uma tabela dinâmica. 
Implemente uma barra de pesquisa para filtrar produtos por nome ou categoria, utilizando os 
métodos filter() e includes(). 

- [ ] **Atualização e Exclusão:**
Permita editar as informações de produtos (como preço e quantidade) e excluir itens do 
estoque. 
Essas ações devem atualizar tanto o array quanto o localStorage. 

- [ ] **Relatórios e Indicadores:**
A página de relatórios deve gerar estatísticas como: 
• Total de itens cadastrados; 
• Valor total do estoque (usando reduce()); 
• Produtos com quantidade abaixo do limite mínimo (alerta de reposição).

- [ ] **Persistência Local:**
Todos os dados devem ser salvos e carregados do localStorage, garantindo que as informações 
permaneçam disponíveis mesmo após o fechamento do navegador.

- [ ] **Feedback e Interatividade:**
Adicione feedback visual com alertas, mensagens temporárias e cores diferentes para ações 
como “sucesso”, “erro” e “estoque baixo”. 
Isso melhora a experiência do usuário e facilita o entendimento das ações executadas. 

