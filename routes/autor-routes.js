const { Router } = require('express');
const { check } = require('express-validator');
const { esAdminRole } = require('../../../node/7-restserver/middlewares/validar-roles');
const { autorGet, autorGetUno, autorPost, autorPut, autorDelete, autorGet_LosMios } = require('../controllers/autor-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

router.get('/', autorGet);

router.get('/los_mios', [
    validarJWT,
    validarCampos
], autorGet_LosMios);

router.get('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarCampos
], autorGetUno);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('orcid', 'El ORCID debe ser de 6 o más caracteres').isLength({ min: 6 }),
    validarJWT,
    validarCampos
], autorPost);

router.put('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('orcid', 'El ORCID debe ser de 6 o más caracteres').isLength({ min: 6 }),
    validarJWT,
    validarCampos
], autorPut);

router.delete('/:id', [
    check('id', 'El id no es un MongoID').isMongoId(),
    validarJWT,
    validarCampos
], autorDelete);

module.exports = router;