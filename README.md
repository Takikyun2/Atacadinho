# Atacadinho

<h3> Projeto feito em equipe pela turma de desenvolvimento de sistemas do Senac.</h3>

<h4>Este projeto tem a finalidade de atender outra turma, com um sistema de gerenciamento de caixa, o projeto é feito em electron.</h4>

<ul>
<h4>obs:</h4>
<li><p>Sempre que fizer uma feature lembre-se de usar sua própria branch, so depois de testar e ter certeza que está funcionando tudo perfeitamento você pode mandar para main branch.</p></li> 
<li><p>Não esqueça de fazer comentarios no seu codigo e explicando como ele funciona ou o por que de alguma alteração que você tenha feite, e não esqueça de colocar o seu nome para tirar qualquer duvida diretamente com você.</p></li>
<li><p>Qualquer dúvida pode perguntar a alguém que tenha mais conhecimento que você, perguntar não machuca, não tenha medo!</p></li>
</ul>

<h4>Stack: node.js, javascript, css, html, bootstrap</h4>
<p>obs: programa feito em electron</p>

# Usando o Git e Github no projeto

<h2>Como clonar o repositorio ?</h2>

<ul>
  <li>Primeiro passo: <p>Dentro do vscode abra a pasta em que voce quer clonar o projeto e abra o terminal</p></li>
  <li>Segundo passo: <p>Com o terminal aberto digite o seguinte: <code>git clone https://github.com/Takikyun2/Atacadinho.git</code></p>
    <p>Se voce nao estiver logado no github, uma janela de login sera aberta preencha os campos com seus dados e retorne ao vs code e espere ate que o precesso seja terminado</p>
    <p>Caso tudo tenha dado certo voce tera o projeto na raiz da sua pasta</p>
    <p>Agora abra a pasta do projeto usando <code>cd Atacadinho</code> e instale as dependencias do projeto usando <code> npm i </code> </p>
  </li>
</ul>

<h2>O que são branches e como criar uma ?</h2>

<p>As branches são maneiras de trabalhar em funcionalidades novas ou correções sem mexer diretamente no código principal. É como ter vários universos paralelos do seu projeto onde você pode experimentar à vontade!</p>
<p>De forma resumida as braches sao ramificações do codigo principal que podem ser alteradas sem afetar o mesmo</p>

<p>Criando uma branch:</p>

<ul>
  <li>No terminal ja dentro da pasta Atacadinho digite: <code>git checkout -b [Seu nome ou nome da branch]</code></p>
    <p>Exemplo: <code>git checkout -b Goku</code></p>
  </li>
</ul>

<h2>Como acessar sua branch?</h2>
<p>no terminal digite: <code>git checkout [nome da sua branch]</code></p>

<h2>Faça mudanças e faça o commit delas</h2>
<ul>
  <li><p>Logo apois fazer alteracoes no codigo acesse o terminal e digite <code>git status</code> para ver todas as alteracoes feitas por voce no projeto</p></li>
  <li><p>Adicione essas alterações na branch que você acabou de criar usando o comando: <code>git add .</code></p></li>
  <li><p>Agora, confirme essas alterações usando o comando: <code>git commit -m "Breve descricao o que voce alterou o que fez de novo etc..."</code> </p> </li>
</ul>

<h2>Envie suas alteracoes para sua branch no github</h2>

<ul>
  <li><p>Para enviar as alterações para o GitHub, precisamos identificar o nome do repositório remoto usando <code>git remote</code></p>
    <img src="https://www.freecodecamp.org/portuguese/news/content/images/2023/05/remote.png" width="500"/>
    <p>nesse exemplo o nome do repositório remoto é "origin"</p>
  </li>
  <li>
    <p>Depois de identificar o nome do repositório remoto, podemos enviar/fazer um push com segurança essas alterações para o GitHub usando <code>git push origin [Nome da sua branch]</code>
    </p>
    <p>Exemplo: <code>git push origin goku</code></p>
  </li>
</ul>

<h2>Criando o pull request</h2>

<p>Vá para o seu repositório no GitHub e você verá um botão dizendo "Compare & pull request". Clique nele e sucesso.</p>

<h2>Atualizando minha branch com os codigos da branch principal usando Pull</h2>

<p>Digamos que voce queira pegar os codigos principais e atualizar sua branch. No terminal digite: <code>git pull origin master</code></p>

<h4>Para mais informações acesse e se vire: https://www.freecodecamp.org/portuguese/news/como-fazer-o-seu-primeiro-pull-request-no-github/</h4>
