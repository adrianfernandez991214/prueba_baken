const { response, request } = require('express');

//Validar que el archivo viene en la request 
const validarArchivoSubir = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
       return res.status(400).json({ msg: 'No hay archivo para subir' });
    }
    
    next();

};

module.exports = {
    validarArchivoSubir
}