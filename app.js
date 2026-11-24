const express = require('express')
const { MongoClient } = require('mongodb')
const createError = require('http-errors')
const path = require('path')
require('dotenv').config()
const uri = process.env.URI
const client = new MongoClient(uri)

var homeRouter = require('./routes/home')
var catalogoRouter = require('./routes/catalogo')
var favoritosRouter = require('./routes/favoritos')
var explorarRouter = require('./routes/explorar')
var sobreRouter = require('./routes/sobre')
var jogosRouter = require('./routes/jogos')

const port = 5000;
var app = express()
app.set('trust proxy', 1) 
// Se publicar o site atrás de um proxy (Render, Railway, nginx...).
// Sem isso, req.ip seria o IP do proxy e todo mundo pareceria o mesmo visitante.

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//requisições para o projeto
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// o header usa isso para mostrar o botão Voltar em todas as telas, menos no menu (/)
app.use((req, res, next) => {
    res.locals.mostrarVoltar = req.path !== '/'
    next()
})
app.use('/', homeRouter)
app.use('/catalogo', catalogoRouter)
app.use('/favoritos', favoritosRouter)
app.use('/explorar', explorarRouter)
app.use('/sobre', sobreRouter)
app.use('/jogos', jogosRouter)

app.use((req, res, next) => {
    next(createError(404));
});


// Conecta no banco e guarda em app.locals.db (as rotas acessam com req.app.locals.db)
client.connect()
    .then(() => {
        app.locals.db = client.db()
        app.listen(port, () => {
            console.log("Servidor rodando...")
        })
    })
    .catch(err => {
        console.error('Falha ao conectar no MongoDB:', err.message)
        process.exit(1)
    })

module.exports = app;