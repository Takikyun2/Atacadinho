const mongoose = require('mongoose');

module.exports = {
  async up(db, client) {

// Limpar as coleções antes de inserir novos dados
db.collection("categorias").drop();
db.collection("produtos").drop();
db.collection("papeis").drop();
db.collection("usuarios").drop();

db.createCollection("categorias", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "nome" ],
            additionalProperties: false,
            properties: {
                _id: {
                  bsonType: "objectId",
                  description: "Identificador da categoria"  
                },
                nome: {
                    bsonType: "string",
                    description: "Nome da categoria"
                }
            }
        }
    },
    validationLevel: "strict"
});

const produtoLimpezaId = new mongoose.Types.ObjectId();
const hortifrutiId = new mongoose.Types.ObjectId();
const bebidasId = new mongoose.Types.ObjectId();
const laticiniosId = new mongoose.Types.ObjectId();

db.collection("categorias").insertMany([
    { _id: produtoLimpezaId, nome: "Produtos de limpeza" },
    { _id: hortifrutiId, nome: "Hortifruti" },
    { _id: bebidasId, nome: "Bebidas" },
    { _id: laticiniosId, nome: "Laticínios" }
]);

db.createCollection("produtos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "nome", 
                "preco", 
                "unidade", 
                "sku", 
                "codigoBarras", 
                "categoria", 
                "ativo",
                "criadoEm",
                "atualizadoEm"
            ],
            additionalProperties: false,
            properties: {
                _id: {
                  bsonType: "objectId",
                  description: "Identificador do produto"  
                },
                nome: {
                    bsonType: "string",
                    description: "Nome do produto"
                },
                preco: {
                    bsonType: "decimal",
                    description: "Preço unitário do produto"
                },
                unidade: {
                    bsonType: "string",
                    description: "Preço unitário do produto"
                },
                sku: {
                    bsonType: "string",
                    description: "Preço unitário do produto"
                },
                codigoBarras: {
                    bsonType: "string",
                    description: "Preço unitário do produto"
                },
                categoria: {
                    bsonType: "objectId",
                    description: "Categoria do produto"
                },
                ativo: {
                    bsonType: "bool",
                    description: "Indica se o produto está ativo"
                },
                criadoEm: {
                    bsonType: "date",
                    description: "Data de criação do documento"
                },
                atualizadoEm: {
                    bsonType: "date",
                    description: "Data de atualização do documento"
                },
                removidoEm: {
                    bsonType: "date",
                    description: "Data de remoção do documento"
                }
            }
        }
    },
    validationLevel: "strict"
});

db.collection("produtos").insertMany([
    { 
        _id: new mongoose.Types.ObjectId(), 
        nome: "OMO multiação",
        preco:  new mongoose.Types.Decimal128("12.34"),
        unidade: "un",
        sku: "5467896",
        codigoBarras: "908705790754",
        categoria: produtoLimpezaId,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date()
    },
]);

db.createCollection("papeis", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "nome" ],
            additionalProperties: false,
            properties: {
                _id: {
                  bsonType: "objectId",
                  description: "Identificador do papel"  
                },
                nome: {
                    bsonType: "string",
                    description: "Nome do papel"
                }
            }
        }
    },
    validationLevel: "strict"
});

const adminId = new mongoose.Types.ObjectId();
const operadorCaixaId = new mongoose.Types.ObjectId();

db.collection("papeis").insertMany([
    { _id: adminId, nome: "Administrador" },
    { _id: operadorCaixaId, nome: "Operador de caixa" }
]);

db.createCollection("usuarios", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "username", "senha", "papel", "criadoEm", "atualizadoEm" ],
            additionalProperties: false,
            properties: {
                _id: {
                  bsonType: "objectId",
                  description: "Identificador do usuário"  
                },
                username: {
                    bsonType: "string",
                    description: "Nome utilizado para login"
                },
                senha: {
                    bsonType: "string",
                    description: "Senha do usuário"
                },
                papel: {
                  bsonType: "objectId",
                  description: "Papel do usuário"  
                },
                criadoEm: {
                    bsonType: "date",
                    description: "Data de criação do documento"
                },
                atualizadoEm: {
                    bsonType: "date",
                    description: "Data de atualização do documento"
                },
                removidoEm: {
                    bsonType: "date",
                    description: "Data de remoção do documento"
                }
            }
        }
    },
    validationLevel: "strict"
});

db.collection("usuarios").insertMany([
    { 
        _id: new mongoose.Types.ObjectId(), 
        username: "admin",
        senha:  "1234",
        papel: adminId,
        criadoEm: new Date(),
        atualizadoEm: new Date()
    },
]);


 },

  async down(db, client) {
   }
};
