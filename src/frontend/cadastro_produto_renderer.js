document.addEventListener('DOMContentLoaded', async () => {
  // Função para carregar as categorias e preencher o select
  async function carregarCategorias() {
    try {
      const categorias = await window.api.listarCategoria();

      const categorySelect = document.querySelector('#categoria-select');

      categorySelect.innerHTML = '';

      // Adiciona a opção padrão
      const optionDefault = document.createElement('option');
      /* optionDefault.value = ''; */
      optionDefault.textContent = 'Selecione uma categoria';
      categorySelect.appendChild(optionDefault);

      // Adiciona as opções ao select
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.idcategoria; // Define o valor como o ID da categoria
        option.textContent = categoria.categoriaproduto; // Define o texto como o nome da categoria
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  // Eduardo: Carregar categorias quando a página for carregada
  carregarCategorias();

  // Adicionar produto ao servidor
  document.querySelector('#form-principal').addEventListener('submit', async (event) => {

    event.preventDefault();
    

    const produto = { // Eduardo: essa função manda os produtos
      nome: document.querySelector('#name-input').value,
      preco: document.querySelector('#preco-input').value,
      preco_promocional: document.querySelector('#precoPromocional-input').value,
      marca: document.querySelector('#marca-input').value,
      fornecedor: document.querySelector('#fornecedor-input').value,
      unidade: document.querySelector('#unidadeDeMedida-select').value,
      codbarra: document.querySelector('#eanGtin-input').value,
      categoria: document.querySelector('#categoria-select').value,
      condicao: document.querySelector('#produtoCondicao').value
    };
    

    try {
      const result = await window.api.adicionarProduto(produto);
      if (result.sucesso) {

        toastr.options = {
          "positionClass": "toast-bottom-full-width", // Exibição no topo, ocupando largura total
        };

        toastr.success('Produto adicionado com sucesso!');

        for(const form of document.getElementsByTagName('form')) {
          form.reset();
        }

      } else {
        toastr.error('Erro ao adicionar o produto');
        console.log('Erro ao adicionar o produto: ' + result.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toastr.error('Erro ao adicionar o produto');
    }
  });

});
