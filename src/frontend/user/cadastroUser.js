const btnCad = document.getElementById('btn-cad');

btnCad.addEventListener('click', async ()=>{

    const nome = document.getElementById('campo-nome-completo').value;
    const usuario = document.getElementById('campo-usuario').value;
    const senha = document.getElementById('campo-senha').value;
    const cargo = document.getElementById('campo-cargo').value;
    const cpf = document.getElementById('campo-cpf').value;

    if(!nome || !usuario || !senha || !cargo || !cpf){
        toastr.warning('Preencha todos os campos!');
        return
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
            console.log('Erro ao cadastrar o Login: ' + result.erro);
          }
    } catch (error) {
        console.log(error);
    }
} 


function redirectToLogin() {
    window.location.href = "../../../src/views/user/login.html";
}
