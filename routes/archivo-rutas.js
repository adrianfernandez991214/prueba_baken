const { Router } = require('express');
const { check } = require('express-validator');
const { actualizarLibro, mostrarLibro } = require('../controllers/archivo-controllers');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.put('/:id', [
    validarArchivoSubir,
    check('id', 'El id de ser un id de mongo').isMongoId(),
    validarCampos
], actualizarLibro)

router.get('/:id', [
    check('id', 'El id de ser un id de mongo').isMongoId(),
    validarCampos
], mostrarLibro)

module.exports = router;