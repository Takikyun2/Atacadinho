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

// Exemplo de lista de produtos
const produtosVenda = [
];

const formBusca = document.getElementById("busca-produto-form");

formBusca.addEventListener("submit", async (evento)=>{

    evento.preventDefault();

    const idProdutoSelecionado = selectBusca.value

    if (!idProdutoSelecionado) {
        alert("Selecione um produto válido!");
        return;
    }

    const produtoPorId = await buscarProdutosPorId(idProdutoSelecionado);

    if (!produtoPorId) {
        alert("Produto não encontrado!");
        return;
    }
    
    const { nome, preco } = produtoPorId
    
    
    const quantidadeProduto = document.getElementById("quantidadeProduto");

    if (!quantidadeProduto.value || quantidadeProduto.value <= 0) {
        quantidadeProduto.value = 1;
    }
    

    produtosVenda.push({
        produto_id: selectBusca.value,
        nome: nome,
        quantidade: parseInt(quantidadeProduto.value, 10),
        preco: parseFloat(preco)
    })

    atualizarTabela();

    /* formBusca.reset(); */
    quantidadeProduto.value = "";
    selectBusca.value = "";
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

    inputQuantidade.addEventListener("blur", () => {
        const novaQuantidade = parseInt(inputQuantidade.value);
        if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
            produtosVenda[index].quantidade = novaQuantidade;
            atualizarTabela();
        } else {
            alert("Quantidade inválida!");
            atualizarTabela();
        }
    });
}

function atualizarFooter() {
    const footer = document.querySelector(".resumo-vendas");
    
    const quantidadeTotalItens = produtosVenda.reduce((total, produto) => total + produto.quantidade, 0);
    const quantidadeProdutosDiferentes = produtosVenda.length;

    footer.innerHTML = `${quantidadeProdutosDiferentes} itens (Qtd: ${quantidadeTotalItens})`;

    // Calcular o valor total
    const valorTotal = produtosVenda.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2);

    // Atualizar o valor total na seção final
    const totalVendas = document.querySelector("#total-vendas");
    totalVendas.innerHTML = `Total = R$ ${valorTotal}`;
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

    /* alert('Caixa fechado com sucesso!'); */
    /* sobreposicaoModalFechamento.style.display = 'none'; */
});

// Fechar modal com ESC e confirmar com ENTER
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        sobreposicaoModalFechamento.style.display = 'none';
    }
    if (e.key === 'Enter' && sobreposicaoModalFechamento.style.display === 'flex') {
        alert('Caixa fechado com sucesso!');
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
            modal.style.display = 'flex';
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

              alert('Registro cadastrado com sucesso');
              //esconde o modal
              modal.style.display = 'none';

              sessionStorage.setItem('caixaEstaAberto', JSON.stringify({ isOpen: true }));

            } else {
              alert('Erro ao adicionar o registro de caixa: ' + result.erro);
            }
          } catch (error) {
            console.error('Erro ao adicionar o registro de caixa:', error);
            alert('Erro ao adicionar o registro de caixa.');
          }
        
    })


    /* // Close modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';

        // Limpa o valor do input ao clicar em cancelar
        valorInput.value = '';
    });

    // Close modal with ESC key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.style.display = 'none';

            // Limpa o valor do input ao pressionar ESC
            valorInput.value = '';
        }
    }); */

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

const btnConcluirVenda = document.getElementById('btn-concluir-venda')

btnConcluirVenda.addEventListener('click', async ()=>{
    console.log(produtosVenda);
    

    if(produtosVenda.length === 0){
        alert('Nenhum produto foi adicionado à venda.');
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

    const tipoDePagamentoDaVenda = [{
        tipo_pagamento_id: 3, 
        valor: 500.00
    }]


   

    try {
        const result = await window.api.adicionarRegistrosDeVendas(venda, produtosVenda, tipoDePagamentoDaVenda);
        if (result.sucesso) {
          alert('Registro cadastrado com sucesso');
          produtosVenda.length = 0; //limpa o array de produtos
          atualizarTabela()
        } else {
          alert('Erro ao adicionar o registro de venda: ' + result.erro);
        }
      } catch (error) {
        console.error('Erro ao adicionar o registro de venda:', error);
        alert('Erro ao adicionar o registro de venda.');
      }
})
