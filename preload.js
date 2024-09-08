const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  adicionarProduto: (produto) => ipcRenderer.invoke('adicionar-produto', produto),
  listarProdutos: () => ipcRenderer.invoke('listar-produtos'),
  atualizarProduto: (idproduto, novosDados) => ipcRenderer.invoke('atualizar-produto', idproduto, novosDados),
  removerProduto: (idproduto) => ipcRenderer.invoke('remover-produto', idproduto),
  listarCategoria: () => ipcRenderer.invoke('listar-categorias') 
});