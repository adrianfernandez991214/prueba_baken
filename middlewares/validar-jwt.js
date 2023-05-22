const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../database/usuario');

//Se comprueba el JWT y se identifica el usuario 
const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    //Se comprueba que el token exista
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "El token no existe"
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //Se comprueba que el token sea valido, osea que el token este relacionado a un
        //usuario
        const usuario = await Usuario.findById(uid);
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - Usuario no existe'
            });
        }

        //Vererificar si el usuario tiene el estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - Estado de ususario en false'
            });
        }
        
        //Envia el usuario por la request 
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            ok: false,
            msg: "token no valido"
        });

    }

};

module.exports = validarJWT;