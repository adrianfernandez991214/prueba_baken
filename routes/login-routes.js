const { Router } = require('express');
const { check } = require('express-validator');
const { login, renew } = require('../controllers/login-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

router.post('/', [
    check('correo', 'El correo  no es validor').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.get('/renew', [validarJWT], renew);


module.exports = router;