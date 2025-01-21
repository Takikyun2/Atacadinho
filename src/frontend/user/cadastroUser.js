const btnCad = document.getElementById('btn-cad');

btnCad.addEventListener('click', ()=>{

    const nome = document.getElementById('campo-nome-completo').value;
    const usuario = document.getElementById('campo-usuario').value;
    const senha = document.getElementById('campo-senha').value;
    const cargo = document.getElementById('campo-cargo').value;
    const cpf = document.getElementById('campo-cpf').value;

    if(!nome || !usuario || !senha || !cargo || !cpf){
        alert('Preencha todos os campos');
        return
    }

    const login = { 
        nomeCompleto: nome, 
        user: usuario, 
        senha: senha, 
        cpf: cpf, 
        user_type_id: cargo
    }

    adicionarLogin(login)

})

const adicionarLogin = async (login) => {
    try {
        const result = await window.api.adicionarLogin(login)
        if (result.sucesso) {
            alert('Login adicionado com sucesso!');
            window.location.href = "../../../src/views/user/login.html";
          } else {
            alert('Erro ao adicionar o Login: ' + result.erro);
          }
    } catch (error) {
        console.log(error);
    }
} 