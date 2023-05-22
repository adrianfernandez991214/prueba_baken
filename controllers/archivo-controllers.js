const path = require('path');
const fs = require('fs');
const { response, request } = require('express');
const { validationResult } = require('express-validator');
const { subirArchivo } = require('../helpers/subir-archivo');
const Libro = require('../database/libro');

//Actualizar el archivo de un determinado libro por el id
const actualizarLibro = async (req = request, res = response) => {

    const { id } = req.params;
    
    //Comprobar si el libro del cual se envia el id por los params existe
    let modelo = await Libro.findById(id);
    if (!modelo) {
        return res.status(400).json({
            msg: 'No existe un libro con el id - ' + id
        });
    }

    //Limpiar archivos previos
    if (modelo.archivo) {
        //Hay que borrar el archivo si existe del servidor
        const pathlibro = path.join(__dirname, '../uploads', modelo.archivo);
        if (fs.existsSync(pathlibro)) {
            fs.unlinkSync(pathlibro);
        }
    }

    //Se sube el archivo y se guarda el nombre de archivo en el abjeto libro 
    const nombre = await subirArchivo(req.files);
    modelo.archivo = nombre;

    modelo.save();

    res.status(201).json({
        ok: true,
        Libro: modelo
    });

};

//Enviar el archivo que pertenese al libro, del cual se para el id por los params
const mostrarLibro = async (req = request, res = response) => {

    const { id } = req.params;

    //Comprobar si el libro del cual se envia el id por los params existe
    let modelo = await Libro.findById(id);
    if (!modelo) {
        return res.status(400).json({
            msg: 'No existe un libro con el id - ' + id
        });
    }

    //Enviar el archivo
    if (modelo.archivo) {
        const pathlibro = path.join(__dirname, '../uploads', modelo.archivo);
        if (fs.existsSync(pathlibro)) {
            return res.sendFile(pathlibro);
        }
    }

    //En caso de que no exista el archivo se envia uno por defecto
    const pathNoImagen = path.join(__dirname, '../assets', 'libro_base.pdf');
    res.status(200).sendFile(pathNoImagen);

};

module.exports = {
    actualizarLibro,
    mostrarLibro
}