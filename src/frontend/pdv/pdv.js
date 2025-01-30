aberturaDeCaixa ();

const selectBusca = document.getElementById("select-busca-produto");

async function listarProdutos() {
    try {
      const produtosDB = await window.api.listarProdutos();
      inserirDadosSelectBuscaProdutos(produtosDB)
    }catch(error){
      console.error('Erro ao carregar Produtos:', error);
    }
}

async function buscarProdutosPorId(id) {
    try {
      const produtoDBPorId = await window.api.buscarProdutoPorId(id);
      return produtoDBPorId;
    }catch(error){
      console.error('Erro ao carregar Produto:', error);
    }
}

//insere dinamicamente as options do select com os produtos cadastrados no db
const inserirDadosSelectBuscaProdutos = (produtosDB) =>{

    const output = produtosDB.map(prod =>{
        const {id_produto, nome} = prod
        return `
            <option value="${id_produto}">${nome}</option>
        `
    }).join('');

    const optionPadrao = `
        <option value="" selected>Buscar produtos</option>
    `;
    selectBusca.innerHTML = optionPadrao + output
}

listarProdutos();

const inserirProdutoViaLeitorBarras = () => {
        // Captura de eventos do leitor de código de barras (via teclado)
    let barcode = "";
    let lastKeyTime = Date.now();

    document.addEventListener("keydown", async (event) => {
        const currentTime = Date.now();

        // Reseta se o intervalo entre teclas for grande
        if (currentTime - lastKeyTime > 100) {
            barcode = "";
        }

        if (event.key === "Enter" && barcode) {

            console.log(`Código capturado: ${barcode}`);

            try {
                const produtoDB = await window.api.buscarProdutosPorCodigo(barcode);
                console.log(produtoDB);
            
                if (produtoDB) {
                    const produto = produtoDB[0];
                    const {id_produto, nome, preco} = produto;

                // Verifica se o produto já está no array
                let produtoExistente = produtosVenda.find(produto => produto.produto_id === selectBusca.value);

                if (produtoExistente) {
                // Se existir, apenas aumenta a quantidade
                    produtoExistente.quantidade += 1;
                } else {
                    produtosVenda.push({
                        produto_id: id_produto,
                        nome: nome,
                        quantidade: 1,
                        preco: parseFloat(preco)
                    })
                }

                
                    console.log(produtosVenda);
                    atualizarTabela();
                }
            } catch (error) {
                console.error(error);
                toastr.error('Erro ao scanear o produto')
            }

            barcode = "";
            return;
        }

        // Ignora teclas de controle
        if (!event.ctrlKey && !event.altKey && !event.metaKey) {
            barcode += event.key;
        }

        lastKeyTime = currentTime;
    });

}



// Exemplo de lista de produtos
const produtosVenda = [
];

inserirProdutoViaLeitorBarras();


const formBusca = document.getElementById("busca-produto-form");

formBusca.addEventListener("submit", async (evento)=>{

    evento.preventDefault();
    const selectBuscaProduto = document.getElementById("select-busca-produto");
    const idProdutoSelecionado = selectBuscaProduto.value

    console.log(idProdutoSelecionado);
    

    if (!idProdutoSelecionado) {
        toastr.warning('Selecione um produto válido!');
        return;
    }

    const produtoPorId = await buscarProdutosPorId(idProdutoSelecionado);

    if (!produtoPorId) {
        toastr.error('Produto não encontrado!');
        return;
    }
    
    const { nome, preco } = produtoPorId
    
    
    const quantidadeProduto = document.getElementById("quantidadeProduto");

    if (!quantidadeProduto.value || quantidadeProduto.value <= 0) {
        quantidadeProduto.value = 1;
    }
    
     // Verifica se o produto já está no array
     let produtoExistente = produtosVenda.find(produto => produto.produto_id === selectBusca.value);

     if (produtoExistente) {
         // Se existir, apenas aumenta a quantidade
         produtoExistente.quantidade += parseInt(quantidadeProduto.value, 10);
     } else {
        // Se não existir, adiciona o produto ao array
        produtosVenda.push({
            produto_id: selectBusca.value,
            nome: nome,
            quantidade: parseInt(quantidadeProduto.value, 10),
            preco: parseFloat(preco)
        })
     }


    atualizarTabela();

    /* formBusca.reset(); */
    quantidadeProduto.value = "";
})


