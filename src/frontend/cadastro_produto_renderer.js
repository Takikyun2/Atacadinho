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
        let option = document.createElement('option');
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
  document.querySelector('#form-produto').addEventListener('submit', async (event) => {
    event.preventDefault();

    //Pega a data atual do aparelho e converte para o formato do mysql datetime
    const datahora = new Date()
    const dataHoraFormatada = datahora.toISOString().split('T')[0] + ' '
    + datahora.toTimeString().split(' ')[0];
    

    const produto = { // Eduardo: essa função manda os produtos
      nome: document.querySelector('#product-name').value,
      preco: document.querySelector('#price').value,
      marca: 'teste'/* document.querySelector('#marca-produto').value */,
      fornecedor: 'teste'/* document.querySelector('#produto-fornecedor').value */,
      unidade: document.querySelector('#unit').value,
      sku: document.querySelector('#cod-sku').value,
      codbarra: document.querySelector('#CodigoBarras').value,
      categoria: document.querySelector('#category').value,
      condicao: 1/* document.querySelector('#condition').value */,
      datahora: dataHoraFormatada
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
