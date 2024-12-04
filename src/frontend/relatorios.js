document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn-relatorio button");
    const containerTabela = document.querySelector(".container-tabela");
    const containerGrafico = document.querySelector(".container-grafico");
    const containerPizza = document.querySelector(".container-pizza");
    const containerTransacoes = document.querySelector(".container-transacoes");
    const filtro = document.getElementById("filtro");
    const inputFiltro = document.getElementById("input-filtro");
    const modalResumo = document.querySelector(".modal"); 
    

    //! obs**: Ainda falta finalizar essa tela de relatórios, falta implementar algumas funções ainda
    //! E se por acaso tiver alguma burrice aq no codigo do js, sorry ksksksk, ainda tô em processo de aprendizado, pfvr releva ksksks
    //! Mas em adiante, espero que tenham gostado do que eu fiz aq, tentei fazer algo bacana :D

    // Dados para cada tabela
    const dadosTabela = {
        vendas: {
            filtroOpcoes: ["Produto", "Código", "Vendedor", "Data"],
            tabelaHTML: `
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Produto</th>
                            <th>Código</th>
                            <th>Valor Unit.</th>
                            <th>Quant.</th>
                            <th>Sub-total</th>
                            <th>Desconto</th>
                            <th>Total Item</th>
                            <th>Vendedor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>16/11/2024</td>
                            <td>14:35</td>
                            <td>Notebook Dell</td>
                            <td>ND12345</td>
                            <td>R$ 3.500,00</td>
                            <td>1</td>
                            <td>R$ 3.500,00</td>
                            <td>R$ 100,00</td>
                            <td>R$ 3.400,00</td>
                            <td>João Silva</td>
                        </tr>
                    </tbody>
                </table>`
        },
        caixas_anteriores: {
            filtroOpcoes: ["Data", "Hora", "Valor"],
            tabelaHTML: `
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>15/11/2024</td>
                            <td>18:00</td>
                            <td>R$ 8.000,00</td>
                        </tr>
                    </tbody>
                </table>`
        },
    };

    //* ------------------------ FUNÇÃO DE MUDAR DE TABELA ---------------------------//

    function mudarTabela(tipoTabela) {
        containerTabela.innerHTML = ''; // Limpa a tabela existente
        containerGrafico.style.display = 'none'; // Esconde o gráfico de linha
        containerPizza.style.display = 'none'; // Esconde o gráfico de pizza
        modalResumo.style.display = 'none'; // Esconde o modal

        if (tipoTabela === 'extrato') {
            containerPizza.style.display = 'block'; // Mostra o gráfico de pizza para "Extrato"
        } else if (tipoTabela !== 'caixa_atual') {
            containerTabela.style.display = 'block'; // Exibe a tabela para outras opções
            containerTabela.innerHTML = dadosTabela[tipoTabela].tabelaHTML; // Adiciona a nova tabela
            atualizarFiltro(tipoTabela); // Atualiza o filtro
        }
    }

    //*----------------------------------GRÁFICO DE PIZZA --------------------------//

    function exibirGraficoPizza(exibir) {
        if (exibir) {
            containerPizza.style.display = 'block';
        } else {
            containerPizza.style.display = 'none';
        }
    }

    function exibirTabela(exibir) {
        if (exibir) {
            containerTabela.style.display = 'block';
        } else {
            containerTabela.style.display = 'none';
        }
    }

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                buttons.forEach(btn => btn.classList.remove("ativo")); // Remove a classe ativo de todos os botões
                button.classList.add("ativo"); // Adiciona a classe ativo ao botão clicado
    
                if (button.id === 'extrato') {
                    exibirGraficoPizza(true);  // Mostra o gráfico de pizza
                    exibirTabela(false);       // Oculta a tabela
                } else {
                    exibirGraficoPizza(false); // Oculta o gráfico de pizza
                    exibirTabela(true);        // Mostra a tabela
                }
            });
        });
        exibirGraficoPizza(false);
        exibirTabela(true);


    //* ------------------------- GRÁFICO DE TRANSAÇÕES ------------------------------//

    function atualizarVisibilidade(botaoClicadoId) {
        // Esconde o container de transações inicialmente
        containerTransacoes.style.display = 'none';

        // Verifica se o botão clicado é o de "Transações"
        if (botaoClicadoId === 'produtos') {
            containerTransacoes.style.display = 'block'; 
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove a classe 'ativo' de todos os botões
            buttons.forEach(btn => btn.classList.remove("ativo"));
            
            // Adiciona a classe 'ativo' ao botão clicado
            button.classList.add("ativo");

            // Atualiza a visibilidade dos containers
            atualizarVisibilidade(button.id);
        });
    });

    function retirartabela(exibir) {
        if (exibir) {
            containerTransacoes.style.display = 'block';
        } else {
            containerTransacoes.style.display = 'none';
        }
    }
    retirartabela(true)
    containerTransacoes.style.display = 'none';

    //* ------------------------- ATUALIZAR O FILTRO ---------------------------------//

    // Função para atualizar as opções do filtro
    function atualizarFiltro(tipoTabela) {
        filtro.innerHTML = '<option disabled selected>Filtro</option>'; // Limpa as opções de filtro
        dadosTabela[tipoTabela].filtroOpcoes.forEach(opcao => {
            const optionElement = document.createElement("option");
            optionElement.value = opcao;
            optionElement.innerText = opcao;
            filtro.appendChild(optionElement);
        });
    }

    //* ---------------------------- FUNÇÃO GRÁFICO CAIXA ATUAL ------------------------//
    // Adicionar o evento de clique nos botões para trocar a tabela
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("ativo")); // Remover a classe de ativo de todos os botões
            button.classList.add("ativo"); // Adicionar a classe de ativo ao botão clicado

            if (button.id === 'caixa_atual') {
                containerTabela.style.display = 'none'; // Esconde a tabela
                modalResumo.style.display = ''; // Exibe o modal de resumo
                containerGrafico.style.display = 'block'; // Exibe o gráfico de linha
            } else {
                mudarTabela(button.id); // Chama a função para mudar a tabela e atualizar o filtro
            }
        });
    });

    // Iniciar com a tabela 'caixa_atual' por padrão e exibir o gráfico
    const botaoCaixaAtual = document.getElementById('caixa_atual');
    botaoCaixaAtual.classList.add("ativo"); // Define o botão "caixa atual" como ativo
    containerTabela.style.display = 'none'; // Oculta a tabela
    containerGrafico.style.display = 'block'; // Exibe o gráfico de linha
    containerPizza.style.display = 'none'; // Oculta o gráfico de pizza inicialmente
    atualizarFiltro('caixa_atual'); // Atualiza o filtro para 'caixa_atual'
});



