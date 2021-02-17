# **Clean Node TS Clean Identity**

Projeto criado para praticar alguns conceitos da Clean Architecture e TDD com Node JS e TypeScript.
O projeto é uma Web API para controle de acesso, passando por cadastro de usuário, autenticação, atualização do usuário.
Aproveitei para implementar a ativação da conta do usuário através de link enviado por e-mail. E-mail enviado em segundo plano, através de uma fila de processamento. Também implementei o upload de imagem de avatar para a conta do usuário.

> ## Features e Rotas
### Conta de usuário (Account)
|Método|Rota|Use Case|Descrição|
|:---:|---|---|---|
|POST|/api/auth/account/|CreateAccount|Criação de uma nova conta de usuário|
|PUT|/api/auth/account/ :lock:|UpdateAccount|Atualização das informações da conta do usuário autenticado|
|GET|/api/auth/account/ :lock:|ShowAccount|Retorna as informações da conta do usuário autenticado|
|PUT|/api/auth/account/active/:session_id|ActiveAccount|Ativa a conta do usuário da sessão recebida|
|POST|/api/auth/account/password|RequestRecoverPassword|Solicita a recuperação de senha (As instruções são enviadas para o e-mail informado)|
|PUT|/api/auth/account/password|RecoverPassword|Altera a senha da conta da sessão informada|
|PUT|/api/auth/account/avatar :lock:|UplodaAvatarAccount|Atualiza a imagem de avatar do usuário logado|
|DELETE|/api/auth/account/avatar :lock:|DeleteAvatarAccount|Exclui a imagem de avatar do usuário logado|
|GET|/api/auth/account/avatar/:account_id|ShowAvatarAccount|Exibe a imagem de avatar do usuário informado(Se o usuário não tiver um avatar definido, será exibido um avatar padrão)|

### Sessão (Session)
|Método|Rota|Use Case|Descrição|
|:---:|---|---|---|
|POST|/api/auth/session/|AuthenticationAccount|Autenticação do usuário(Login)|
|DELETE|/api/auth/session/ :lock:|Logout|Invalida a sessão do usuário autenticado(Logout)|

> ## Bibliotecas e ferramentas

* Docker
  * [RabbitMQ - Gerenciador de filas de processo](https://www.rabbitmq.com/)
  * [PostgreSQL - SGDB para armazenar os dados em banco de dados relacional](https://www.postgresql.org/)
  * [Redis - Gerenciador do cache da aplicação](https://redis.io/)
* Segurança
  * [BCrypt - Implementação de um dos mais utilizados algoritimos de criptografia](https://www.npmjs.com/package/bcrypt)
  * [JsonWebToken - Controle de sessão de acesso sem a necessidade de recursos de memória no servidor](https://www.npmjs.com/package/jsonwebtoken)
* Testes
  * [Jest - Lib para testes unitários / integração](https://jestjs.io/)
  * [Faker - Gerador de informações aleatórios para auxilio nos testes](https://www.npmjs.com/package/faker)
  * [Supertest - Teste de integração end-to-end](https://www.npmjs.com/package/supertest)
* Envio de e-mail
  * [Nodemailer - Gerenciador de e-mails](https://nodemailer.com/about/)
* Documentação e padrão de código
  * [Eslint - Lib para garantir a padronização de código](https://www.npmjs.com/package/eslint)
  * [Standard JS - Padrão utilizado no desenvolvimento](https://standardjs.com/)
  * [Swagger - Documentação dos métodos da API](https://swagger.io/)