const formLogin = document.getElementById('form-login');
formLogin.addEventListener('submit', (event)=>{
    event.preventDefault();

    const  usuario = document.getElementById('usuario').value;
    const  senha = document.getElementById('senha').value;

    if (!usuario || !senha) {
        toastr.warning('Preencha todos os campos');
        return
    }

    if (usuario.length < 3) {
        toastr.warning('O nome de usuário deve ter pelo menos 3 caracteres!');
        document.getElementById('usuario').style.borderColor = 'red';
        document.getElementById('usuario').focus();
        return;
    } else {
        document.getElementById('usuario').style.borderColor = '';
    }

    if (senha.length < 6) {
        toastr.warning('A senha deve ter pelo menos 6 caracteres!');
        document.getElementById('senha').style.borderColor = 'red';
        document.getElementById('senha').focus();
        return;
    }

    validaLogin({
        user: usuario,
        senha: senha
    })

})

const validaLogin = async (login) => {
    try {
        const resultado = await window.api.validarLogin(login);

        if (!resultado) {
            toastr.error('Login ou senha inseridos incorretamente')
            return
        }

        sessionStorage.setItem('dadosUser', JSON.stringify(resultado));
        
        window.location.href = "../../../src/views/pdv/pdv.html";
    } catch (error) {
        console.log("Erro na comunicação IPC:", error);
    }
};
