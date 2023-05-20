const express = require('express');
const { response, request } = require('express');
const Libro = require('../database/libro');
const Autor = require('../database/autor');
const { subirArchivo } = require('../helpers/subir-archivo');

const libroGet = async (req = request, res = response) => {

    const { desde = 0, limite = 5 } = req.query;

    const [total, libros] = await Promise.all([
        Libro.countDocuments(),
        Libro.find()
            .populate('autor', 'nombre apellidos')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        libros
    })
};

const libroGet_LosMios = async (req = request, res = response) => {
    
    const query = { usuario: req.usuario._id };
    const { desde = 0, limite = 5 } = req.query;

    const [total, libros] = await Promise.all([
        Libro.countDocuments(query),
        Libro.find(query)
            .populate('autor', 'nombre apellidos')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        libros
    })
};

const libroGetUno = async (req = request, res = response) => {

    const { id } = req.params;

    const libro = await Libro.findById(id).populate('autor', 'nombre apellidos');
    if (!libro) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe - libro no existe'
        });
    }

    res.status(201).json({
        ok: true,
        libro
    })
};

const libroPost = async (req = request, res = response) => {

    const { titulo, genero, anno, autor } = req.body;
    const usuario = req.usuario._id;
    const libro = Libro({ titulo, genero, anno, autor, usuario });

    const existeAutor = await Autor.findById(autor);
    if (!existeAutor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL autor no existe'
        });
    }


    const nombre = await subirArchivo(req.files);
    libro.archivo = nombre;

    await libro.save();

    res.status(201).json({
        ok: true,
        libro
    })

};

const libroPut = async (req = request, res = response) => {

    //resivir y estructural datos
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const usuario = req.usuario._id;
    const { autor } = req.body;

    //Verificar si el id existe
    const existeID = await Libro.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    const existeAutor = await Autor.findById(autor);
    if (!existeAutor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL autor no existe'
        });
    }

    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este libro'
        });
    }

    const libro = await Libro.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        ok: true,
        libro
    });

};

const libroDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = req.usuario._id;

    //compruevo si el id existe
    const existeID = await Libro.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene permitido eliminar este libro'
        });
    }

    const libro = await Libro.findByIdAndDelete(id);

    res.status(201).json({
        ok: true,
        libro
    })
};

module.exports = {
    libroGet,
    libroGet_LosMios,
    libroGetUno,
    libroPost,
    libroPut,
    libroDelete
}
