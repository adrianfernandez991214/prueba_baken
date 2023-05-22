const express = require('express');
const path = require('path');
const fs = require('fs');
const { response, request } = require('express');
const Libro = require('../database/libro');
const Autor = require('../database/autor');
const { subirArchivo } = require('../helpers/subir-archivo');

//Devuelve todos los libros
const libroGet = async (req = request, res = response) => {

    const { desde = 0, limite = 0 } = req.query;

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

//Devuelve todos los libros relacionados con el usuario
const libroGet_LosMios = async (req = request, res = response) => {

    const query = { usuario: req.usuario._id };
    const { desde = 0, limite = 0 } = req.query;

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

//Devuelve un libro por el id
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

//Se inserta un nuevo libro la base datos
const libroPost = async (req = request, res = response) => {

    const { titulo, genero, anno, autor } = req.body;
    const usuario = req.usuario._id;
    let li = Libro({ titulo, genero, anno, autor, usuario });

    //Se comprueba que exista el autor
    const existeAutor = await Autor.findById(autor);
    if (!existeAutor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL autor no existe'
        });
    }

    //Se guarda el archivo 
    const nombre = await subirArchivo(req.files);
    li.archivo = nombre;
    
    //Se salva en la base de datos el libro
    await li.save();
    const libro = await Libro.findById(li._id).populate('autor', 'nombre apellidos');

    res.status(201).json({
        ok: true,
        libro
    })

};

//Modifica un libro por el id, solo lo puede modificar 
//el usuario con el que este relacionado 
const libroPut = async (req = request, res = response) => {

    //resivir y estructural datos
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const usuario = req.usuario._id;
    const { autor } = req.body;

    //Se verifica si el libro existe
    const existeID = await Libro.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }

    //Se verifica si el autor existe
    const existeAutor = await Autor.findById(autor);
    if (!existeAutor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL autor no existe'
        });
    }

    //Se compruena que el libro le pertenece al usuario
    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este libro'
        });
    }

    //Se modifica el libro
    const libro = await Libro.findByIdAndUpdate(id, resto, { new: true }).populate('autor', 'nombre apellidos');

    res.status(201).json({
        ok: true,
        libro
    });

};

//Se elimina un libro por el id, solo puede ser eliminado por el 
//usuario al que le pertenece
const libroDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = req.usuario._id;

    //Se comprueva si el libro existe
    const existeID = await Libro.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }
    
    //Se compruena que el libro le pertenece al usuario
    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene permitido eliminar este libro'
        });
    }

    //Se elimina el libro de la base de datos
    const libro = await Libro.findByIdAndDelete(id);

    //Se elimina el archivo
    const pathImagen = path.join(__dirname, '../uploads', libro.archivo);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

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
