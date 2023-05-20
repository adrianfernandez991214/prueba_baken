const { Router } = require('express');
const { check } = require('express-validator');
const { libroGet, libroGet_LosMios, libroGetUno, libroPost, libroPut, libroDelete } = require('../controllers/libro-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const router = Router();

router.get('/', libroGet);

router.get('/los_mios', [
    validarJWT,
    validarCampos
], libroGet_LosMios);

router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarCampos
], libroGetUno);

router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('anno', 'El año es obligatorio').isNumeric(),
    check('autor', 'El autor no es un MongoID').isMongoId(),
    validarArchivoSubir,
    validarJWT,
    validarCampos
], libroPost);

router.put('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('anno', 'El año es obligatorio').isNumeric(),
    check('autor', 'El autor no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], libroPut);

router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], libroDelete);

module.exports = router;