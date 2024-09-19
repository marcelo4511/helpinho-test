Primeiramente, muito obrigado pela oportunidaade de fazer parte do processo seletivo

De acordo com os tópicos irei fazer comentários a respeito

OBS: deixei alguns comentários ao decorrer do código para melhor entendimento, infelizmente não consegui deixar meu código melhor pela pouca experiência nas ferramentas, mas acredito que com o passar dos dias a tendencia é melhorando

Esperamos as funcionalidades:

1. **Página de Listagem de Helpinhos**:

   - Listar todos os helpinhos criados. -> feito versão off para a página landing e on para a home (após logado)
   - Função de pesquisa (opcional ter filtros e ordenação). -> feito na parte do frontend

2. **Página de Criação de Helpinho**:

   - Validação de formulário. -> feito validação tando front como back

   - Campos obrigatórios: foto, título, descrição, meta, nome do criador, categoria, prazo e informações bancárias. -> não foi feito imagem e nem informações bancárias

   - Confirmação de envio e redirecuionar para o helpinho criado. -> redireciona para a página home

3. **Página de Visualização de Helpinho**:

   - Mostrar todos os dados não sensíveis do helpinho e do criador. -> está mostrando a solicitação do helpinho

   - Mostrar valores recebidos até o momento (opcional realtime). -> está mostrando os valores como "Total arrecadado", infelizmente não está em reaitime

4. **Página de Autenticação**:

   - Tela de login e cadastro. -> feito
   - Validação de formulário. -> feito

   - Seguração de dados do usuário. -> feito, mostra os dados do usuário e ele pode ver os helpinhos dos outros para que ele possa ajudar

### BackEnd:

- **Serverless** utilizando **AWS** -> infelizmnte não foi possível, foi feito com SERVERLESS OFFLINE e MYSQL

  Configurei migrations com a bibioteca knex

  Para rodar as migrations é o comando = npx knex migrate:latest

Esperamos as funcionalidades:

1. **CRUD de Usuário**:

   - Nome, telefone, email e senha. -> ok

2. **CRUD de Solicitação de Help**:

   - Imagem, meta, descrição, título e solicitante. -> só imagem não foi possível

3. **CRUD de Help Realizado**:

   - Solicitação, valor e doador. -> feito

OBS: infelizmente esse teste não contemplou testes unitários
