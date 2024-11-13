// Adicionar registro de abertura / fechamento do caixa ao servidor
document.querySelector('#form-produto').addEventListener('submit', async (event) => {
    event.preventDefault();

    //Pega a data atual do aparelho e converte para o formato do mysql datetime
    const datahora = new Date()
    const dataHoraFormatada = datahora.toISOString().split('T')[0] + ' '
    + datahora.toTimeString().split(' ')[0];
    

    const caixa = { 
        data_abertura: dataHoraFormatada,
        data_fechamento: dataHoraFormatada,
        valor_inicial: 12.50,
        valor_final:300.00,
        observacoes:"nada a informar",
        login_id: 1
    };
    

    try {
      const result = await window.api.adicionarRegistroDeCaixa(caixa);
      if (result.sucesso) {
        alert('Registro cadastrado com sucesso');
      } else {
        alert('Erro ao adicionar o registro de caixa: ' + result.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar o registro de caixa:', error);
      alert('Erro ao adicionar o registro de caixa.');
    }
});