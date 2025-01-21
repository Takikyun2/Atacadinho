// Modal elements
const modal = document.getElementById('modal-sangria');
const openModalBtn = document.getElementById('openModal-sangria');
const closeModalBtn = document.getElementById('closeModal-sangria');

// Input elements
const valorInput = document.getElementById('valor-sangria');
const observacaoInput = document.getElementById('observacao-sangria');

// Open modal
openModalBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';

    // Limpa os valores dos inputs ao clicar em cancelar
    limparInputs();
});

// Close modal with ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.style.display = 'none';

        // Limpa os valores dos inputs ao pressionar ESC
        limparInputs();
    }
});

// Função para limpar os inputs
function limparInputs() {
    valorInput.value = '';
    observacaoInput.value = '';
}

// Atualiza a data e hora dinamicamente
function atualizarDataHora() {
    const now = new Date();

    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    const ano = now.getFullYear();

    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');
    const segundos = String(now.getSeconds()).padStart(2, '0');

    const dataHoraFormatada = `${dia} DE ${obterNomeMes(mes).toUpperCase()} DE ${ano} - HORÁRIO: ${horas}:${minutos}:${segundos}`;
    document.getElementById('dataHora-sangria').innerHTML = dataHoraFormatada;
}

function obterNomeMes(mes) {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return meses[parseInt(mes, 10) - 1];
}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();

// Lógica para garantir que só números sejam inseridos e adicionar 'R$' no input
// Atualiza o valor no input sempre que o usuário digitar
valorInput.addEventListener('input', function (event) {
    let value = event.target.value;

    // Remove tudo que não seja número
    value = value.replace(/\D/g, '');

    // Remove zeros à esquerda, mas mantém "0" caso o valor seja vazio
    value = value.replace(/^0+(?!$)/, '');

    // Adiciona zeros se necessário
    while (value.length < 3) {
        value = '0' + value;
    }

    // Formata o valor: separa as casas decimais com vírgula
    const formattedValue = value.slice(0, -2) + ',' + value.slice(-2);

    // Define o valor formatado no input
    event.target.value = formattedValue;
});

const btnCadSangria = document.getElementById('btn-cad-sangria');
btnCadSangria.addEventListener('click', async () => {

    const valorSangria = document.getElementById('valor-sangria').value.replace('.', '').replace(',', '.');
    const observacaoSangria = document.getElementById('observacao-sangria').value;

    const dadosCaixa = JSON.parse(sessionStorage.getItem('dadosCaixaAtual'));
    const idCaixa = dadosCaixa.idCaixa;

    const sangria = {
        caixa_id: idCaixa,
        valor_sangria: valorSangria,
        observacoes_sangria: observacaoSangria
    };

    try {
        const response = await window.api.adicionarRegistroDeSangria(sangria);

        if (response.sucesso) {
            alert('Sangria adicionada com sucesso!');
            modal.style.display = 'none';

            // Limpa os inputs após salvar
            limparInputs();
        }

    } catch (error) {
        console.log(error);
    }
});
