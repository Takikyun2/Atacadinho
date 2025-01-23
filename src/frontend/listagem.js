// Função de excluir item
function excluirItem(botao) {
    if (confirm("Deseja realmente excluir este item?")) {
        const linha = botao.parentNode.parentNode;
        linha.remove();
        const id_produto = linha.querySelector("td").innerText;
         
        removerProduto(id_produto)
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
        
        // Adicionar evento para detectar a tecla Enter
        const input = colunas[i].querySelector("input");
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                salvarEdicao(linha, botao);
            }
        });
    }


    botao.innerHTML = '<i class="fas fa-save edit-icon"></i>';
    botao.onclick = function () {
        salvarEdicao(linha, botao);
    };

}

// Função para salvar a edição
function salvarEdicao(linha, botaoSalvar) {
    const colunas = linha.querySelectorAll("td");

    const id_produto =  colunas[0].querySelector("input").value; // Pegando o ID do produto
    

    // Criar um objeto com os dados editados
    const novosDados = {
        nome: colunas[1].querySelector("input") ? colunas[1].querySelector("input").value : "",
        preco: colunas[8].querySelector("input") ? parseFloat(colunas[8].querySelector("input").value.replace("R$", "").trim()) : 0,
        preco_promocional: colunas[7].querySelector("input") ? parseFloat(colunas[7].querySelector("input").value.replace("R$", "").trim()) : 0,
        marca: colunas[3].querySelector("input") ? colunas[3].querySelector("input").value : "",
        fornecedor: colunas[4].querySelector("input") ? colunas[4].querySelector("input").value : "",
        unidade: colunas[6].querySelector("input") ? colunas[6].querySelector("input").value : "",
        codbarra: colunas[5].querySelector("input") ? colunas[5].querySelector("input").value : "",
        categoria: colunas[2].querySelector("input") ? colunas[2].querySelector("input").value : "",
        condicao: 1, 
        datahora: new Date().toISOString() // Data e hora atuais
    };
    // Chamar a API para atualizar o produto
    atualizaProduto(id_produto, novosDados)

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

document.addEventListener('DOMContentLoaded', async () => {
    // Array de produtos para teste
    const produtos = await window.api.listarProdutos();
    const categorias = await window.api.listarCategoria();

    // Função para renderizar a tabela com os dados
    async function renderizarTabela(produtosFiltrados) {
        
        const tabelaProdutos = document.getElementById('tabela-produtos');
        tabelaProdutos.innerHTML = ''; // Limpa a tabela antes de renderizar

        if(!produtosFiltrados){
            const div = document.createElement('tr');
            div.innerHTML = `
              <td colspan="10" style="text-align: center;">Nenhum produto encontrado</
            `;
            tabelaProdutos.appendChild(div);
            return;
        }

        produtosFiltrados.forEach(produto => {
            const categoriaProduto = categorias.find(categoria => categoria.idcategoria === produto.categoria_id);
            const nomeCategoria = categoriaProduto ? categoriaProduto.categoriaproduto : 'Usuário não encontrado';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${produto.id_produto}</td>
                <td>${produto.nome}</td>
                <td>${nomeCategoria}</td>
                <td>${produto.marca}</td>
                <td>${produto.fornecedor}</td>
                <td>${produto.codbarra}</td>
                <td>${produto.unidade}</td>
                <td>R$ ${produto.preco_promocional ? produto.preco_promocional.toFixed(2) : "00.00"}</td>
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

    // Função de filtrar produtos
    document.getElementById('btn-pesquisar').addEventListener('click', filtrarProdutos);
    document.getElementById('input-filtro').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            filtrarProdutos();
        }
    });

    async function filtrarProdutos() {
        const filtro = document.getElementById('filtro').value;
        const pesquisa = document.getElementById('input-filtro').value;

        if (pesquisa) {
            const produtoFiltradoPorNome = await window.api.buscarProdutoPorNome(pesquisa);
            
            // Se tiver pelo menos um caractere no input, faz a pesquisa
            renderizarTabela(produtoFiltradoPorNome);
        } else {
            // Se não tiver nada no input, mostra todos os produtos novamente
            renderizarTabela(produtos);
        }
    }
        
    // Inicializa a página com todos os produtos
    renderizarTabela(produtos);
});

const atualizaProduto = async (idproduto, novosDados) => {
    try {
        const categorias = await window.api.listarCategoria();

        const categoriaProduto = categorias.find(categoria => categoria.categoriaproduto === novosDados.categoria);
        
        const idCategoria = categoriaProduto ? categoriaProduto.idcategoria : 'categoria não encontrada';

        novosDados["categoria"] = idCategoria 

        const result = await window.api.atualizarProduto(idproduto, novosDados)

    } catch (error) {
        console.log(error);
    }
}
const removerProduto = async (idproduto) => {
    try {
        
        const result = await window.api.removerProduto(idproduto)
        if (result) {
            console.log("produto removido com sucesso");
        }

    } catch (error) {
        console.log(error);
    }
}
