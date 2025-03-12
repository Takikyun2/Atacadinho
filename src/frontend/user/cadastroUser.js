document.getElementById('campo-cpf').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

const btnCad = document.getElementById('btn-cad');

btnCad.addEventListener('click', async ()=>{

    const nome = document.getElementById('campo-nome-completo').value;
    const usuario = document.getElementById('campo-usuario').value;
    const senha = document.getElementById('campo-senha').value;
    const cargo = document.getElementById('campo-cargo').value;
    const cpf = document.getElementById('campo-cpf').value;
    const confirmarSenha = document.getElementById('campo-confirme-senha').value;

    if(!nome || !usuario || !senha || !cargo || !cpf){
        toastr.warning('Preencha todos os campos!');
        return
    }

    if (nome.length < 3) {
        toastr.warning('O nome deve ter pelo menos 3 caracteres!');
        document.getElementById('campo-nome-completo').style.borderColor = 'red';
        document.getElementById('campo-nome-completo').focus();
        return;
    } else {
        document.getElementById('campo-nome-completo').style.borderColor = '';
    }

    if (usuario.length < 3) {
        toastr.warning('O nome de usuário deve ter pelo menos 3 caracteres!');
        document.getElementById('campo-usuario').style.borderColor = 'red';
        document.getElementById('campo-usuario').focus();
        return;
    } else {
        document.getElementById('campo-usuario').style.borderColor = '';
    }

    if (senha.length < 6) {
        toastr.warning('A senha deve ter pelo menos 6 caracteres!');
        document.getElementById('campo-senha').style.borderColor = 'red';
        document.getElementById('campo-senha').focus();
        return;
    } else {
        document.getElementById('campo-senha').style.borderColor = '';
    }

    if (senha !== confirmarSenha) {
        toastr.warning('As senhas devem ser iguais!');
        document.getElementById('campo-confirme-senha').style.borderColor = 'red';
        document.getElementById('campo-confirme-senha').focus();
        return;
    } else {
        document.getElementById('campo-confirme-senha').style.borderColor = '';
    }

    if (cpf.length < 14) {
        toastr.warning('O CPF deve ter 11 caracteres!');
        document.getElementById('campo-cpf').style.borderColor = 'red';
        document.getElementById('campo-cpf').focus();
        return;
    }


    const login = { 
        nomeCompleto: nome, 
        user: usuario, 
        senha: senha,
        cpf: cpf, 
        user_type_id: cargo
    }
    
    const response = await window.api.listarLogins()

    const  isUsernameAlreadyExists = response.find( l => l.user === login.user)

    if (isUsernameAlreadyExists) {
        toastr.error("Este nome de usuário já está em uso. Por favor, tente novamente.")
        return
    }

    adicionarLogin(login)

})

const adicionarLogin = async (login) => {
    try {
        const result = await window.api.adicionarLogin(login)
        if (result.sucesso) {

            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-center",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": 0, // Sem tempo limite
                "extendedTimeOut": 0, // Sem tempo adicional
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
                "tapToDismiss": false // Não fechar ao clicar no toast
            };

            toastr["success"](
                `Deseja voltar à tela de login?<br /><br />
                 <button type="button" class="btn clear" onclick="redirectToLogin()">Yes</button>`,
                "Login cadastrado com sucesso"
            );

          } else {
            toastr.error('Erro ao cadastrar login!');
            console.error('Erro ao cadastrar o Login: ' + result.erro);
          }
    } catch (error) {
        console.error(error);
    }
} 


function redirectToLogin() {
    window.location.href = "../../../src/views/user/login.html";
}
