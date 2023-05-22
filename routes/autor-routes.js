const { Router } = require('express');
const { check } = require('express-validator');
const { esAdminRole } = require('../../../node/7-restserver/middlewares/validar-roles');
const { autorGet, autorGetUno, autorPost, autorPut, autorDelete, autorGet_LosMios } = require('../controllers/autor-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

//Ruta para pedir todos los autores
router.get('/', autorGet);

//Ruta para pedir los que pertenecen al usuario, se valida el JWT
router.get('/los_mios', [
    validarJWT,
    validarCampos
], autorGet_LosMios);

//Ruta para pedir un autor por el id, se valida que el id sea un id de mongoDB
router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarCampos
], autorGetUno);

//Ruta para insertar un nuevo autor, se validan todos los compas de autor y el JWT
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('orcid', 'El ORCID debe ser de 6 o más caracteres').not().isEmpty(),
    validarJWT,
    validarCampos
], autorPost);

//Ruta para modificar un autor por el id, se validan todos los campos del autor y
//el JWT para poder comprobar que el autor pertenece al usuario que desea modificarlo 
router.put('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('orcid', 'El ORCID debe ser de 6 o más caracteres').not().isEmpty(),
    validarJWT,
    validarCampos
], autorPut);

//Ruta para eliminar un autor por el id, se valida el JWT para poder comprobar
//que el autor pertenece al usuario que desea modificarlo
router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], autorDelete);

module.exports = router;