document.querySelector('#form-produto').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const venda = { 
        valor_total: 50.00, 
        descricao: "Nada", 
        caixa_id: 1
    };

    const produtosDaVenda = [
        {
            produto_id: 1, 
            quantidade: 5, 
            valor_total_produtos: 50.00,
        },
        {
            produto_id: 1, 
            quantidade: 2, 
            valor_total_produtos: 50.00,
        }
    ]

    //paramo aqui para mandar os dados do tipo de pag pro db
    const tipoDePagamentoDaVenda = [
        
    ]
    

    try {
      const result = await window.api.adicionarRegistrosDeVendas(venda, produtosDaVenda);
      if (result.sucesso) {
        alert('Registro cadastrado com sucesso');
      } else {
        alert('Erro ao adicionar o registro de venda: ' + result.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar o registro de venda:', error);
      alert('Erro ao adicionar o registro de venda.');
    }
});