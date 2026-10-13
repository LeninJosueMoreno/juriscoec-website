import { neon } from '@neondatabase/serverless'

export function registerContact(
  connectionString: string,
  nombre: string,
  correo: string,
  telefono: string,
) {
  const sql = neon(connectionString)
  return sql`
    INSERT INTO juriscoec_clientes (nombre, correo, telefono)
    VALUES (${nombre}, ${correo}, ${telefono})
  `
}
