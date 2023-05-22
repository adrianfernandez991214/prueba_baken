const { validationResult } = require('express-validator');

//Se validar si existen errores en la validación de la request 
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json(errors);
    }

    next();
}



module.exports = {
    validarCampos
}
