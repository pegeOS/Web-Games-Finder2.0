// Popula o banco com os dados de data/jogos.js. Rode uma vez:  node seed.js
// Pode rodar de novo: apaga as duas collections e recria (não duplica).
require('dotenv').config()
const { MongoClient } = require('mongodb')
const { categorias, jogos } = require('./data/jogos')

async function main() {
  const client = new MongoClient(process.env.URI)
  try {
    await client.connect()
    const db = client.db()

    await db.collection('categorias').deleteMany({})
    await db.collection('jogos').deleteMany({})

    await db.collection('categorias').insertMany(categorias)
    // jogos fora do top 10 ficam com ranking: null
    await db.collection('jogos').insertMany(jogos.map(j => ({ ranking: null, ...j })))

    console.log(`Pronto: ${categorias.length} categorias e ${jogos.length} jogos inseridos em "${db.databaseName}".`)
  } catch (err) {
    console.error('Erro no seed:', err.message)
    process.exitCode = 1
  } finally {
    await client.close()
  }
}
main()