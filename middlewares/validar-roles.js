const { response } = require("express");

//Se comprueba que sea Admin
const esAdminRole = async (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin el token primero'
        });
    }

    const { rol } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'No es un administrador no puede hacer esto'
        });
    }

    next();

}


//Se comprueba que el rol enviado por la request, este entre los permitidos
const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin el token primero'
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: 'El servicio requiere uno de estos roles ' + roles
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
};