//* -------------------------- GRAFICO E CAMPO DE RESUMOS -------------------------------- //

const contexto = document.getElementById('salesChart').getContext('2d');

const labelsHoras = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']; // Horários
const valoresVendas = [670, 306, 454, 580, 432, 210, 300, 700, 620, 400, 800]; // Valores

const graficoVendas = new Chart(contexto, {
    // Daqui pra baixo é estilo do gráfico, ent relaxe
  type: 'line',
  data: {
    labels: labelsHoras,
    datasets: [
      {
        label: 'Gráfico de Vendas',
        data: valoresVendas,
        borderColor: 'orange',
        backgroundColor: 'rgba(247, 148, 0, 0.2)',
        fill: true,
        tension: 0.10,
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    layout: {
      padding: {
        top: 10,
        left: 5,
        right: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,  
          autoSkip: false  
        },
        grid: {
          display: true,
        }
      },
      y: {
        min: 0,
        max: 1000,
        ticks: {
          stepSize: 200,
        },
      },
    },
    plugins: {
      legend: { 
        display: false, 
        position: 'top' 
      },
      tooltip: {
        callbacks: {
          label: (itemTooltip) => ` Vendas: R$ ${itemTooltip.raw.toFixed(2)}`, 
        },
      },
    },
  },
});

//* --------------------------- GRÁFICO DE PIZZA EXTRATO -------------------------------//
  const data = {
    labels: ["Pix", "Dinheiro", "Crédito", "Debito", "Boleto"],
    datasets: [{
      label: "Extrato: ",
      data: [12, 10, 13, 5, 7], 
      backgroundColor: [
        "rgba(0, 74, 141, 100)",
        "rgba(247, 142, 30, 100)",
        "rgba(47, 95, 140, 100)",
        "rgba(75, 192, 192, 100)",
        "rgba(94, 118, 140, 100)",
        "rgba(247, 158, 111, 100)"
      ],
      borderColor: [
        "rgba(0, 74, 141, 100)",
        "rgba(247, 142, 30, 100)",
        "rgba(47, 95, 140, 100)",
        "rgba(75, 192, 192, 100)",
        "rgba(94, 118, 140, 100)",
        "rgba(247, 158, 111, 100)"
      ],
      borderWidth: 1
    }]
  };

  // Configuração do gráfico
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true
        }
      }
    },
  };

  // Renderizar o gráfico
  const pizzaGrafico = document.getElementById("myPieChart").getContext("2d");
  const myPieChart = new Chart(pizzaGrafico, config);

// * ------------------------------ GRAFICO DE PRODUTOS ------------------------------------//


const colunas = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(colunas, {
    type: 'bar', // Tipo de gráfico: colunas (barras verticais)
    data: {
        labels: ['Congelados', 'Limpeza', 'Frutas e Legumes', 'Laticínios', 'Padaria'], // Nomes das colunas
        datasets: [{
            label: 'Top 5 Mais Vendidos Hoje',
            data: [5000, 7000, 8000, 5600, 4500], // Valores das colunas
            backgroundColor: [
                'rgba(47, 95, 140, 100)',
                'rgba(94, 118, 140, 100)',
                'rgba(247, 142, 30, 100)',
                'rgba(247, 158, 111, 100)',
                'rgba(247, 182, 112, 100)'
            ],
            borderColor: [
                'rgba(47, 95, 140, 100)',
                'rgba(94, 118, 140, 100)',
                'rgba(247, 142, 30, 100)',
                'rgba(247, 158, 111, 100)',
                'rgba(247, 182, 112, 100)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true 
            }
        }
    }
});