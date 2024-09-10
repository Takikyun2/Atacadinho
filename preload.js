const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  // Metodos do ProdutoController

  adicionarProduto: (produto) => ipcRenderer.invoke('adicionar-produto', produto),
  listarProdutos: () => ipcRenderer.invoke('listar-produtos'),
  atualizarProduto: (idproduto, novosDados) => ipcRenderer.invoke('atualizar-produto', idproduto, novosDados),
  removerProduto: (idproduto) => ipcRenderer.invoke('remover-produto', idproduto),

  // Metodos do CategoriaController

  listarCategoria: () => ipcRenderer.invoke('listar-categorias'),

  // Metodos do CompraController

  buscarProdutoPorNome: (args) => ipcRenderer.invoke('buscar-produto-nome', args),
  buscarProdutosPorCodigo: (args) => ipcRenderer.invoke('buscar-produto-codigo', args)
});