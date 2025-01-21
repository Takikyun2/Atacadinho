const modalPagamento = document.getElementById('modal-pagamento');
const openModalPagamentoBtn = document.getElementById('openModal-pagamento');
const closeModalPagamentoBtn = document.getElementById('closeModal-pagamento');
const concluirPagamentoBtn = document.querySelector('.buttons-pagamento .abrir');

const modalConcluido = document.getElementById('modal-concluido');
const closeModalConcluidoBtn = document.getElementById('closeModal-concluido');

const valorPagarElement = document.getElementById('valorPagar');
const descontoPagarElement = document.getElementById('descontoPagar');
const trocoPagarElement = document.getElementById('trocoPagar');

const valorCompra = 80.38; // Valor original
const descontoPercentual = 2; // imposto KKKKKK
const desconto = (valorCompra * descontoPercentual) / 100;
const valorFinal = valorCompra - desconto;

valorPagarElement.textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
descontoPagarElement.textContent = `R$ ${valorCompra.toFixed(2).replace('.', ',')} - desconto de R$ ${desconto.toFixed(2).replace('.', ',')} (${descontoPercentual}%)`;

const inputsPagamento = document.querySelectorAll('#modal-pagamento input');
const erroElement = document.createElement('p');
erroElement.style.color = 'red';
erroElement.style.marginTop = '10px';
erroElement.style.display = 'none';
erroElement.textContent = 'Insira um valor válido e suficiente para concluir a compra.';
modalPagamento.querySelector('.content-pagamento').appendChild(erroElement);

// Abrir e fechar modal de pagamento
openModalPagamentoBtn.addEventListener('click', () => {
    modalPagamento.style.display = 'flex';
});

closeModalPagamentoBtn.addEventListener('click', () => {
    modalPagamento.style.display = 'none';
    resetInputs();
});

// Fechar modal de pagamento com ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalPagamento.style.display === 'flex') {
        modalPagamento.style.display = 'none';
        resetInputs();
    }
});

// Atualizar o troco ao inserir valores nos inputs
inputsPagamento.forEach(input => {
    input.addEventListener('input', () => {
        const totalPago = Array.from(inputsPagamento).reduce((sum, input) => {
            const valor = parseFloat(input.value.replace(',', '.')) || 0;
            return sum + valor;
        }, 0);

        const troco = totalPago - valorFinal;

        if (troco >= 0) {
            trocoPagarElement.textContent = `Troco: R$ ${troco.toFixed(2).replace('.', ',')}`;
            erroElement.style.display = 'none';
        } else {
            trocoPagarElement.textContent = 'Troco: R$ 0,00';
        }
    });
});

// Concluir pagamento
concluirPagamentoBtn.addEventListener('click', () => {
    const totalPago = Array.from(inputsPagamento).reduce((sum, input) => {
        const valor = parseFloat(input.value.replace(',', '.')) || 0;
        return sum + valor;
    }, 0);

    if (totalPago >= valorFinal) {
        const troco = totalPago - valorFinal;

        modalConcluido.querySelector('.valor-compra').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
        modalConcluido.querySelector('.valor-troco').textContent = `Troco: R$ ${(troco >= 0 ? troco : 0).toFixed(2).replace('.', ',')}`;

        modalPagamento.style.display = 'none';
        modalConcluido.style.display = 'flex';
        resetInputs();
    } else {
        erroElement.style.display = 'block';
    }
});

// Fechar modal de concluído
closeModalConcluidoBtn.addEventListener('click', () => {
    modalConcluido.style.display = 'none';
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalConcluido.style.display === 'flex') {
        modalConcluido.style.display = 'none';
    }
});

// Resetar inputs e mensagens
function resetInputs() {
    inputsPagamento.forEach(input => input.value = '');
    trocoPagarElement.textContent = 'Troco: R$ 0,00';
    erroElement.style.display = 'none';
}




