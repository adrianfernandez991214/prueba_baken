const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { validationResult } = require('express-validator');
const { subirArchivo } = require('../helpers/subir-archivo');
const Libro = require('../database/libro');

const actualizarLibro = async (req = request, res = response) => {

    const { id } = req.params;

    let modelo = await Libro.findById(id);
    if (!modelo) {
        return res.status(400).json({
            msg: 'No existe un libro con el id - ' + id
        });
    }

    //Limpiar imagenes previas
    if (modelo.archivo) {
        //Hay que borrar las imagenes del servidor
        const pathImagen = path.join(__dirname, '../uploads', modelo.archivo);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files);
    modelo.archivo = nombre;

    modelo.save();

    res.status(201).json(modelo);

};

const mostrarLibro = async (req = request, res = response) => {

    const { id } = req.params;

    let modelo = await Libro.findById(id);
    if (!modelo) {
        return res.status(400).json({
            msg: 'No existe un libro con el id - ' + id
        });
    }

    //Limpiar imagenes previas
    if (modelo.archivo) {
        //Hay que borrar las imagenes del servidor
        const pathImagen = path.join(__dirname, '../uploads', modelo.archivo);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathNoImagen = path.join(__dirname, '../assets', 'libro_base.pdf');
    res.status(200).sendFile(pathNoImagen);

};

module.exports = {
    actualizarLibro,
    mostrarLibro
}