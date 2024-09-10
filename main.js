const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { createDataBaseIfNotExists, setupDatabase } = require('./src/backend/database/database')
const ProdutoController = require('./src/backend/controllers/ProdutoController')
const CategoriaController = require('./src/backend/controllers/CategoriaController')
const CompraController = require('./src/backend/controllers/CompraController')


/* 
  Função para criar e carregar a janela principal da aplicação:
  'const janela': Declara uma constante para armazenar a janela.
  'janela.loadFile('index.html')': Carrega o arquivo HTML da janela principal.
  'app.whenReady().then(() => {': Configura a aplicação quando estiver pronta.
  'carregar_janela()': Chama a função para carregar a janela.
  'criarMenu()': Chama a função para criar o menu.
  'app.on('window-all-closed', () => {': Fecha a aplicação quando todas as janelas forem fechadas.
  'app.on('activate', () => {': Ativa a aplicação quando a janela for ativada.
  'webPreferences': Configurações de preferências da janela web.
  'nodeIntegration': Habilita a integração do Node.js na janela web.
  'contextIsolation': Isola o contexto da janela web.
*/


function carregar_janela() {
  const janela = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, //true
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  janela.loadFile('src/views/cadastros/cadastro_produtos.html');
}

app.whenReady().then(async () => {
  await createDataBaseIfNotExists();
  await setupDatabase();
  carregar_janela();
  criarMenu();
});

/* Ipc  */

// ? - Produtos Ipc start

// Metodos do ProdutoController

ipcMain.handle('adicionar-produto', async (event, produto) => {
  try {
    await ProdutoController.adicionarProduto(produto);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('listar-produtos', async () => {
  try {
    return await ProdutoController.listarProdutos();
  } catch (err) {
    return { erro: err.message };
  }
});

ipcMain.handle('atualizar-produto', async (event, id, novosDados) => {
  try {
    await ProdutoController.atualizarProduto(id, novosDados)
    return { sucesso: true, produto: produtoAtualizado };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
})

ipcMain.handle('remover-produto', async (event, id) => {
  try {
    await ProdutoController.removerProduto(id);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

// Metodos do CategoriaController

ipcMain.handle('listar-categorias', async () => { // faz o listar-categorias ser visivel para o todo
  try {
    return await CategoriaController.listarCategoria();
  } catch (err) {
    return { erro: err.message };
  }
});

// Metodos do CompraController

ipcMain.handle('buscar-produto-nome', async (event, args) => {
  return await CompraController.buscarProdutoPorNome(args);
});

ipcMain.handle('buscar-produto-codigo', async (event, args) => {
  return await CompraController.buscarProdutosPorCodigo(args);
});

// ? - Produtos Ipc end


/* Menu */

/*
  Define a estrutura do menu: Cada item do menu tem um label (rótulo) e pode ter um accelerator (atalho de teclado).
  Submenu Arquivo: Contém opções para criar um novo arquivo, abrir um arquivo existente, salvar um arquivo e sair do aplicativo.
  Submenu Editar: Contém opções para desfazer, refazer, recortar, copiar, colar e selecionar tudo.
  Submenu Visualizar: Contém opções para recarregar a página, alternar para tela cheia e ferramentas de desenvolvedor.
  Submenu Janela: Contém opções para minimizar, fechar e sair. 
  Submenu Ajuda: Contém opções para documentação e sobre.
*/

function criarMenu() {
  const template = [
    {
      label: 'Arquivo',

      submenu: [
        {
          label: 'Novo',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            console.log('Novo arquivo');
          }
        },
        {
          label: 'Abrir',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            console.log('Abrir arquivo');
          }
        },
        {
          label: 'Salvar',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            console.log('Salvar arquivo');
          }
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { label: 'Desfazer', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Refazer', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Recortar', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copiar', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Colar', accelerator: 'CmdOrCtrl+V', role: 'paste' },
        { label: 'Selecionar Tudo', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { label: 'Recarregar', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Alternar Tela Cheia', accelerator: 'F11', role: 'togglefullscreen' },
        { label: 'Ferramentas de Desenvolvedor', accelerator: 'Alt+CmdOrCtrl+I', role: 'toggledevtools' }
      ]
    },
    {
      label: 'Janela',
      role: 'window',
      submenu: [
        { label: 'Minimizar', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Fechar', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    },
    {
      label: 'Ajuda',
      role: 'help',
      submenu: [
        {
          label: 'Documentação',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    carregar_janela();
  }
});
