const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id:1, nombre:'Jesus'},
    {id:2, nombre:'Eva'},
    {id:3, nombre:'Jimena'}
]

ruta.get('/',(req,res) =>{
    res.send(usuarios);
});

ruta.get('/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('Usuario no fue encontrado');
    res.send(usuario);
});

ruta.post('/', (req,res) =>{

    const {value, error} = validarUsuario(req.body.nombre);

    if(!error){
        const usuario = {
            id: usuarios.length +1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }

    

});

ruta.put('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);

    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const {value, error} = validarUsuario(req.body.nombre);

    if(error){
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario); 
});


ruta.delete('/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);

    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
})

function existeUsuario(id) {
    return (usuarios.find(el => el.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom }));
}

module.exports = ruta;