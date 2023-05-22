const { Router } = require('express');
const { check } = require('express-validator');
const { libroGet, libroGet_LosMios, libroGetUno, libroPost, libroPut, libroDelete } = require('../controllers/libro-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const router = Router();

//Ruta para pedir todos los libros
router.get('/', libroGet);

//Ruta para pedir los que pertenecen al usuario, se valida el JWT
router.get('/los_mios', [
    validarJWT,
    validarCampos
], libroGet_LosMios);

//Ruta para pedir un libro por el id, se valida que el id sea un id de mongoDB
router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarCampos
], libroGetUno);

//Ruta para insertar un nuevo libro, se validan todos los compas de libro y el JWT
router.post('/', [
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('anno', 'El año es obligatorio').isNumeric(),
    check('autor', 'El autor no es un MongoID').isMongoId(),
    validarArchivoSubir,
    validarJWT,
    validarCampos
], libroPost);

//Ruta para modificar un libro por el id, se validan todos los campos del libro y
//el JWT para poder comprobar que el libro pertenece al usuario que desea modificarlo 
router.put('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('anno', 'El año es obligatorio').isNumeric(),
    check('autor', 'El autor no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], libroPut);

//Ruta para eliminar un libro por el id, se valida el JWT para poder comprobar
//que el libro pertenece al usuario que desea modificarlo
router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], libroDelete);

module.exports = router;