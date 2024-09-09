const { contextBridge, ipcRenderer } = require('electron');
const { buscarProdutoPorNome, buscarProdutosPorCodigo } = require('./src/backend/controllers/CompraController');

contextBridge.exposeInMainWorld('api', {

  // Metodos do ProdutoController

  adicionarProduto: (produto) => ipcRenderer.invoke('adicionar-produto', produto),
  listarProdutos: () => ipcRenderer.invoke('listar-produtos'),
  atualizarProduto: (idproduto, novosDados) => ipcRenderer.invoke('atualizar-produto', idproduto, novosDados),
  removerProduto: (idproduto) => ipcRenderer.invoke('remover-produto', idproduto),

  // Metodos do CategoriaController

  listarCategoria: () => ipcRenderer.invoke('listar-categorias'),

  // Metodos do CompraController

  buscarProdutoPorNome: (nomeProduto) => ipcRenderer.invoke('buscar-produto-nome', { nomeProduto }),
  buscarProdutosPorCodigo: (codigoBarras) => ipcRenderer.invoke('buscar-produto-codigo', { codigoBarras })
});