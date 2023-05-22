const { Router } = require('express');
const { check } = require('express-validator');
const { login, renew } = require('../controllers/login-controllers');
const { validarCampos } = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const router = Router();

//Iniciar sesión o Login, donde es necesario el correo y el password
router.post('/', [
    check('correo', 'El correo  no es validor').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

//Refresh token
router.get('/renew', [validarJWT], renew);


module.exports = router;