const { Schema, model } = require('mongoose');

//Los libros poseen nombre, apellidos, correo(unico), orcid('El orcid es uno de los mas conocidos 
//identificadores universales de autores'), y usuario al que pertenece -> relacionado por el 
//id del usuario
const AutorSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son requeridos']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    orcid: {
        type: String,
        required: [true, 'El ORCID es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

AutorSchema.methods.toJSON = function () {
    const { __v,...autor } = this.toObject();
    return autor;
}

module.exports = model("Autor", AutorSchema);