const mongoose = require('mongoose');

module.exports = {
    async up(db, client) {
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
    },

    async down(db, client) {
    }
};
