const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files, extensionesValidas = ['pdf', 'docx', 'docx'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        //Se comprueba que la extensión es valida, dada las extesiones que son pasadas 
        //por parametros como permita
        if (!extensionesValidas.includes(extension)) {
            return reject('Estensión no valida - solo se permite :' + extensionesValidas);
        }

        //Se genera un nuevo nombre con uuidv4 para que no repita
        const nombreTemp = uuidv4() + '.' + extension;
        //Se construlle path
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
         
        //se guarda el archivo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve(nombreTemp);
        });

    });

}

module.exports = { subirArchivo }