const mongoose = require('mongoose');

// Conectar ao banco de dados
mongoose.connect('mongodb://localhost:27017/atacadinho', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Esquema da Categoria
const categoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
}, {
  collection: 'categorias',
  timestamps: true, // Para 'criadoEm' e 'atualizadoEm'
});

// Modelo da Categoria
const Categoria = mongoose.model('Categoria', categoriaSchema);

// Esquema do Produto
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  preco: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  unidade: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  codigoBarras: {
    type: String,
    required: true,
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true,
  },
  ativo: {
    type: Boolean,
    required: true,
  },
}, {
  collection: 'produtos',
  timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' },
});

// Modelo do Produto
const Produto = mongoose.model('Produto', produtoSchema);

// Esquema do Papel
const papelSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
}, {
  collection: 'papeis',
  timestamps: true,
});

// Modelo do Papel
const Papel = mongoose.model('Papel', papelSchema);

// Esquema do Usuário
const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  papel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Papel',
    required: true,
  },
}, {
  collection: 'usuarios',
  timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' },
});

// Modelo do Usuário
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportando os modelos
module.exports = {
  Categoria,
  Produto,
  Papel,
  Usuario,
};
