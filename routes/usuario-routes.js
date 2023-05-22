const { Router } = require('express');
const { check } = require('express-validator');
const { esAdminRole } = require('../../../node/7-restserver/middlewares/validar-roles');
const { usuarioGet, usuarioGetUno, usuarioPost, usuarioPut, usuarioDelete } = require('../controllers/usuario-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

//Ruta para pedir todos los usuarios, solo los administradores tiene permiso
router.get('/', [
    validarJWT,
    esAdminRole,
    validarCampos
], usuarioGet);

//Ruta que devuelve un usuario por el id, solo pedra ser usada por los administradores
//o por el propio usuario
router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], usuarioGetUno);

//Ruta que permite insertar un nuevo usuario, se validan todos los campos de usuario
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña debe ser de 6 o más letras ').isLength({ min: 6 }),
    check('rol', 'El rol no es valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    validarCampos
], usuarioPost);

//Ruta que permite modificar un usuario por el id, solo podra ser usada por un administradores
//o por el propio usuario
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

//Ruta que permite eliminar un usuario por el id, solo podra ser usada por un administradores
//o por el propio usuario
router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], usuarioDelete);

module.exports = router;