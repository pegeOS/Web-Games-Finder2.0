var express = require('express')
var router = express.Router()
const { marcarFavoritos } = require('../utils/favoritos')

// /explorar -> botões com as categorias
router.get('/', async (req, res, next) => {
  try {
    const categorias = await req.app.locals.db.collection('categorias').find().toArray()
    res.render('explorar', { categorias })
  } catch (err) {
    next(err)
  }
})

// /explorar/anime, /explorar/games, ... -> jogos da categoria (mesma tela, muda pelo parâmetro)
router.get('/:slug', async (req, res, next) => {
  try {
    const db = req.app.locals.db
    const categoria = await db.collection('categorias').findOne({ slug: req.params.slug })
    if (!categoria) return res.redirect('/explorar')

    const lista = await db.collection('jogos').find({ categoria: categoria.slug }).toArray()
    const jogos = await marcarFavoritos(db, req, lista)
    res.render('categoria', { categoria, jogos })
  } catch (err) {
    next(err)
  }
})

module.exports = router