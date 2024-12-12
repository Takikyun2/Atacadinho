const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { spawn, execSync } = require('child_process');
const path = require('path')
const mysql = require('mysql2/promise');
const { createDataBaseIfNotExists, setupDatabase } = require('./src/backend/database/database')
const ProdutoController = require('./src/backend/controllers/ProdutoController')
const CategoriaController = require('./src/backend/controllers/CategoriaController')
const CompraController = require('./src/backend/controllers/CompraController')
const CaixaController  = require('./src/backend/controllers/CaixaController')
const VendasController = require('./src/backend/controllers/VendaController')


// Função para verificar se o WAMP já está em execução
function verificaWampExec() {
  try {
    const output = execSync('tasklist');
    return output.toString().toLowerCase().includes('wampmanager.exe');
  } catch (error) {
    console.error('Erro ao verificar processos:', error);
    return false;
  }
}

// Função para iniciar o WAMP Server de forma assíncrona
function iniciarWAMPServer() {
  return new Promise((resolve, reject) => {
    if (verificaWampExec()) {
      console.log('WAMP Server ja esta em execucao.');
      resolve();
    } else {
      const wampPath = path.join('C:', 'wamp64', 'wampmanager.exe'); // Caminho do exe do WAMP obs: garanta que este caminha esteja certo
      const wampProcess = spawn(wampPath, { detached: true, stdio: 'ignore', shell: true });

      wampProcess.on('error', (error) => {
        console.error('Erro ao iniciar o WAMP Server:', error);
        reject(error);
      });

      setTimeout(() => {
        console.log('WAMP Server iniciado com sucesso!');
        resolve();
      }, 5 * 1000); // Tempo de espera para garantir inicialização
    }
  });
}

async function waitForDatabase() {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
  };

  const maxRetries = 10; // Número máximo de tentativas
  const retryInterval = 3000; // Intervalo entre tentativas (ms)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt}: Verificando conexao com o banco de dados...`);
      const connection = await mysql.createConnection(dbConfig);
      await connection.end();
      console.log('Conexao com o banco de dados estabelecida!');
      return true;
    } catch (error) {
      console.warn(`Banco de dados indisponivel. Tentando novamente em ${retryInterval / 1000} segundos...`);
      await new Promise((res) => setTimeout(res, retryInterval));
    }
  }

  throw new Error('O banco de dados nao esta disponivel apos varias tentativas.');
}

function carregar_janela() {
  const janela = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true //false
    }
  });

  janela.loadFile('src/views/user/login.html');
}

// Inicializa o Electron após o WAMP Server
app.whenReady().then(async () => {
  try {
    await iniciarWAMPServer();
    await waitForDatabase();
    await createDataBaseIfNotExists();
    await setupDatabase();
    carregar_janela();
    criarMenu();
  } catch (error) {
    console.error('Erro ao iniciar o aplicativo:', error);
    app.quit();
  }
});

/* app.whenReady().then(async () => {
  await createDataBaseIfNotExists();
  await setupDatabase();
  carregar_janela();
  criarMenu();
}); */

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

ipcMain.handle('buscar-produto-id', async (event, id) => {
  try {
    return await ProdutoController.buscarProdutoPorId(id);
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

ipcMain.handle('listar-Quantidade-De-Produtos-Vendidos', async () => { // faz o listar-categorias ser visivel para o todo
  try {
    return await CategoriaController.listarQuantidadeDeProdutosVendidos();
  } catch (err) {
    return { erro: err.message };
  }
});

ipcMain.handle('listar-E-Somar-Valor-Produtos-Vendidos-Categorias', async () => { // faz o listar-categorias ser visivel para o todo
  try {
    return await CategoriaController.listarESomarValorProdutosVendidosCategorias();
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

// Metodos do CaixaController

ipcMain.handle('adicionar-registro-caixa', async (event, caixa) => {
  try {
    await CaixaController.adicionarRegistroDeCaixa(caixa);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('listar-registros-caixa', async () => { 
  try {
    return await CaixaController.listarRegistrosCaixa();
  } catch (err) {
    return { erro: err.message };
  }
});

ipcMain.handle('atualizar-registro-caixa', async (event, newCaixa) => {
  try {
    await ProdutoController.atualizarProduto(newCaixa)
    return { sucesso: true, caixa: caixaAtualizado };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
})

ipcMain.handle('remover-registro-caixa', async (event, id_caixa) => {
  try {
    await CaixaController.removerRegistroCaixa(id_caixa);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});


// Metodos do vendasController
ipcMain.handle('adicionar-registro-venda', async (event,venda, produtosDaVenda) => {
  try {
    await VendasController.adicionarRegistrosDeVendas(venda, produtosDaVenda)
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('listar-Extrato-Tipos-Pagamentos', async () => {
  try {
    return await VendasController.listarExtratoPorTiposDePagamentos();
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
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