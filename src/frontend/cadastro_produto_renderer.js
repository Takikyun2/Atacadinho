document.addEventListener('DOMContentLoaded', async () => {
  // Função para carregar as categorias e preencher o select
  async function carregarCategorias() {
    try {
      const categorias = await window.api.listarCategoria();
      console.log('Categorias recebidas no renderer:', categorias);
      let categorySelect = document.querySelector('#category');
      categorySelect.innerHTML = '';

      // Adiciona a opção padrão
      const optionDefault = document.createElement('option');
      /* optionDefault.value = ''; */
      optionDefault.textContent = 'Selecione uma categoria';
      categorySelect.appendChild(optionDefault);

      // Adiciona as opções ao select
      categorias.forEach(categoria => {
        console.log(categoria);
        let option = document.createElement('option');
        option.value = categoria._id; // Define o valor como o ID da categoria
        option.textContent = categoria.nome; // Define o texto como o nome da categoria
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  // Eduardo: Carregar categorias quando a página for carregada
  carregarCategorias();

  // Adicionar produto ao servidor
  document.querySelector('#form-produto').addEventListener('submit', async (event) => {

    const datahora = 302020

    const produto = { // Eduardo: essa função manda os produtos
      nome: document.querySelector('#product-name').value,
      preco: document.querySelector('#price').value,
      unidade: document.querySelector('#unit').value,
      sku: document.querySelector('#cod-sku').value,
      codbarra: document.querySelector('#CodigoBarras').value,
      categoria: document.querySelector('#category').value,
      condicao: document.querySelector('#condition').value,
      datahora: datahora
    };

    try {
      const result = await window.api.adicionarProduto(produto);
      if (result.sucesso) {
        alert('Produto adicionado com sucesso!');
      } else {
        alert('Erro ao adicionar o produto: ' + result.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar o produto.');
    }
  });

});
