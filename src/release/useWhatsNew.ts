import { useCallback, useState } from 'react'

const STORAGE_KEY = 'cube-solver:last-seen-version'

// localStorage pode lançar (modo privado, armazenamento bloqueado): o app
// funciona igual, só não lembra a última versão vista.
const read = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? undefined
  } catch {
    return undefined
  }
}
const write = (version: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, version)
  } catch {
    /* ignorado */
  }
}

/**
 * Abre "Novidades" sozinho quando o usuário volta depois de uma atualização.
 * Quem abre o app pela primeira vez não vê o modal: só a versão é guardada.
 */
export const useWhatsNew = (currentVersion: string) => {
  const [state] = useState(() => {
    const seen = read()
    if (!seen) write(currentVersion)
    return { seen, autoOpen: !!seen && seen !== currentVersion }
  })
  const [open, setOpen] = useState(state.autoOpen)

  const close = useCallback(() => {
    write(currentVersion)
    setOpen(false)
  }, [currentVersion])

  return { open, show: () => setOpen(true), close, seenBefore: state.autoOpen ? state.seen : undefined }
}
