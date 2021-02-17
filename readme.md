# **Clean Node TS Clean Identity**

Projeto criado para praticar alguns conceitos da Clean Architecture e TDD com Node JS e TypeScript.
O projeto é uma Web API para controle de acesso, passando por cadastro de usuário, autenticação, atualização do usuário.
Aproveitei para implementar a ativação da conta do usuário através de link enviado por e-mail. E-mail enviado em segundo plano, através de uma fila de processamento. Também implementei o upload de imagem de avatar para a conta do usuário.

> ## Features / Casos de uso
### Conta de usuário (Account)
* Cadastro (CreateAccount)
* Atualização (UpdateAccount)
* Usuário logado (ShowAccount)
* Ativar conta (ActiveAccount)
* Esqueci minha senha (RequestRecoverPassword)
* Alterar senha (RecoverPassword)
* Definição do avatar (UplodaAvatarAccount)
* Exclusão do avatar (DeleteAvatarAccount)
* Visualizar avatar (ShowAvatarAccount)

### Sessão (Session)
* Autenticação do usuário (AuthenticationAccount)
* Logout (Logout)

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