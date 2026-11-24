var express = require('express')
var router = express.Router()
const { idDoVisitante } = require('../utils/favoritos')

// Lista os jogos favoritados por ESTE visitante (identificado pelo IP)
router.get('/', async (req, res, next) => {
  try {
    const db = req.app.locals.db

    const favs = await db.collection('favoritos')
      .find({ visitante: idDoVisitante(req) })
      .toArray()
    const ids = favs.map(f => f.jogoId)

    const lista = ids.length
      ? await db.collection('jogos').find({ _id: { $in: ids } }).toArray()
      : []

    // todos aqui são favoritos, então o coração já aparece amarelo
    const jogos = lista.map(j => ({ ...j, favorito: true }))
    res.render('favoritos', { jogos })
  } catch (err) {
    next(err)
  }
})

module.exports = router