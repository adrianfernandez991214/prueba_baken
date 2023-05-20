const JWT = require('jsonwebtoken');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const poyload = { uid };

        JWT.sign(poyload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '10h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo general el JWT');
            } else {
                resolve(token);
            }
        });

    })

}

module.exports = {
    generarJWT
}