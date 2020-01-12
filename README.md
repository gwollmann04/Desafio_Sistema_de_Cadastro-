<h1>Backend simulando uma aplicação real similar a um sistema de controle de candidatos para vagas de empregos.</h1>
<p>Primeiramente para utilizar o sistema precisar instalar as dependencias, visto que node_modules não esta no repositorio. Pode ser feito usando "npm i"</p>
<p>Entao deve-se configurar o arquivo env_file, preencher todos campos de acordo com o ambiente local, e utilizar algum valor em          'authSecret', qualquer valor serve. Após isso renomear o arquivo para ".env"</p>
<p>Caso esteja usando um banco de dados que não seja mysql alter o valor do campo 'client' no arquivo 'knexfile.js'.</p>
<p>O programa esta rodando na porta 3000, isso pode ser alterado no arquivo index.js.</p>
<p>Todas migrations são feitas ao rodar o codigo com "npm start".</p>

<p>As rotas para utillização se encontram no arquivo "routes.js" na paste config, todos comentados para facilitar o uso.</p>
<p>Todas rotas são somente acessadas somente por quem ja esta logado no sistema, exceto '/signin', '/signup' e '/validateToken' que são        publicas.</p>
<p>O usuario após criar sua conta na rota '/signup' pode se logar no sistema através da rota '/signin', quando o fizer irá receber um token    que deverá usar para acessar todas as rotas que não são publicas.</p>
<p>Para usar o token bastar criar um header "Authorization" e colocar seu valor como "bearer 'token' " sem usar aspas simples no token</p>
<p>As contas são excluidas através de soft delete, logo ela permanece no banco de dados, mas não é listada nas contas da aplicação</p>

#### Funcionalidades:<br />
<ol>
<li>O usuário pode criar*, excluir**, editar e visualizar sua conta.</li>
<li>O usuário-admin pode criar, excluir***, editar e visualizar suas vagas.</li>
<li>O usuário-comum pode criar, excluir e visualizar suas candidaturas.</li>
<li>O usuário-admin pode criar, editar, excluir**** e visualizar comentarios em candidaturas feitas em suas vagas.</li>
<li>O usuário-admin pode excluir candidaturas feitas em suas vagas.</li>
</ol>

#### Restrições:<br />
<ol>
<li>O usuário-admin NÃO PODE se candidatar a vagas.</li>
<li>O usuário-comum NÃO PODE criar vagas nem comentar em candidaturas.</li>
<li>O usuário NÃO PODE excluir e editar a conta de outros usuários.</li>
<li>O usuário NÃO PODE excluir e editar as vagas de outros usuários.</li>
<li>O usuário NÃO PODE excluir e editar as candidaturas de outros usuários.</li>
<li>O usuário NÃO PODE excluir e editar os comentários de outros usuários.</li>
</ol>

<i>*Para que o usuario seja Admin precisa ao se cadastrar colocar a senha(valor) "123" no campo "admin", caso não preencha este campo sera automaticamente cadastrado como usuario comum.</i><br />
<i>**Ao excluir uma conta de usuario-admin todas as vagas criadas por ele são excluidas, assim como todas candidaturas a estas vagas.</i><br />
<i>**Ao excluir uma conta de usuario-comum todas as candidaturas feitas por ele são excluidas.</i><br />
<i>***Ao excluir uma vaga todas as candidaturas associadas são excluidas.</i><br />
<i>***Para apagar um comentario basta enviar um comentario em branco</i><br />

**Formato do json para cadastro: /signup**<br />
{<br />
    "name": "seu nome",<br />
    "email: "seu_email@email.com",<br />
    "phoneNumber: "0000-0000",<br />
    "cpf: "000000000-00",<br />
    "password": "sua senha",<br />
    "confirmPassword": "sua senha",<br />
    "admin": "123" (Caso seja usuario admin, caso contrario não precisa esse campo)<br />
}<br />

**Formato do json para login: /signin**<br />
{<br />
    "cpf: "000000000-00",<br />
    "password": "sua senha"<br />
}<br />

**Formato do json para postar uma vaga: /jobs**<br />
{<br />
    "jobName: "Nome da vaga"<br />
}<br />

**Formato do json para postar uma candidatura: /applications**<br />
{<br />
    "jobId: "Id da vaga"<br />
}<br />

## Favor informar eventuais bugs:
<strong> gwollmann04@gmail.com </strong>

