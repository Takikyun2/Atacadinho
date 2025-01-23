/* const modalFechamento = document.getElementById('modalFechamento'); */
const abrirModalBtn = document.getElementById('abrirModalBtn');
const fecharModalBtn = document.getElementById('fecharModalBtn');
const botaoCancelar = document.querySelector('.btn.btn-cancelar'); 
const checkboxes = document.querySelectorAll('.grupo-checkbox input'); 

const btnFecharCaixa = document.getElementById('btn-fechar-caixa');

btnFecharCaixa.addEventListener('click', async ()=>{

  const dadosUser = JSON.parse(sessionStorage.getItem('dadosUser'));// pegando dados do user guardado na sessao
  
  const valorFinalCaixa = document.getElementById('valor-fechamento').value.replace('.', '').replace(',', '.');

  try {
        const result = await window.api.atualizarUltimoRegistroCaixaAberto({
          valor_final: valorFinalCaixa,
          login_id : dadosUser.id_login
        });

        if (result.sucesso) {
            toastr.success('Caixa fechado com sucesso!');
            //esconde o modal
            modalFechamento.style.display = "none";
            //atualiza o storage para informar que o caixa esta fechado e assim abrir o modal de abertura novamente
            sessionStorage.setItem('caixaEstaAberto', JSON.stringify({ isOpen: false }));

            window.location.href = "../../../src/views/user/login.html";

          } else {
            toastr.error('Erro ao atualizar o registro de caixa');
            console.log('Erro ao atualizar o registro de caixa: ' + result.erro);
          }

    } catch (error) {
        console.log(error);
    }
})


function atualizarDataHora() {
  const dataHoraElemento = document.getElementById('dataHora');
  const agora = new Date();

  const dataFormatada = agora.toLocaleDateString('pt-BR', {
    day: '2-digit',   
    month: 'long',    
    year: 'numeric'   
  });

  const horarioFormatado = agora.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Atualiza o conteúdo do elemento
  dataHoraElemento.textContent = `${dataFormatada.toUpperCase()} - HORÁRIO: ${horarioFormatado}`;
}

// Atualiza a data e o horário a cada segundo
setInterval(atualizarDataHora, 1000);
atualizarDataHora();

// Lógica do modal



// Fechar o modal ao clicar no 'X'
fecharModalBtn.onclick = function() {
  modalFechamento.style.display = "none";
}

// Fechar o modal ao clicar fora da área do conteúdo
window.onclick = function(evento) {
  if (evento.target == modalFechamento) {
    modalFechamento.style.display = "none";
  }
}

// Fechar o modal e desmarcar todos os checkboxes ao clicar no botão "Cancelar"
botaoCancelar.onclick = function() {
  // Desmarcar todos os checkboxes
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });

  /* // Fechar o modal
  modalFechamento.style.display = "none"; */
}

// Lógica para garantir que só números sejam inseridos e adicionar 'R$' no input
const valorFechamentoInput = document.getElementById('valor-fechamento');

// Atualiza o valor no input sempre que o usuário digitar
valorFechamentoInput.addEventListener('input', function (event) {
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

// Faz o input focar no valor para manter o 'R$' na frente quando o usuário começa a digitar
valorFechamentoInput.addEventListener('focus', function () {
    if (this.value === '') {
        this.value = 'R$ ';
    }
});
