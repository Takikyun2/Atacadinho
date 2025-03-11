const { app, BrowserWindow, Menu, ipcMain,dialog  } = require('electron')
const path = require('path')
const mysql = require('mysql2/promise');
const {setupDatabase } = require('./src/backend/database/database')
const ProdutoController = require('./src/backend/controllers/ProdutoController')
const LoginController = require('./src/backend/controllers/LoginController')
const CategoriaController = require('./src/backend/controllers/CategoriaController')
const CompraController = require('./src/backend/controllers/CompraController')
const CaixaController  = require('./src/backend/controllers/CaixaController')
const VendasController = require('./src/backend/controllers/VendaController');
require('dotenv').config();

const dbHost = "srv1604.hstgr.io";
const dbUser = "u221550671_dev";
const dbPassword = "ru8o9:yF";

// Função para verificar a conexão com o banco de dados
async function waitForDatabase() {
  const dbConfig = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
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

// Função para carregar a janela principal
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

  janela.on('close', async (event) => {
    event.preventDefault();
    const caixaAberto = await janela.webContents.executeJavaScript(
      "sessionStorage.getItem('caixaEstaAberto')"
    );

    const status = caixaAberto ? JSON.parse(caixaAberto) : { isOpen: false };

    if (status.isOpen) {
      dialog.showMessageBox(janela, {
        type: 'warning',
        title: 'Atenção',
        message: 'O caixa está aberto. Feche-o antes de sair.',
        buttons: ['OK']
      });
    } else {
      app.exit();
    }
  });

  return janela; // Retorna a janela criada
}

app.whenReady().then(async () => {
  try {

    // Aguarda a conexão com o banco de dados
    await waitForDatabase();

    // Cria o banco de dados e configura as tabelas, se necessário
    await setupDatabase();

    // Cria a janela principal
    await carregar_janela();

    // Cria o menu da aplicação
    criarMenu();
  } catch (error) {
    console.error('Erro ao iniciar o aplicativo:', error);
    dialog.showErrorBox(
      'Erro ao iniciar o aplicativo',
      'Não foi possível iniciar o aplicativo. Verifique se o banco de dados está disponível.'
    );
    app.quit();
  }
});


//Metodos login
ipcMain.handle('adicionar-login', async (event, login) => {
  try {
    await LoginController.adicionarLogin(login);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
});

ipcMain.handle('validar-login', async (event, login) => {
  try {
    const resultado = await LoginController.validarLogin(login);
    return resultado
  } catch (err) {
    return { erro: err.message };
  }
});

ipcMain.handle('listar-logins', async () => {
  try {
    return await LoginController.listarLogins();
  } catch (err) {
    return { erro: err.message };
  }
});

// Metodos do ProdutoController

ipcMain.handle('adicionar-produto', async (event, produto) => {
  try {
    return await ProdutoController.adicionarProduto(produto);
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

ipcMain.handle('atualizar-produto', async (event, idproduto, novosDados) => {
  try {
    return await ProdutoController.atualizarProduto(idproduto, novosDados)
  } catch (err) {
    return { erro: err.message };
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

ipcMain.handle('listar-E-Somar-Categorias-Vendidas-Periodo', async (event,periodo) => { 
  try {
    return await CategoriaController.listarESomarCategoriasVendidasNoPeriodo(periodo);
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
    const res = await CaixaController.adicionarRegistroDeCaixa(caixa);
    return { sucesso: true , res};
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('adicionar-registro-sangria', async (event, sangria) => {
  try {
    await CaixaController.adicionarRegistroDeSangria(sangria);
    return { sucesso: true };
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('atualizar-ultimo-registro-caixa', async (event, caixa) => {
  try {
    await CaixaController.atualizarUltimoRegistroCaixaAberto(caixa);
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

ipcMain.handle('listar-registros-caixa-atual', async () => { 
  try {
    return await CaixaController.listarRegistrosCaixaAtual();
  } catch (err) {
    return { erro: err.message };
  }
});

ipcMain.handle('obter-movimentacao-caixa-atual', async () => { 
  try {
    return await CaixaController.obterMovimentacaoCaixaAtual();
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
ipcMain.handle('adicionar-registro-venda', async (event,venda, produtosDaVenda,tipoDePagamentoDaVenda) => {
  try {
    await VendasController.adicionarRegistrosDeVendas(venda, produtosDaVenda, tipoDePagamentoDaVenda)
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

ipcMain.handle('listar-registros-vendas', async () => {
  try {
    return await VendasController.listarRegistrosDeVendas();
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});

ipcMain.handle('listar-tipos-de-pagamentos', async () => {
  try {
    return await VendasController.listarTiposDePagamentos();
  } catch (err) {
    return { sucesso: false, erro: err.message }
  }
});



function criarMenu() {
  const template = [
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