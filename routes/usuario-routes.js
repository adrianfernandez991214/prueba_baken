const { Router } = require('express');
const { check } = require('express-validator');
const { esAdminRole } = require('../../../node/7-restserver/middlewares/validar-roles');
const { usuarioGet, usuarioGetUno, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/usuario-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], usuarioGet);

router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], usuarioGetUno);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 o más letras ').isLength({ min: 6 }),
    check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuarioPost);

router.put('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 o más letras ').isLength({ min: 6 }),
    check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarJWT,
    validarCampos
], usuarioPut);

router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], usuarioDelete);

module.exports = router;