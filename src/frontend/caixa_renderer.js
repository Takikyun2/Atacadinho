document.addEventListener('DOMContentLoaded', function () {

  // var principais
  let produtos = []; // Array para armazenar os produtos que vem do banco de dados
  let totalGeral = 0; // Variável para armazenar o total geral da compra
  let listaBusca = document.querySelector('.lista-busca'); // Variável para armazenar a lista de busca

  // quando o usuario digitar chama as funcoes responsaveis para adicionar, pesquisar e atualizar a tabela
  document.querySelector('#busca-input').addEventListener('input', async () => {

    const buscaInput = document.querySelector('#busca-input').value;
    const quantidade = parseInt(document.querySelector('#quantidade-input').value) || 1;

    if (!buscaInput) {
      document.querySelector('#listaBusca').style.diplay = 'none';
      listaBusca.innerHTML = '';
      return;
    }

    let resposta; // variavel para armazenar a resposta que vem do banco
    try {
      resposta = await window.api.buscarProdutoPorNome({ nomeProduto: buscaInput, quantidade: quantidade });
    } catch (error) {
      console.error('Erro ao buscar por nome', error)
      return;
    }

    console.log(resposta); // mostra a resposta no console

    if (resposta.status === 200 && resposta.produto) {
      mostrarPesquisa([resposta.produto]) // se tiver resposta chama a funcao de busca
    } else {
      listaBusca.innerHTML = '';
    }

    function mostrarPesquisa(produtos) {
      listaBusca.innerHTML = '';

      produtos.forEach((produto => {
        const preco = parseFloat(produto.preco) || 0;
        const itemBusca = document.createElement('li');
        itemBusca.innerHTML = `${produto.nome} - R$${preco.toFixed(2)}`;
        itemBusca.classList.add('item-busca');

        itemBusca.addEventListener('click', async () => {
          const quantidadeAtualizada = parseInt(document.querySelector('#quantidade-input').value) || 1;
          adicionarProdutoNaTabela(produto, quantidadeAtualizada, preco * quantidadeAtualizada);
          atualizarTabela();
          atualizarTotalGeral();
          listaBusca.innerHTML = '';
          document.querySelector('#busca-input').value = '';
        })

        listaBusca.appendChild(itemBusca);

      }))
    }

  });

  function adicionarProdutoNaTabela(produto, quantidade, total) {
    produtos.push({ ...produto, quantidade, total });
  }

  function atualizarTabela() {

    const tabela = document.querySelector('.tabela-produtos')

    tabela.innerHTML = '';

    produtos.forEach((produto, index) => {
      const linha = document.createElement('tr');
      const preco = parseFloat(produto.preco) || 0;
      linha.innerHTML = `
        <td>${index + 1}</td>
        <td>${produto.codbarra || 'N/A'}</td>
        <td>${produto.nome}</td>
        <td>R$${preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>R$${produto.total.toFixed(2)}</td>
    `;
      tabela.appendChild(linha);

      atualizarInputsProduto(produto.codbarra, preco.toFixed(2), produto.total.toFixed(2), produto.nome);
    });
  }

  //funcao responsavel por iserir os dados nos inputs codigo, v.unitario e total  
  function atualizarInputsProduto(codigo, valorUni, total, nome) {
    inputCodigoBarra = document.getElementById("codigo");
    inputValorUni = document.getElementById("valor-unitario");
    inputTotal = document.getElementById("total");
    inputDescricao = document.getElementById("descricao");
    //altera os valores dos inputs
    inputCodigoBarra.value = codigo;
    inputValorUni.value = valorUni;
    inputTotal.value = total;
    inputDescricao.value = nome;

  }

  function atualizarTotalGeral() {
    totalGeral = produtos.reduce((sum, produto) => sum + produto.total, 0);
    document.getElementById("totalGeral").value = totalGeral.toFixed(2);
  }



})

document.getElementById('recebido').addEventListener('input', () => {
  recebido = document.getElementById('recebido').value;
  let troco = document.getElementById('recebido').value - document.getElementById('totalGeral').value;
  document.getElementById('troco').value = troco.toFixed(2);
})

