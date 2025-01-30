const formLogin = document.getElementById('form-login');
formLogin.addEventListener('submit', (event)=>{
    event.preventDefault();

    const  usuario = document.getElementById('usuario').value;
    const  senha = document.getElementById('senha').value;

    if (!usuario || !senha) {
        toastr.warning('Preencha todos os campos');
        return
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
