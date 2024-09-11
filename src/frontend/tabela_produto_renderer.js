document.addEventListener('DOMContentLoaded', async () => {
  async function carregarProdutos() {
    try {
      const produtos = await window.api.listarProdutos();
      console.log('Produtos recebidos no renderer:', produtos); // Verifique aqui
  
      if (Array.isArray(produtos)) {
        const productList = document.querySelector('#productList');
        productList.innerHTML = ''; // Limpa a tabela antes de preencher
  
        if (produtos.length > 0) {
          produtos.forEach(produto => {
            const idProduto = produto.idproduto || 'Não definido';
            const nome = produto.nome || 'Não definido';
            const codigo = produto.codbarra || 'Não definido';
            const preco = parseFloat(produto.preco) || 0;
            const row = document.createElement('tr');
            
  
            row.innerHTML = `
              <td>${idProduto}</td>
              <td>${nome}</td>
              <td>${codigo}</td>
              <td>R$ ${preco.toFixed(2)}</td>
              <td><button class="btnExcluir btn btn-danger" data-id="${idProduto}">Excluir</button></td>
            `;
            productList.appendChild(row);
  
            let btnExcluir = row.querySelector('.btnExcluir');
            btnExcluir.addEventListener('click', async (event) => {
              let productId = event.target.dataset.id;
              if (confirm('Tem certeza que deseja excluir este produto?')) {
                try {
                  await window.api.removerProduto(productId);
                  carregarProdutos(); // Recarregar produtos após exclusão
                } catch (error) { 
                  console.error('Erro ao remover produto:', error);
                }
              }
            });
          });
        } else {
          console.warn('Nenhum produto encontrado.');
        }
      } else {
        console.error('Dados retornados não são um array:', produtos);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }  
  
    carregarProdutos();
  
    document.getElementById('addProduto').addEventListener('click', () => {
      window.location.href = '../cadastros/cadastro_produtos.html'; 
    });
  });
  