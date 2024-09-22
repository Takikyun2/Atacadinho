document.addEventListener('DOMContentLoaded', function () {

  // & --- Variaveis globais ---
  let produtos = JSON.parse(localStorage.getItem('produtos')) || []; // Array para armazenar os produtos que vem do banco de dados
  let totalGeral = 0; // Variável para armazenar o total geral da compra
  let listaBusca = document.querySelector('.lista-busca'); // Variável para armazenar a lista de busca


  // & --- Eventos de botao ---
  // Aqui cancela a compra e limpa os produtos   
  document.getElementById('btn-cancelar').addEventListener('click', () => {
    produtos = []; // Limpa a lista de produtos
    localStorage.removeItem('produtos'); // Remove do localStorage
    atualizarTabela();
    atualizarTotalGeral();
  });


  // & --- Eventos de entrada ---
  // quando o usuario digitar o codigo de barras do produto chama as funcoes responsaveis para adicionar, pesquisar e atualizar a tabela
  document.querySelector('#codigo-barras-input').addEventListener('input', debounce(buscarProdutos, 100))

  // quando o usuario digitar o nome do produto chama as funcoes responsaveis para adicionar, pesquisar e atualizar a tabela
  document.querySelector('#busca-input').addEventListener('input', debounce(buscarProdutos, 100));

  // funcão para mostrar os produtos buscados

  // & --- Funções de busca ---
  async function buscarProdutos() {

    // variaveis para armazenar os valores dos inputs

    const buscaInput = document.querySelector('#busca-input').value.trim();
    const codigoBarraInput = document.querySelector('#codigo-barras-input').value.trim();
    const quantidade = parseInt(document.querySelector('#quantidade-input').value) || 1;

    if (!buscaInput && !codigoBarraInput) { // verifica se os inputs estao vazios
      listaBusca.innerHTML = '';
      return;
    }

    let resposta; // variavel para armazenar a resposta da API

    try {
      if (codigoBarraInput) {
        resposta = await window.api.buscarProdutosPorCodigo({ codigoBarras: codigoBarraInput, quantidade });
      } else if (buscaInput) {
        resposta = await window.api.buscarProdutoPorNome({ nomeProduto: buscaInput, quantidade });
      }

      console.log('Resposta da busca: ', resposta);

      if (resposta.status === 200 && resposta.produto) {
        mostrarPesquisa(Array.isArray(resposta.produto) ? resposta.produto : [resposta.produto]);
      } else {
        mostrarMensagemNenhumResultado();
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
    }



    function mostrarPesquisa(produtos) { // função para mostrar os produtos pesquisados em sugestoes
      listaBusca.innerHTML = '';

      if (produtos.length === 0) { // verifica se o array de produtos for vazio
        mostrarMensagemNenhumResultado();
        return;
      }


      produtos.forEach((produto => { // percorre o array de produtos
        const preco = parseFloat(produto.preco) || 0; // pega o preco do produto
        const itemBusca = document.createElement('li'); // cria um item de busca
        itemBusca.innerHTML = `${produto.nome} - R$${preco.toFixed(2)}`; // adiciona o nome do produto e o preco
        itemBusca.classList.add('item-busca'); // adiciona uma classe CSS

        itemBusca.addEventListener('click', async () => { // adiciona o evento de clique na lista de busca
          const quantidadeAtualizada = parseInt(document.querySelector('#quantidade-input').value) || 1; // pega a quantidade informada pelo usuario
          adicionarProdutoNaTabela(produto, quantidadeAtualizada, preco * quantidadeAtualizada); // adiciona o item na tabela
          atualizarTabela(); // atualiza a tabela
          atualizarTotalGeral(); // atualiza o total
          limparCamposBusca(); // limpa os campos
        })

        listaBusca.appendChild(itemBusca); // adiciona o item de busca

      }))
    }
  }

  function mostrarMensagemNenhumResultado() { // função para mostrar a mensagem de nenhum resultado encontrado
    const itemNaoEncontrado = document.createElement('li');
    itemNaoEncontrado.textContent = 'Nenhum produto encontrado para sua pesquisa.';
    itemNaoEncontrado.classList.add('item-busca', 'nenhum-resultado');
    listaBusca.appendChild(itemNaoEncontrado);
  }

  function adicionarProdutoNaTabela(produto, quantidade, total) { // funcao para adicionar o item na tabela
    const produtoExistente = produtos.find(p => p.codbarra === produto.codbarra); // verifica se o item ja existe na tabela

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade; // se o item ja existe, adiciona a quantidade
      produtoExistente.total += total; // se o item ja existe, adiciona o total
    } else {
      produtos.push({ ...produto, quantidade, total }); // se o item ainda nao existe, adiciona-o
    }

    localStorage.setItem('produtos', JSON.stringify(produtos));
  }

  function atualizarTabela() { // funcao para atualizar a tabela

    const tabela = document.querySelector('.tabela-produtos') // seleciona a tabela

    tabela.innerHTML = ''; // limpa a tabela

    produtos.forEach((produto, index) => { // percorre o array de produtos
      const linha = document.createElement('tr'); // cria uma linha na tabela
      const preco = parseFloat(produto.preco) || 0; // pega o preco do produto
      linha.innerHTML = ` 
        <td>${index + 1}</td>
        <td>${produto.codbarra || 'N/A'}</td>
        <td>${produto.nome}</td>
        <td>R$${preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>R$${produto.total.toFixed(2)}</td>
        <td><button class="btn-remover" data-index="${index}">Remover</button></td>
    `; // adiciona os dados da linha na tabela
      tabela.appendChild(linha);

      linha.querySelector('.btn-remover').addEventListener('click', () => {
        removerProduto(index);
      });

      atualizarInputsProduto(produto.codbarra, preco.toFixed(2), produto.total.toFixed(2), produto.nome); // atualiza os inputs da tabela
    });
  }

  // Função para remover um produto da tabela

  function removerProduto(index) {
    // Remove o produto da lista
    produtos.splice(index, 1);


    localStorage.setItem('produtos', JSON.stringify(produtos)); // Atualiza o localStorage

    // Atualiza a tabela e o total geral
    atualizarTabela();
    atualizarTotalGeral();
  }

  //funcao responsavel por iserir os dados nos inputs codigo, v.unitario e total  
  function atualizarInputsProduto(codigo, valorUni, total, nome) {
    const inputCodigoBarra = document.getElementById("codigo");
    const inputValorUni = document.getElementById("valor-unitario");
    const inputTotal = document.getElementById("total");
    const inputDescricao = document.getElementById("descricao");
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

  // Função para limpar os campos de busca após selecionar um produto
  function limparCamposBusca() {
    document.querySelector('#busca-input').value = '';
    document.querySelector('#quantidade-input').value = '';
    document.querySelector('#codigo-barras-input').value = '';
    listaBusca.innerHTML = ''; // Limpa a lista de busca
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait)
    };
  }

  atualizarTabela();
})

document.getElementById('recebido').addEventListener('input', () => {
  const recebido = parseFloat(document.getElementById('recebido').value) || 0;
  totalGeral = parseFloat(document.getElementById("totalGeral").value) || 0;
  const troco = recebido - totalGeral;
  document.getElementById('troco').value = troco.toFixed(2);
})

