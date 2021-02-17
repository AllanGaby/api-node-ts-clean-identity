# **Clean Node TS Clean Identity**

Projeto criado para praticar alguns conceitos da Clean Architecture e TDD com Node JS e TypeScript.
O projeto é uma Web API para controle de acesso, passando por cadastro de usuário, autenticação, atualização do usuário.
Aproveitei para implementar a ativação da conta do usuário através de link enviado por e-mail. E-mail enviado em segundo plano, através de uma fila de processamento. Também implementei o upload de imagem de avatar para a conta do usuário.

> ## Features e Rotas
### Conta de usuário (Account)
|Método|Rota|Use Case|Descrição|
|:---:|---|---|---|
|POST|/api/auth/account/|CreateAccount|Criação de uma nova conta de usuário|
|PUT :lock:|/api/auth/account/|UpdateAccount|Atualização das informações da conta do usuário autenticado|
|GET :lock:|/api/auth/account/|ShowAccount|Retorna as informações da conta do usuário autenticado|
|PUT|/api/auth/account/active/:session_id|ActiveAccount|Ativa a conta do usuário da sessão recebida|
|POST|/api/auth/account/password|RequestRecoverPassword|Solicita a recuperação de senha (As instruções são enviadas para o e-mail informado)|
|PUT|/api/auth/account/password|RecoverPassword|Altera a senha da conta da sessão informada|
|PUT :lock:|/api/auth/account/avatar|UplodaAvatarAccount|Atualiza a imagem de avatar do usuário logado|
|DELETE :lock:|/api/auth/account/avatar|DeleteAvatarAccount|Exclui a imagem de avatar do usuário logado|
|GET|/api/auth/account/avatar/:account_id|ShowAvatarAccount|Exibe a imagem de avatar do usuário informado(Se o usuário não tiver um avatar definido, será exibido um avatar padrão)|

### Sessão (Session)
|Método|Rota|Use Case|Descrição|
|:---:|---|---|---|
|POST|/api/auth/session/|AuthenticationAccount|Autenticação do usuário(Login)|
|DELETE :lock:|/api/auth/session/|Logout|Invalida a sessão do usuário autenticado(Logout)|

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

> ## Variáveis de ambiente
```
Todas as variáveis de ambiente podem ter seu valor alterado no arquivo /src/main/config/env.ts
```

|Variável|Descrição|Valor padrão|
|:---|---|---|
|PORT|Porta que a aplicação deve rodar|3333|
|URL_RABBITMQ|URL para integração com o RabbitMQ|amqp://identity:masterkey@localhost:5672|
|BASEDIR|Diretório base para a execução da aplicação(Usado para definir o path das views do e-mail)|src|
|REPOSITORY_TYPE|Tipo de repositório (TypeORM / Memory)|Memory * Significa que as informações não são salvas em um banco de dados, mas sim em memória|
|REPOSITORY_TYPE|Tipo de cache (Redis / Memory)|Memory * O Cache fica salvo apenas em memória|
|JWT_SECRET|Chave para a geração do JWT|01c383ef-b869-43f6-a60a-7b0c1b161d3b|
|AUTH_TOKEN_NAME|Nome do token de acesso que deve ser passado nas rotas autenticadas|x-access-token|
|UPLOAD_AVATAR_DIR|Diretório para o upload definitivo das imagens de avatar do usuário|uploads/auth/avatar/|
|DEFAULT_USER_NAME|Nome do usuário padrão(Criado quando a aplicação foi iniciada)|identity|
|DEFAULT_USER_EMAIL|Endereço de e-mail do usuário padrão|identity@identity.com|
|DEFAULT_USER_PASSWORD|Senha de acesso do usuário padrão(Deve ser a senha criptografada)|$2b$12$YWnAIp/iCkQqSk0cLaRrz.noakEhyzvoKNlIcs6UVeTGy7TXGyQ/2|
|SMTP_HOST|Servidor SMTP usado para o envio dos e-mails da aplicação|smtp.ethereal.email|
|SMTP_PORT|Porta do servidor SMTP|587|
|SMTP_SECURE|Define se o servidor SMTP utiliza conexão segura|false|
|SMTP_USER|E-mail usado para a autenticação no servidor SMTP|sammy.gutmann2@ethereal.email|
|SMTP_PASS|Senha para autenticação no servidor SMTP|6FRHEGTxfJXwt1t5u6|
|REDIS_HOST|Servidor do Redis Cache|localhost|
|REDIS_PORT|Porta do servidor Redis Cache|6379|
|REDIS_PASSWORD|Senha de autenticação do Redis Cache|undefined|

> ## Scripts
|Script|Descrição|
|:---|---|
|test|Executa todos os testes da aplicação|
|test:staged|Executa o testes em todos os arquivos alterados e relacionados a eles|
|test:ci|Executa todos os testes e gera o relatório de cobertura|
|build|Apaga o diretório dist e recompila a aplicação|
|build:watch|Executa o build a cada alteração salva|
|dev:server|Sobe o servidor da aplicação|
|typeorm|Atalho para a execução dos comandos do TypeOrm|