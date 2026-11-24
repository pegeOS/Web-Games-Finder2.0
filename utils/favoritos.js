const crypto = require('crypto')

// Transforma o IP do visitante num código que não revela o IP
function idDoVisitante(req) {
  return crypto
    .createHmac('sha256', process.env.IP_SECRET || 'troque-isto')
    .update(req.ip)
    .digest('hex')
}

// Recebe a lista de jogos e marca favorito: true/false para ESTE visitante
async function marcarFavoritos(db, req, jogos) {
  const favs = await db.collection('favoritos')
    .find({ visitante: idDoVisitante(req) })
    .toArray()
  const ids = new Set(favs.map(f => String(f.jogoId)))
  return jogos.map(j => ({ ...j, favorito: ids.has(String(j._id)) }))
}

module.exports = { idDoVisitante, marcarFavoritos }