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
const produtos = [
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
    

    produtos.push({
        id: selectBusca.value,
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

    produtos.forEach((produto, index) => {
        const total = (produto.quantidade * produto.preco).toFixed(2);
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
    produtos.splice(index, 1); 
    atualizarTabela(); 
}

function editarProduto(index) {
    const celulaQuantidade = document.getElementById(`quantidade-${index}`);
    const quantidadeAtual = produtos[index].quantidade;
    
    const inputQuantidade = document.createElement("input");
    inputQuantidade.type = "number";
    inputQuantidade.value = quantidadeAtual;
    inputQuantidade.min = 1;
    
    celulaQuantidade.innerHTML = "";
    celulaQuantidade.appendChild(inputQuantidade);

    inputQuantidade.addEventListener("blur", () => {
        const novaQuantidade = parseInt(inputQuantidade.value);
        if (!isNaN(novaQuantidade) && novaQuantidade > 0) {
            produtos[index].quantidade = novaQuantidade;
            atualizarTabela();
        } else {
            alert("Quantidade inválida!");
            atualizarTabela();
        }
    });
}

function atualizarFooter() {
    const footer = document.querySelector(".resumo-vendas");
    
    const quantidadeTotalItens = produtos.reduce((total, produto) => total + produto.quantidade, 0);
    const quantidadeProdutosDiferentes = produtos.length;

    footer.innerHTML = `${quantidadeProdutosDiferentes} itens (Qtd: ${quantidadeTotalItens})`;

    // Calcular o valor total
    const valorTotal = produtos.reduce((total, produto) => total + (produto.quantidade * produto.preco), 0).toFixed(2);

    // Atualizar o valor total na seção final
    const totalVendas = document.querySelector("#total-vendas");
    totalVendas.innerHTML = `Total = R$ ${valorTotal}`;
}

atualizarTabela();

//& ------------- MODAL FEHCAR CAIXA ------------------------

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

// Fechar modal ao clicar em "SIM"
btnSimFechamento.addEventListener('click', () => {
    alert('Caixa fechado com sucesso!');
    sobreposicaoModalFechamento.style.display = 'none';
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
