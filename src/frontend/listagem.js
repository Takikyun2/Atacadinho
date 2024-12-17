document.addEventListener('DOMContentLoaded', async () => {
// Array de produtos para teste
const produtos = await window.api.listarProdutos();

// Função para renderizar a tabela com os dados
async function renderizarTabela(produtosFiltrados) {
    const tabelaProdutos = document.getElementById('tabela-produtos');
    tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de renderizar

    const categorias = await window.api.listarCategoria();
    console.log(categorias);
    

    produtosFiltrados.forEach(produto => {

        const categoriaProduto = categorias.find(categoria => categoria.idcategoria === produto.categoria_id);

        const nomeCategoria= categoriaProduto ? categoriaProduto.categoriaproduto : 'Usuário não encontrado';


        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id_produto}</td>
            <td>${produto.nome}</td>
            <td>${nomeCategoria}</td>
            <td>${produto.marca}</td>
            <td>${produto.fornecedor}</td>
            <td>${produto.codbarra}</td>
            <td>${produto.unidade}</td>
            <td>R$ ${produto.preco_promocional ? produto.preco_promocional.toFixed(2): "00.00"}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>
                <button class="icon-btn" onclick="editarItem(this)">
                    <i class="fas fa-pencil-alt edit-icon"></i>
                </button>
                <button class="icon-btn" onclick="excluirItem(this)">
                    <i class="fas fa-trash delete-icon"></i>
                </button>
            </td>
        `;
        tabelaProdutos.appendChild(tr);
    });
}

// Função de excluir item
function excluirItem(botao) {
    if (confirm("Deseja realmente excluir este item?")) {
        const linha = botao.parentNode.parentNode;
        linha.remove();
    }
}

// Função para editar item
function editarItem(botao) {
    const linha = botao.parentNode.parentNode;
    const colunas = linha.querySelectorAll("td");

    // Transformar células em campos editáveis
    for (let i = 0; i < colunas.length - 1; i++) {
        const valorAtual = colunas[i].innerText;
        colunas[i].innerHTML = `<input type="text" value="${valorAtual}" style="width: 100%;">`;
    }

    botao.innerHTML = '<i class="fas fa-save edit-icon"></i>';
    botao.onclick = function () {
        salvarEdicao(linha, botao);
    };
}

// Função para salvar a edição
function salvarEdicao(linha, botaoSalvar) {
    const colunas = linha.querySelectorAll("td");

    for (let i = 0; i < colunas.length - 1; i++) {
        const input = colunas[i].querySelector("input");
        if (input) {
            colunas[i].innerText = input.value;
        }
    }

    botaoSalvar.innerHTML = '<i class="fas fa-pencil-alt edit-icon"></i>';
    botaoSalvar.onclick = function () {
        editarItem(botaoSalvar);
    };
}

// Função de filtrar produtos
document.getElementById('btn-pesquisar').addEventListener('click', function () {
    const filtro = document.getElementById('filtro').value;
    const pesquisa = document.getElementById('input-filtro').value.toLowerCase();

    // Filtra os produtos com base no filtro de categoria e na pesquisa de texto
    const produtosFiltrados = produtos.filter(function (produto) {
        const correspondeCategoria = filtro === 'Filtro' || produto.categoria.toLowerCase() === filtro.toLowerCase();
        const correspondePesquisa = produto.nome.toLowerCase().includes(pesquisa) ||
            produto.categoria.toLowerCase().includes(pesquisa) ||
            produto.marca.toLowerCase().includes(pesquisa) ||
            produto.fornecedor.toLowerCase().includes(pesquisa);

        return correspondeCategoria && correspondePesquisa;
    });


    renderizarTabela(produtosFiltrados);
});

// Inicializa a página com todos os produtos
renderizarTabela(produtos);

})
