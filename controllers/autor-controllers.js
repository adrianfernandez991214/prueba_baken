const express = require('express');
const { response, request } = require('express');
const Bcryptjs = require('bcryptjs');
const Autor = require('../database/autor');


const autorGet = async (req = request, res = response) => {

    const { desde = 0, limite = 0 } = req.query;

    const [total, autores] = await Promise.all([
        Autor.countDocuments(),
        Autor.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        autores
    })
};

const autorGet_LosMios = async (req = request, res = response) => {

    const query = { usuario: req.usuario._id };
    const { desde = 0, limite = 0 } = req.query;


    const [total, autores] = await Promise.all([
        Autor.countDocuments(query),
        Autor.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        autores
    })
};

const autorGetUno = async (req = request, res = response) => {

    const { id } = req.params;

    const autor = await Autor.findById(id);
    if (!autor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe - autor no existe'
        });
    }

    res.status(201).json({
        ok: true,
        autor
    })
};

const autorPost = async (req = request, res = response) => {

    const { nombre, apellidos, correo, orcid } = req.body;
    const usuario = req.usuario._id;
    const autor = Autor({ nombre, apellidos, correo, orcid, usuario });

    const existeEmail = await Autor.findOne({ correo });
    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }

    await autor.save();

    res.status(201).json({
        ok: true,
        autor
    })

};

const autorPut = async (req = request, res = response) => {

    //resivir y estructural datos
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const usuario = req.usuario._id;
    const { correo } = req.body;

    //Verificar si el id existe
    const existeID = await Autor.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este autor'
        });
    }

    const existeEmail = await Autor.findOne({ correo });
    if (existeEmail && (existeEmail.correo != existeID.correo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }

    const autor = await Autor.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        ok: true,
        autor
    });

};

const autorDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = req.usuario._id;

    //compruevo si el id existe
    const existeID = await Autor.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }
    
    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene permitido eliminar este autor'
        });
    }

    const autor = await Autor.findByIdAndDelete(id);

    res.status(201).json({
        ok: true,
        autor
    })
};

module.exports = {
    autorGet,
    autorGet_LosMios,
    autorGetUno,
    autorPost,
    autorPut,
    autorDelete
}
