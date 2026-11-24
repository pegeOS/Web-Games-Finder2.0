var express = require('express')
var router = express.Router()
const { ObjectId } = require('mongodb')
const { idDoVisitante } = require('../utils/favoritos')

router.post('/:id/favorito', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ erro: 'id inválido' })
    }

    const col = req.app.locals.db.collection('favoritos')
    const chave = { visitante: idDoVisitante(req), jogoId: new ObjectId(req.params.id) }

    // Se já era favorito, apaga (desfavorita)
    const apagou = await col.deleteOne(chave)
    if (apagou.deletedCount === 1) return res.json({ favorito: false })

    // Senão, cria (favorita)
    try {
      await col.insertOne({ ...chave })
    } catch (err) {
      if (err.code !== 11000) throw err // 11000 = já existia (duplo clique)
    }
    res.json({ favorito: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: 'erro no servidor' })
  }
})

module.exports = router