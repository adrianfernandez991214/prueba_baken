const { Router } = require('express');
const { check } = require('express-validator');
const { actualizarLibro, mostrarLibro } = require('../controllers/archivo-controllers');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

//Ruta para actulozar archivo de un libro dado el id, se valida que exista el archivo, y
//que el id sea un id de mondodb
router.put('/:id', [
    validarArchivoSubir,
    check('id', 'El id de ser un id de mongo').isMongoId(),
    validarCampos
], actualizarLibro)

//Ruta para descargar un archivo de un libro dado el id, se valida que el id sea un id de mondodb
router.get('/:id', [
    check('id', 'El id de ser un id de mongo').isMongoId(),
    validarCampos
], mostrarLibro)

module.exports = router;