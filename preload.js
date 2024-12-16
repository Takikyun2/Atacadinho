const { contextBridge, ipcRenderer } = require('electron');
 
contextBridge.exposeInMainWorld('api', {

  // Login
  adicionarLogin: (login) => ipcRenderer.invoke('adicionar-login', login),
  
  validarLogin: (login) => ipcRenderer.invoke('validar-login', login),

 
  // Metodos do ProdutoController
 
  adicionarProduto: (produto) => ipcRenderer.invoke('adicionar-produto', produto),

  listarProdutos: () => ipcRenderer.invoke('listar-produtos'),

  buscarProdutoPorId: (id) => ipcRenderer.invoke('buscar-produto-id',id),

  atualizarProduto: (idproduto, novosDados) => ipcRenderer.invoke('atualizar-produto', idproduto, novosDados),

  removerProduto: (idproduto) => ipcRenderer.invoke('remover-produto', idproduto),
 
  // Metodos do CategoriaController
 
  listarCategoria: () => ipcRenderer.invoke('listar-categorias'),

  listarQuantidadeDeProdutosVendidos: () => ipcRenderer.invoke('listar-Quantidade-De-Produtos-Vendidos'),

  listarESomarValorProdutosVendidosCategorias: () => ipcRenderer.invoke('listar-E-Somar-Valor-Produtos-Vendidos-Categorias'),

  listarESomarCategoriasVendidasNoPeriodo: (periodo) => ipcRenderer.invoke('listar-E-Somar-Categorias-Vendidas-Periodo', periodo),
 
  // Metodos do CompraController
 
  buscarProdutoPorNome: (args) => ipcRenderer.invoke('buscar-produto-nome', args),
  buscarProdutosPorCodigo: (args) => ipcRenderer.invoke('buscar-produto-codigo', args),
 
  // Metodos do CaixaController
 
  adicionarRegistroDeCaixa: (caixa) => ipcRenderer.invoke('adicionar-registro-caixa', caixa),

  atualizarUltimoRegistroCaixaAberto: (caixa) => ipcRenderer.invoke('atualizar-ultimo-registro-caixa', caixa),
 
  listarRegistrosCaixa: () => ipcRenderer.invoke('listar-registros-caixa'),
 
  atualizarRegistrosCaixa: (newCaixa) => ipcRenderer.invoke('atualizar-registro-caixa',  newCaixa),
 
  removerRegistroCaixa: (id_caixa) => ipcRenderer.invoke('remover-registro-caixa', id_caixa),

  // Metodos do VendasController
  adicionarRegistrosDeVendas: (venda, produtosDaVenda) => ipcRenderer.invoke('adicionar-registro-venda', venda, produtosDaVenda),

  listarExtratoPorTiposDePagamentos: () => ipcRenderer.invoke('listar-Extrato-Tipos-Pagamentos'),

});
