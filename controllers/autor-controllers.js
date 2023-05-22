const express = require('express');
const { response, request } = require('express');
const Bcryptjs = require('bcryptjs');
const Autor = require('../database/autor');

//Devuelve todos los autores 
const autorGet = async (req = request, res = response) => {

    const { desde = 0, limite = 0 } = req.query;

    const [total, autores] = await Promise.all([
        Autor.countDocuments(),
        Autor.find()
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        autores
    })
};

//Devuelve todos los autores que esten relacionados con el usuario
const autorGet_LosMios = async (req = request, res = response) => {

    const query = { usuario: req.usuario._id };
    const { desde = 0, limite = 0 } = req.query;

    
    const [total, autores] = await Promise.all([
        Autor.countDocuments(query),
        Autor.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(201).json({
        ok: true,
        total,
        autores
    })
};

//Devuelve el autor al que pertenece el id, en caso de que exista
const autorGetUno = async (req = request, res = response) => {

    const { id } = req.params;
    
    //Compueba que existe el autor
    const autor = await Autor.findById(id);
    if (!autor) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe - autor no existe'
        });
    }

    res.status(201).json({
        ok: true,
        autor
    })
};

//Insertar un nuevo autor a la base de datos, el autor va a estar 
//relacionado con el usuario que lo inserto
const autorPost = async (req = request, res = response) => {

    const { nombre, apellidos, correo, orcid } = req.body;
    const usuario = req.usuario._id;
    const autor = Autor({ nombre, apellidos, correo, orcid, usuario });
    
    //comprueba que el correo no exista en la base de datos, ya que 
    //debe ser unico
    const existeEmail = await Autor.findOne({ correo });
    if (existeEmail) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }

    await autor.save();

    res.status(201).json({
        ok: true,
        autor
    })

};

//Modifica un autor por el id, solo lo puede modificar el 
//usuario que lo inserto 
const autorPut = async (req = request, res = response) => {

    //resivir y estructural datos
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const usuario = req.usuario._id;
    const { correo } = req.body;

    //Verificar si el autor existe
    const existeID = await Autor.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }
    
    //Se comprueba que el autor le pertenece al usuario  
    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene acceso a la información de este autor'
        });
    }

    //Se comprueba que el correo no este repetido en otro
    //autor en la base de datos
    const existeEmail = await Autor.findOne({ correo });
    if (existeEmail && (existeEmail.correo != existeID.correo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Ese correo ya esta registrado'
        });
    }
    
    //Se modifica el autor
    const autor = await Autor.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({
        ok: true,
        autor
    });

};

//Elima un autor por el id, solo eliminar si el autor
//pertenece al usuario  
const autorDelete = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario = req.usuario._id;

    //compruevo si el autor existe
    const existeID = await Autor.findById(id);
    if (!existeID) {
        return res.status(400).json({
            ok: false,
            msg: 'EL id no existe'
        });
    }
    
    //Se comprueba que el autor le pertenece al usuario  
    if (!usuario.equals(existeID.usuario)) {
        return res.status(400).json({
            ok: false,
            msg: 'Usted no tiene permitido eliminar este autor'
        });
    }

    //Se elimina de la base de datos 
    const autor = await Autor.findByIdAndDelete(id);

    res.status(201).json({
        ok: true,
        autor
    })
};

module.exports = {
    autorGet,
    autorGet_LosMios,
    autorGetUno,
    autorPost,
    autorPut,
    autorDelete
}
