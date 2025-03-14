import { listarRegistrosCaixaAnteriores } from "../../src/frontend/relatorios/caixasAnteriores.js"
import { categoriasMaisVendidasDia } from "../../src/frontend/relatorios/categorias.js"
import{ listarVendas } from "../../src/frontend/relatorios/vendas.js"

document.addEventListener("DOMContentLoaded", async () => {
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


const outputTabelaRelatoriosVendas = listarVendas();

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
          tabelaHTML: "" // Inicialmente vazio
      },
      extrato: {
          filtroOpcoes: ["Dia", "Semanal", "Mensal", "Anual"],
          tabelaHTML: ""
      },
      produtos: {
        filtroOpcoes: ["Dia","Semanal", "Mensal", "Anual", "Tudo"],
      },
      caixa_atual: {
        filtroOpcoes: ["Data", "Hora", "Valor"]
      }
  };

   // Aguarda os dados da API para inserir a tabela de caixas anteriores
    try {
        const outputTabelaRelatoriosCaixas = await listarRegistrosCaixaAnteriores();
        dadosTabela.caixas_anteriores.tabelaHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Abertura</th>
                        <th>Fechamento</th>
                        <th>Saldo Inicial</th>
                        <th>Saldo Final</th>
                        <th>Total</th>
                        <th>User Abertura</th>
                        <th>User Fechamento</th>
                    </tr>
                </thead>
                <tbody>
                    ${outputTabelaRelatoriosCaixas}
                </tbody>
            </table>`;
    } catch (error) {
        console.error("Erro ao carregar registros de caixas anteriores:", error);
    }

   // Aguarda os dados da API para inserir a tabela de vendas 
    try {
        const outputTabelaRelatoriosVendas = await listarVendas();
        dadosTabela.vendas.tabelaHTML = `
            <table>
                <thead>
                      <tr>
                          <th>Data</th>
                          <th>Hora</th>
                          <th>Produto</th>
                          <th>Código</th>
                          <th>Valor Unit.</th>
                          <th>Quant.</th>
                          <th>Total Item</th>
                          <th>Vendedor</th>
                      </tr>
                  </thead>
                <tbody>
                    ${outputTabelaRelatoriosVendas}
                </tbody>
            </table>`;
    } catch (error) {
        console.error("Erro ao carregar registros de caixas anteriores:", error);
    }

    //* ------------------------ FUNÇÃO DE MUDAR DE TABELA ---------------------------//

    function mudarTabela(tipoTabela) {
      containerTabela.innerHTML = ''; // Limpa a tabela existente
      containerGrafico.style.display = 'none'; // Esconde o gráfico de linha
      containerPizza.style.display = 'none'; // Esconde o gráfico de pizza
      modalResumo.style.display = 'none'; // Esconde o modal
  
      // Validação se `tipoTabela` existe no objeto `dadosTabela`
      if (!dadosTabela[tipoTabela]) {
          console.error(`Tipo de tabela "${tipoTabela}" não encontrado.`);
          return;
      }
  
      if (tipoTabela === 'extrato') {
          containerPizza.style.display = 'flex'; // Mostra o gráfico de pizza para "Extrato"
          atualizarFiltro(tipoTabela); // Atualiza o filtro
      } else if (tipoTabela !== 'caixa_atual') {
          containerTabela.style.display = 'block'; // Exibe a tabela para outras opções
  
          if (!dadosTabela[tipoTabela].tabelaHTML) {
              containerTabela.style.display = 'none'; // Oculta a tabela se `tabelaHTML` for indefinido
          }
  
          containerTabela.innerHTML = dadosTabela[tipoTabela].tabelaHTML || ""; // Adiciona a nova tabela
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
        /* console.log("Tipo de Tabela:", dadosTabela[tipoTabela]); */
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
let horarioDasCompras = []
let valorTotalDasCompras = []

try {
  const caixaAtual = await window.api.listarRegistrosCaixaAtual();

  if(caixaAtual.length > 0){
    caixaAtual.forEach(registro => {

      horarioDasCompras.push(registro.hora_venda)
      valorTotalDasCompras.push(registro.total_vendas)

    })
  }
} catch (error) {
  console.log(error);
}

const contexto = document.getElementById('salesChart').getContext('2d');

const labelsHoras = horarioDasCompras; // Horários
const valoresVendas = valorTotalDasCompras; // Valores

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

// inserir dados das movimentacoes no aside
async function atualizarAsideMovimentacoes() {
  try {
    const { movimentacoes, totalVendas, totalRetiradas } = await window.api.obterMovimentacaoCaixaAtual();

    console.log(movimentacoes, totalVendas, totalRetiradas);
    
    let sectionContent = '';
    movimentacoes.forEach(movimentacao => {
      let valorExibido = '';
      if (movimentacao.tipo === 'Abertura') {
          valorExibido = `R$ ${movimentacao.valor ? movimentacao.valor.toFixed(2) : '0.00'}`;
      } else {
          valorExibido = (movimentacao.valor > 0 ? 'R$ ' : '- R$ ') + Math.abs(movimentacao.valor).toFixed(2);
      }

      // Define a classe do ponto com base no tipo da movimentação
      const pontoClass = movimentacao.tipo === 'Sangria' ? 'ponto-vermelho' : 'ponto-azul';

      sectionContent += `
          <div class="item-venda">
              <div class="detalhes-venda">
                  <span class="${pontoClass}"></span>
                  <span class="valor-venda">${valorExibido}</span>
                  <span class="hora-venda">${movimentacao.datahora ? new Date(movimentacao.datahora).toLocaleTimeString() : ''}</span>
              </div>
              ${movimentacao.tipo === 'Abertura' ? '<span class="forma-pagamento">Caixa Aberto</span>' : `<span class="forma-pagamento">${movimentacao.tipo}</span>`}
              <hr>
          </div>
          `;
    });

    const footerContent = `
        <span>Total de Vendas: R$ ${totalVendas.toFixed(2)}</span><br>
        <span>Total de Retiradas: - R$ ${Math.abs(totalRetiradas).toFixed(2)}</span>
    `;

    document.querySelector('.modal-corpo').innerHTML = sectionContent;
    document.querySelector('.modal-rodape').innerHTML = footerContent;

  } catch (error) {
    console.error('Erro ao atualizar movimentações:', error);
  }
}

atualizarAsideMovimentacoes();



//* --------------------------- GRÁFICO DE PIZZA EXTRATO -------------------------------//

const extratos = []

const labelsDasFormasPagamento = []
const extratoDasFormasPagamento = []

async function carregarExtratoPorTiposDePagamentos() {
  try {
    const extratoDB = await window.api.listarExtratoPorTiposDePagamentos();

    extratoDB.forEach(extrato => {

      extratos.push(extrato);

      labelsDasFormasPagamento.push(extrato.forma_pagamento);

      extratoDasFormasPagamento.push(extrato.total_valor)

      inserirDadosModal()
    })
    
  }catch(error){
    console.error('Erro ao carregar extrato:', error);
  }
}

carregarExtratoPorTiposDePagamentos()

  const data = {
    labels: labelsDasFormasPagamento,
    datasets: [{
      label: "Extrato ",
      data: extratoDasFormasPagamento, 
      backgroundColor: [
        "rgba(247, 158, 111, 100)",
        "rgba(247, 142, 30, 100)",
        "rgba(47, 95, 140, 100)",
        "rgba(75, 192, 192, 100)",
        "rgba(94, 118, 140, 100)",
        "rgba(247, 158, 111, 100)"
      ],
      borderColor: [
        "rgba(247, 158, 111, 100)",
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

  function inserirDadosModal() {
    const modalPizza = document.getElementById('modal-Extrato-Pizza');

    const output = extratos.map(extrato =>{
      const {forma_pagamento, total_valor} = extrato
      return `
        <div class="item-venda">
          <div class="detalhes-venda">
             <span class="ponto-azul"></span>
              <span class="valor-venda">R$ ${total_valor.toFixed(2)}</span>
          </div>
          <span class="forma-pagamento">${forma_pagamento}</span>
          <hr>
        </div> 
      `;
    }).join('');
    
    modalPizza.innerHTML = output;
  }

// * ------------------------------ GRAFICO DE PRODUTOS ------------------------------------//
//constante que armazena as categorias cadastradas no DB
const categorias = []

//constante que armazena a quantidade de produtos vendidos por categoria
const quantidadeDeProdutosVendidosPorCategoria = []

// busca as categorias do DB para inserir no grafico
async function carregarCategorias() {
  try {
    const categoriasDB = await window.api.listarCategoria();
    categoriasDB.forEach(categoria => categorias.push(categoria.categoriaproduto))
    
  }catch(error){
    console.error('Erro ao carregar categorias:', error);
  }
}

async function carregarQuantidadeDeProdutosVendidos() {
  try {
    //armazena o retorno da funcao que busca a quantidade de produtos vendidos por categoria
    const quantidade = await window.api.listarQuantidadeDeProdutosVendidos();

    //adiciona a quantidade de produtos vendidos de cada categoria ao array de quantidadeDeProdutosVendidosPorCategoria
    quantidade.forEach(qtd => quantidadeDeProdutosVendidosPorCategoria.push(qtd.total_produtos_vendidos))
    
  }catch(error){
    console.error('Erro ao carregar categorias:', error);
  }
}
//Call das funcões de busca
carregarCategorias();
carregarQuantidadeDeProdutosVendidos();




const colunas = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(colunas, {
    type: 'bar', // Tipo de gráfico: colunas (barras verticais)
    data: {
        labels: categorias, // Nomes das colunas
        datasets: [{
            label: 'Top 5 Categorias Mais Vendidas',
            data: quantidadeDeProdutosVendidosPorCategoria, // Valores das colunas
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


const valorTotalProdutosCategorias = [];
carregarValorTotalDeProdutosVendidosCategorias()

async function carregarValorTotalDeProdutosVendidosCategorias() {
  try {
    const valorTotalPorCategoria = await window.api.listarESomarValorProdutosVendidosCategorias();
    valorTotalPorCategoria.forEach(vt => valorTotalProdutosCategorias.push(vt));

    // Atualizar o modal após carregar os dados
    atualizarModal();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

function atualizarModal() {
  const sectionModal = document.getElementById("modal-corpo");

  const output = valorTotalProdutosCategorias.map(vt => {
    const { categoria, valor_total_vendido } = vt;
    return `
      <div class="item-venda">
        <div class="detalhes-venda">
          <span class="ponto-azul"></span>
          <span class="valor-venda">${categoria}</span>
        </div>
        <span class="forma-pagamento">R$ ${valor_total_vendido.toFixed(2)}</span>
        <hr>
      </div>
    `;
  }).join('');
  
  sectionModal.innerHTML = output;
}




categoriasMaisVendidasDia();

