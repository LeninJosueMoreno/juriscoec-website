import type { ClientData } from '../../types'

export async function registerClient(clientData: ClientData) {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  })

  if (!response.ok) {
    throw new Error('No se pudo registrar el contacto. Intenta nuevamente.')
  }

  return response.json()
}
