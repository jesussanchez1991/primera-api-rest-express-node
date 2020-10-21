const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express'); //npm install express
//const logger = require('./logger');
const config = require('config') //npm install config
const morgan = require('morgan'); //npm install morgan
const app = express();
const Joi = require('joi');



app.use(express.json());//body

//-------------------- 70 URL urlEncoded ----------
app.use(express.urlencoded({extended:true}));
// ---- Fin 70

// ---------------- 71 Recursos estáticos -------
app.use(express.static('carpetaPublica')); //se llama desde el navegador localhost:3000/prueba.txt
// ---- Fin 71

// --------------- 68 - 69 Creando Middleware ----------------
/*
app.use(logger);
app.use(function (req, res, next) {
    console.log('Autenticando...')
    next();
})
*/
//---- FIN 68-69

// -------------------- 73 Configuración de entorno ------------------
    console.log('Aplicación' + config.get('nombre'));
    console.log('BD Server: '+ config.get('configDB.host'));
// ---- FIN 73


// ------------ 72 Registros HTTP ------------
//Usando middleware de terceros
//73
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado'); //Registro de log
    inicioDebug('Morgan habilitado');
}
// ----- Fin 72

//------------- 74 Debug ------------
//Trabajos con la base de datos
dbDebug('Conectando con las bases de datos');
// --- Fin 74

const usuarios = [
    {id:1, nombre:'Jesus'},
    {id:2, nombre:'Eva'},
    {id:3, nombre:'Jimena'}
]

app.get('/',(req, res) => {
    res.send('Hola mundo desde Express')
});

app.get('/api/usuarios',(req,res) =>{
    res.send(usuarios);
});

app.get('/api/usuarios/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('Usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req,res) =>{

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

app.put('/api/usuarios/:id', (req, res) => {
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


app.delete('/api/usuarios/:id',(req,res) =>{
    let usuario = existeUsuario(req.params.id);

    if(!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
});


function existeUsuario(id) {
    return (usuarios.find(el => el.id === parseInt(id)));
}

function validarUsuario(nom) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: nom }));
}