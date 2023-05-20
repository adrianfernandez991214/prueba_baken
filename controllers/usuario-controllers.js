const express = require('express');
const { response, request } = require('express');
const Bcryptjs = require('bcryptjs');
const Usuario = require('../database/usuario');


const usuarioGet = async (req = request, res = response) => {

    const { desde = 0, limite = 5 } = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        usuarios
    })
};

const usuarioGetUno = async (req = request, res = response) => {

    const { id } = req.params;
    const { usuario } = req;

    if ((id != usuario._id) && (usuario.rol != 'ADMIN_ROLE')) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este usuario'
        });
    }

    const usuario_res = await Usuario.findById(id);
    if (!usuario_res) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe - usuario no existe'
        });
    }

    res.status(201).json({
        ok: true,
        usuario_res
    })
};

const usuarioPost = async (req = request, res = response) => {

    const { nombre, apellidos, correo, password, rol } = req.body;
    const usuario = Usuario({ nombre, apellidos, correo, password, rol });

    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }

    //Incriptar las contraseña
    const salt = Bcryptjs.genSaltSync();
    usuario.password = Bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(201).json({
        ok: true,
        usuario
    })

};

const usuarioPut = async (req = request, res = response) => {

    //resivir y estructural datos
    const { id } = req.params;
    const { _id, password, ...resto } = req.body;
    const { usuario } = req;
    const { correo } = req.body;

    if ((id != usuario._id) && (usuario.rol != 'ADMIN_ROLE')) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este usuario'
        });
    }

    //Verificar si el id existe
    const existeID = await Usuario.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail && (existeEmail.correo != existeID.correo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }

    //validar contra base de datos
    if (password) {
        //Encriptar la contraseña
        const salt = Bcryptjs.genSaltSync();
        resto.password = Bcryptjs.hashSync(password, salt);
    }

    const usuario_res = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        ok: true,
        usuario_res
    });
};

const usuarioDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const { usuario } = req;

    if ((id != usuario._id) && (usuario.rol != 'ADMIN_ROLE')) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este usuario'
        });
    }

    //compruevo si el id existe
    const existeID = await Usuario.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    //solo cambiar el estado para no perder la integridad referencial
    const usuario_res = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json({
        ok: true,
        usuario_res
    })
};

module.exports = {
    usuarioGet,
    usuarioGetUno,
    usuarioPost,
    usuarioPut,
    usuarioDelete
}

