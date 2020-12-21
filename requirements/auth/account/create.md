# **Cadastro de usuário (Account)**

> ## Caso de sucesso

1. Recebe uma requisição do tipo **POST** na rota **/auth/account**
2. Valida se os dados obrigatórios (**name**, **email**, **password** e **password_confirmation**) foram enviados
3. Valida se o nome(**name**) informado possui ao menos 5 caractéres
4. Valida se o e-mail(**email) informado é um endereço de e-mail válido
5. Valida se a senha(**password**) informada possui ao menos 6 caractéres
6. Valida se a senha de confirmação (**password_confirmation**) é igual a senha(**senha**)
7. Verifica se já existe uma outra conta para o e-mail(**email**) informado
8. Criptografa a senha(**password**) informada
9. Salva uma nova conta de usuário(**account**)
10. Envia um e-mail de boas vindas para o e-mail informado 
	(O e-mail também possui um link para a ativação da conta do usuário(**acount**))
11. Retorna **201** com as informações da sessão de ativação da conta do usuário(**account**)