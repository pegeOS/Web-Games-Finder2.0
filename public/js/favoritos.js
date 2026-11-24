// Clique no coração: pede ao servidor para inverter "favorito" no banco
// e atualiza a cor com o valor que o banco devolveu.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-favorito')
  if (!btn) return
  e.preventDefault()

  try {
    const res = await fetch('/jogos/' + btn.dataset.id + '/favorito', { method: 'POST' })
    if (!res.ok) throw new Error('Falha ao favoritar')
    const { favorito } = await res.json()

    btn.classList.toggle('ativo', favorito)
    btn.setAttribute('aria-pressed', favorito ? 'true' : 'false')
  } catch (err) {
    console.error(err.message)
  }
})