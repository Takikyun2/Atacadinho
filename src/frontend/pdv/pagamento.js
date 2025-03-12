const modalPagamento = document.getElementById('modal-pagamento');
const openModalPagamentoBtn = document.getElementById('openModal-pagamento');
const closeModalPagamentoBtn = document.getElementById('closeModal-pagamento');
const concluirPagamentoBtn = document.querySelector('.buttons-pagamento .abrir');

const modalConcluido = document.getElementById('modal-concluido');
const closeModalConcluidoBtn = document.getElementById('closeModal-concluido');

const valorPagarElement = document.getElementById('valorPagar');
const descontoPagarElement = document.getElementById('descontoPagar');
const trocoPagarElement = document.getElementById('trocoPagar');


/* const inputsPagamento = document.querySelectorAll('#modal-pagamento input'); */

const erroElement = document.createElement('p');
erroElement.style.color = 'red';
erroElement.style.marginTop = '10px';
erroElement.style.display = 'none';
erroElement.textContent = 'Insira um valor válido e suficiente para concluir a compra.';
modalPagamento.querySelector('.content-pagamento').appendChild(erroElement);


// Abrir e fechar modal de pagamento
openModalPagamentoBtn.addEventListener('click', () => {

    if (!produtosVenda.length) {
        toastr.warning('Adicione produtos para concluir a venda.');
        return;  
    }

    modalPagamento.style.display = 'flex';

    const valorCompra =  parseFloat(document.querySelector("#total-vendas-valor").textContent);

    const {valorFinal, desconto, descontoPercentual} = calculaValorFinal();

    valorPagarElement.textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
    descontoPagarElement.textContent = `R$ ${valorCompra.toFixed(2).replace('.', ',')} - desconto de R$ ${desconto.toFixed(2).replace('.', ',')} (${descontoPercentual}%)`;

    calcularDesconto(valorFinal)

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




const calcularDesconto = (valorFinal) => {

    const inputsPagamento = document.querySelectorAll('#modal-pagamento input');

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
}



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
    const inputsPagamento = document.querySelectorAll('#modal-pagamento input');
    inputsPagamento.forEach(input => input.value = '');
    trocoPagarElement.textContent = 'Troco: R$ 0,00';
    erroElement.style.display = 'none';
}

const listarTiposDePagamentos = async () =>{
    try {
        const tipoPagamentos = await window.api.listarTiposDePagamentos();
        
        const outputTiposPagamento = tipoPagamentos.map(
            tp => {

            return `
                <div class="forma-item">
                    <span>${tp.descricao}</span>
                    <input type="number" id="${tp.id_tipo_pagamento}" placeholder="0,00">
                </div>
            `;
        })
        .join(''); // Une todos os elementos do array em uma única string
        
        const formaPagamentoDiv = document.getElementById('forma-pagamento');

        formaPagamentoDiv.innerHTML = outputTiposPagamento;
        
    } catch (error) {
        console.error(error);
    }
}

listarTiposDePagamentos()



