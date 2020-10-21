const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express'); //npm install express
//const logger = require('./logger');
const config = require('config') //npm install config
const morgan = require('morgan'); //npm install morgan
const app = express();

const usuarios = require('./routers/usuarios');



app.use(express.json());//body

//-------------------- 70 URL urlEncoded ----------
app.use(express.urlencoded({extended:true}));
// ---- Fin 70

// ---------------- 71 Recursos estáticos -------
app.use(express.static('carpetaPublica')); //se llama desde el navegador localhost:3000/prueba.txt
// ---- Fin 71

// --------------- 77 Estructurar Rutas -------------
app.use('/api/usuarios',usuarios);
// ----- Fin 77

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


app.get('/',(req, res) => {
    res.send('Hola mundo desde Express')
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`)
});