function atualizarTabela() {
    const tabelaCorpo = document.querySelector("tbody");
    tabelaCorpo.innerHTML = ""; 

    produtosVenda.forEach((produto, index) => {
        const total = (produto.quantidade * produto.preco).toFixed(2);

        produto.valor_total_produtos = total

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td id="quantidade-${index}">${produto.quantidade} X</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>R$ ${total}</td>
            <td>
                <a href="#" class="editar" onclick="editarProduto(${index})">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="#" class="excluir" onclick="removerProduto(${index})">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </td>
        `;

        tabelaCorpo.appendChild(linha);
    });

    atualizarFooter();
}

function removerProduto(index) {
    produtosVenda.splice(index, 1); 
    atualizarTabela(); 
}

function editarProduto(index) {
    const celulaQuantidade = document.getElementById(`quantidade-${index}`);
    const quantidadeAtual = produtosVenda[index].quantidade;
    
    const inputQuantidade = document.createElement("input");
    inputQuantidade.type = "number";
    inputQuantidade.value = quantidadeAtual;
    inputQuantidade.min = 1;
    
    celulaQuantidade.innerHTML = "";
    celulaQuantidade.appendChild(inputQuantidade);

    function salvarQuantidade() {
        const novaQuantidade = parseInt(inputQuantidade.value);
        if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
            produtosVenda[index].quantidade = novaQuantidade;
            atualizarTabela();
        } else {
            toastr.error('Quantidade inválida!');
            atualizarTabela();
        }
    }

    // Salva ao perder o foco (blur)
    inputQuantidade.addEventListener("blur", salvarQuantidade);

    // Salva ao pressionar "Enter"
    inputQuantidade.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            salvarQuantidade();
        }
    });

    // Dá foco automaticamente ao input ao ser criado
    inputQuantidade.focus();
    
}

function atualizarFooter() {
    const footer = document.querySelector(".resumo-vendas");
    
    const quantidadeTotalItens = produtosVenda.reduce((total, produto) => total + produto.quantidade, 0);
    const quantidadeProdutosDiferentes = produtosVenda.length;

    footer.innerHTML = `${quantidadeProdutosDiferentes} itens (Qtd: ${quantidadeTotalItens})`;

    // Calcular o valor total
    const valorTotal = produtosVenda.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2);

    // Atualizar o valor total na seção final
    const totalVendas = document.querySelector("#total-vendas-valor");
    totalVendas.innerHTML = ` ${valorTotal}`;
}

atualizarTabela();

//& ------------- MODAL FECHAR CAIXA ------------------------

const sobreposicaoModalFechamento = document.getElementById('sobreposicao-modal-fechamento');
const btnSimFechamento = document.getElementById('btn-sim-fechamento');
const btnNaoFechamento = document.getElementById('btn-nao-fechamento');
const abrirModalFechamento = document.getElementById('abrir-modal-fechamento');

// Abrir modal
abrirModalFechamento.addEventListener('click', () => {
    sobreposicaoModalFechamento.style.display = 'flex';
});

// Fechar modal ao clicar em "NÃO"
btnNaoFechamento.addEventListener('click', () => {
    sobreposicaoModalFechamento.style.display = 'none';
});

const modalFechamento = document.getElementById('modalFechamento');
// Fechar modal ao clicar em "SIM"
btnSimFechamento.addEventListener('click', async () => {
    //abrir modal de fechamento
    modalFechamento.style.display = "block";
    //fechar modal de aviso
    sobreposicaoModalFechamento.style.display = 'none';

});

// Fechar modal com ESC e confirmar com ENTER
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        sobreposicaoModalFechamento.style.display = 'none';
    }
    if (e.key === 'Enter' && sobreposicaoModalFechamento.style.display === 'flex') {
        toastr.success('Caixa fechado com sucesso!');
        sobreposicaoModalFechamento.style.display = 'none';
    }
});


function aberturaDeCaixa (){
        // Modal elements
    const modal = document.getElementById('modal-abertura');
    const btnAbrirCaixa = document.getElementById('btn-abrir-caixa');

    window.onload = () => {
        const caixaStatus = JSON.parse(sessionStorage.getItem('caixaEstaAberto'));
        
        // Se o caixa estiver fechado mostra o modal de abertura
        if (!caixaStatus || !caixaStatus.isOpen) {
            const inputValorAbertura = document.getElementById('valor-abertura');
            
            // Garantir que o modal esteja visível antes de focar
            modal.style.display = 'flex';

            // Adiciona o foco no campo de entrada
            if (inputValorAbertura) {
                inputValorAbertura.focus();
            }
        } else {
            modal.style.display = 'none';
        }
    }

    

    const dadosUser = JSON.parse(sessionStorage.getItem('dadosUser'));// pegando dados do user guardado na sessao


    ///* Abre modal e cadastra no DB o registro */
    btnAbrirCaixa.addEventListener('click', async ()=>{
        //pegando valor do input ja formatado
        const valorAberturaCaixa = document.getElementById('valor-abertura').value.replace('.', '').replace(',', '.');

        const caixa = {
            valor_inicial: valorAberturaCaixa,
            login_id : dadosUser.id_login
        }

        try {
            const result = await window.api.adicionarRegistroDeCaixa(caixa);

            
            if (result.sucesso) {
                //guarda o id do caixa que abriu na session storage
                sessionStorage.setItem('dadosCaixaAtual', JSON.stringify({ idCaixa: result.res.lastId}));

              toastr.success('Caixa aberto com sucesso! Seja bem vindo!');
              //esconde o modal
              modal.style.display = 'none';

              sessionStorage.setItem('caixaEstaAberto', JSON.stringify({ isOpen: true }));

            } else {
                toastr.error('Erro ao adicionar o registro de caixa!');
                console.log('Erro ao adicionar o registro de caixa: ' + result.erro);
            }
          } catch (error) {
            console.error('Erro ao adicionar o registro de caixa:', error);
            toastr.error('Erro ao adicionar o registro de caixa!');
          }
        
    })



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
        document.getElementById('dataHora-abertura').innerHTML = dataHoraFormatada;
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
    const valorInput = document.getElementById('valor-abertura');

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

    // Faz o input focar no valor para manter o 'R$' na frente quando o usuário começa a digitar
    valorInput.addEventListener('focus', function () {
        if (this.value === '') {
            this.value = 'R$ ';
        }
    });
}


//Concluir venda
/* ! Obs: a partir deste conteudo todo o codigo responsavel peça finalizacao da compra esta interligada com o arquivo pagamento.js  */



const btnConcluirVenda = document.getElementById('btn-concluir-venda')

const calculaValorFinal = ()=>{

    const valorCompra =  parseFloat(document.querySelector("#total-vendas-valor").textContent);


    const descontoPercentual = 0; 
    const desconto = (valorCompra * descontoPercentual) / 100;
    const valorFinal = valorCompra - desconto;

    

    return {valorFinal,desconto,descontoPercentual}
}

btnConcluirVenda.addEventListener('click', async ()=>{

    const inputsPagamento = document.querySelectorAll('#modal-pagamento input');

    console.log(produtosVenda);

    if(produtosVenda.length === 0){
        toastr.warning('Nenhum produto foi adicionado à venda!');
        return
    }
    // Calcular o valor total
    const valorTotalVenda = produtosVenda.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2);

    const dadosCaixa = JSON.parse(sessionStorage.getItem('dadosCaixaAtual'));

    const dadosUser = JSON.parse(sessionStorage.getItem('dadosUser'));// pegando dados do user guardado na sessao
    


    const venda = { 
        valor_total: valorTotalVenda, 
        descricao: "Nada", 
        caixa_id: dadosCaixa.idCaixa,
        login_id: dadosUser.id_login
    };
    
    //array de objetos com os tipos de pagamentos realizados na compra
    const tipoDePagamentoDaVenda = []

    inputsPagamento.forEach((inputValue, index) => {
        //se tiver valor no input mande para o array de tipos de pagamento da compra
        if(inputValue.value){
            tipoDePagamentoDaVenda.push({
                tipo_pagamento_id: index + 1, 
                valor: inputValue.value
            })
        }
    })
    console.log(tipoDePagamentoDaVenda);
    
    

    const totalPago = Array.from(inputsPagamento).reduce((sum, input) => {
        const valor = parseFloat(input.value.replace(',', '.')) || 0;
        return sum + valor;
    }, 0);
    
    const { valorFinal } = calculaValorFinal();
    
    //verifica se o valor inserido nos inputs sao maiores que o debido atual se nao for mostra a mensagem de erro

    if (totalPago >= valorFinal) {
        const troco = totalPago - valorFinal;

        modalConcluido.querySelector('.valor-compra').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
        modalConcluido.querySelector('.valor-troco').textContent = `Troco: R$ ${(troco >= 0 ? troco : 0).toFixed(2).replace('.', ',')}`;
        
    } else {
        erroElement.style.display = 'block';
    }


   

    try {
        const result = await window.api.adicionarRegistrosDeVendas(venda, produtosVenda, tipoDePagamentoDaVenda);
        if (result.sucesso) {
            toastr.success('Registro de compra cadastrada com sucesso');
            produtosVenda.length = 0; //limpa o array de produtos
            atualizarTabela()

            modalPagamento.style.display = 'none';
            modalConcluido.style.display = 'flex';
            resetInputs();
        } else {
            toastr.error('Erro ao adicionar o registro de venda');
            console.error('Erro ao adicionar o registro de venda: ' + result.erro);
        }
      } catch (error) {
        console.error('Erro ao adicionar o registro de venda:', error);
        toastr.error('Erro ao adicionar o registro de venda');
      }
})
