const { adicionarProduto, atualizarProduto } = require("../backend/controllers/ProdutoController");

totalGeral = 0;

document.getElementById('busca-input').addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const buscaInput = document.getElementById('busca-input').value;
    const quantidade = parseInt(document.getElementById('quantidade-input').value);

    let resposta;

    if (!isNaN(buscaInput)) {
      resposta = await window.api.buscarProdutosPorCodigo(buscaInput);
    } else {
      resposta = await window.api.buscarProdutoPorNome(buscaInput);
    }

    if (resposta.produto) {
      adicionarProdutoNaTabela(resposta.produto, quantidade, resposta.total);
      totalGeral += resposta.total;
      atualizarTotalGeral();
    } else {
      alert.resposta.message || 'Erro ao adicionar produto a tabela';
    }
  }
});

function adicionarProdutoNaTabela(produto, quantidade, total) {
  const linha = document.createElement('tr');
  linha.innerHTML = `
      <td>1</td>
      <td>001</td>
      <td>${produto.nome}</td>
      <td>R$${produto.preco.toFixed(2)}</td>
      <td>${quantidade}</td>
      <td>R$${total.toFixed(2)}</td>
  `;

  const tabela = document.querySelector('.tabela-produtos').appendChild(linha);
}
function atualizarTotalGeral() {
  document.getElementById('total').value = totalGeral.toFixed(2);
}