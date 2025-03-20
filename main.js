const { app, BrowserWindow, Menu, ipcMain,dialog  } = require('electron')
const { spawn, execSync } = require('child_process');
const path = require('path')
const fs = require('fs'); // Adicionado para verificar se o WAMP está instalado
const mysql = require('mysql2/promise');
const { createDataBaseIfNotExists, setupDatabase } = require('./src/backend/database/database')
const ProdutoController = require('./src/backend/controllers/ProdutoController')
const LoginController = require('./src/backend/controllers/LoginController')
const CategoriaController = require('./src/backend/controllers/CategoriaController')
const CompraController = require('./src/backend/controllers/CompraController')
const CaixaController  = require('./src/backend/controllers/CaixaController')
const VendasController = require('./src/backend/controllers/VendaController');


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

// Função para verificar se o WAMP está instalado
function verificaWampInstalado() {
  const wampPath = path.join('C:', 'wamp64', 'wampmanager.exe');
  return fs.existsSync(wampPath);
}

// Função para iniciar o WAMP Server de forma assíncrona
function iniciarWAMPServer() {
  return new Promise((resolve, reject) => {
    if (verificaWampExec()) {
      console.log('WAMP Server ja esta em execucao.');
      resolve();
    } else {
      if (!verificaWampInstalado()) {
        console.error('WAMP nao esta instalado no caminho especificado.');
        dialog.showErrorBox(
          'Erro - WAMP nao instalado',
          'O WAMP nao foi encontrado no caminho especificado. Por favor, instale o WAMP e tente novamente.'
        );
        reject(new Error('WAMP nao esta instalado no caminho especificado.'));
        return;
      }

      const wampPath = path.join('C:', 'wamp64', 'wampmanager.exe'); // Caminho do exe do WAMP
      const wampProcess = spawn(wampPath, { detached: true, stdio: 'ignore', shell: true });

      wampProcess.on('error', (error) => {
        console.error('Erro ao iniciar o WAMP Server:', error);
        dialog.showErrorBox(
          'Erro ao iniciar o WAMP',
          'Ocorreu um erro ao tentar iniciar o WAMP Server. Verifique se o WAMP está corretamente instalado.'
        );
        reject(error);
      });

      setTimeout(() => {
        console.log('WAMP Server iniciado com sucesso!');
        resolve();
      }, 5 * 1000); // Tempo de espera para garantir inicialização
    }
  });
}

// Função para verificar a conexão com o banco de dados
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

// Inicializa o Electron após o WAMP Server e a conexão com o banco de dados
app.whenReady().then(async () => {
  try {
    // Verifica e inicia o WAMP
    await iniciarWAMPServer();

    // Aguarda a conexão com o banco de dados
    await waitForDatabase();

    // Cria o banco de dados e configura as tabelas, se necessário
    await createDataBaseIfNotExists();
    await setupDatabase();

    // Cria a janela principal
    const janela = carregar_janela();

    // Cria o menu da aplicação
    criarMenu();
  } catch (error) {
    console.error('Erro ao iniciar o aplicativo:', error);
    dialog.showErrorBox(
      'Erro ao iniciar o aplicativo',
      'Não foi possível iniciar o aplicativo. Verifique se o WAMP está instalado e o banco de dados está disponível.'
    );
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
    /* {
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
    }, */
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
        { label: 'Alternar Tela Cheia', accelerator: 'F11', role: 'togglefullscreen' }
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
            await shell.openExternal('https://drive.google.com/file/d/1P9QCG2ak9D7NiiR22D_lCdx8ZLFjoerC/view?usp=sharing');
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