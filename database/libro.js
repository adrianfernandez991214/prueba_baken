const { Schema, model } = require('mongoose');

//Los libros poseen titulo, genero, año, el nombre del archivo, autor -> relacionado
//por el id, y el usuario al que pertenece -> relaciondo por el id
const LibreoSchema = Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    genero: {
        type: String,
        required: [true, 'El genero es obligatorio']
    },
    anno: {
        type: Number,
        required: [true, 'El año es obligatorio'],
    },
    archivo: {
        type: String,
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'Autor',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

LibreoSchema.methods.toJSON = function () {
    const { __v, ...libro } = this.toObject();
    return libro;
}

module.exports = model("Libro", LibreoSchema);