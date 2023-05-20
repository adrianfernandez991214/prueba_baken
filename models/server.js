const express = require('express');
const cors = require('cors');
const { dbConnection } = require("../database/config");
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        //Conectar base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas
        this.routes();
    }


    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //Cors 
        this.app.use(cors());
        //Lectura y parseo del body
        this.app.use(express.json());
        //Public estatico
        this.app.use(express.static('public'));
        //fileUpload - cargar archivo
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use('/usuarios', require('../routes/usuario-routes'));
        this.app.use('/login', require('../routes/login-routes'));
        this.app.use('/autor', require('../routes/autor-routes'));
        this.app.use('/libro', require('../routes/libro-routes'));
        this.app.use('/archivo', require('../routes/archivo-rutas'));

    }

    listen() {

        this.app.listen(process.env.PORT, () => {
            console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
        });

    }

}


module.exports = Server;