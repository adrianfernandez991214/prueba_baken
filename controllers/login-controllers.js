const { response, request } = require('express');
const Usuario = require('../database/usuario');
const Bcryptjs = require('bcryptjs');
//const { validationResult } = require('express-validator');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                ok: false, 
                msg: 'Usuario / Password son incorrectos'
            });
        }

        //Verificar que el ususario este activo
        if (!usuario.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password son incorrectos'
            });
        }

        //Verificar contraseña
        const validarPassword = Bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario / Password son incorrectos'
            });
        }

        //Crear JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

};

const renew = async (req = request, res = response) => {

    const { usuario } = req;

    const token = await generarJWT(usuario.id);

    res.status(201).json({
        ok: true,
        usuario,
        token
    })
};

module.exports = {
    login,
    renew
}