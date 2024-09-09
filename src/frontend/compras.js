produtos = [];
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
      atualizarTabela();
      atualizarTotalGeral();
    } else {
      alert(resposta.message || 'Erro ao adicionar produto a tabela');
    }
  }
});

function adicionarProdutoNaTabela(produto, quantidade, total) {
  produto.push({ ...produto, quantidade, total });
}

function atualizarTabela() {

  const tabela = document.querySelector('.tabela-produtos')
  tabela.innerHTML = '';

  produtos.forEach((produto, index) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${index + 1}</td>
      <td>${produto.codBarra}</td>
      <td>${produto.nome}</td>
      <td>R$${produto.preco.toFixed(2)}</td>
      <td>${produto.quantidade}</td>
      <td>R$${produto.total.toFixed(2)}</td>
  `;
    tabela.appendChild(linha);
  });



}
function atualizarTotalGeral() {
  totalGeral = produtos.reduce((sum, produtos) => sum + produto.total, 0);
  document.getElementById('total').value = totalGeral.toFixed(2);
}