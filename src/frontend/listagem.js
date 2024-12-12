// Array de produtos para teste
const produtos = [
    { codigo: '001', nome: 'Produto A', categoria: 'Gelados', marca: 'Marca X', fornecedor: 'Fornecedor Y', ean: '1234567890123', medida: '500g', precoPromo: 'R$ 15,00', preco: 'R$ 20,00' },
    { codigo: '002', nome: 'Produto B', categoria: 'Hotfrute', marca: 'Marca Y', fornecedor: 'Fornecedor X', ean: '2345678901234', medida: '300g', precoPromo: 'R$ 10,00', preco: 'R$ 15,00' },
    { codigo: '003', nome: 'Produto C', categoria: 'Carne', marca: 'Marca Z', fornecedor: 'Fornecedor Z', ean: '3456789012345', medida: '1kg', precoPromo: 'R$ 25,00', preco: 'R$ 30,00' },
    { codigo: '004', nome: 'Produto D', categoria: 'Padaria', marca: 'Marca W', fornecedor: 'Fornecedor W', ean: '4567890123456', medida: '200g', precoPromo: 'R$ 8,00', preco: 'R$ 12,00' },
    { codigo: '005', nome: 'Produto E', categoria: 'Gelados', marca: 'Marca V', fornecedor: 'Fornecedor V', ean: '5678901234567', medida: '1L', precoPromo: 'R$ 18,00', preco: 'R$ 22,00' }
];

// Função para renderizar a tabela com os dados
function renderizarTabela(produtosFiltrados) {
    const tabelaProdutos = document.getElementById('tabela-produtos');
    tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de renderizar

    produtosFiltrados.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.codigo}</td>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.marca}</td>
            <td>${produto.fornecedor}</td>
            <td>${produto.ean}</td>
            <td>${produto.medida}</td>
            <td>${produto.precoPromo}</td>
            <td>${produto.preco}</td>
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
