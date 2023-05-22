
const { Schema, model } = require('mongoose');

//Los usuarios poseen nombre, apellidos, correo(unico), possword, rol['ADMIN_ROLE', 'USER_ROLE'],
//y el estado
const UsuarioSchema = Schema({
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
    password: {
        type: String,
        required: [true, 'La comtraseña es obligatoria']
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

UsuarioSchema.methods.toJSON = function () {
    const { __v, password,...usuario } = this.toObject();
    return usuario;
}

module.exports = model("Usuario", UsuarioSchema);