import type { APIRoute } from 'astro'
import type { ClientData } from '../../../types'
import { registerContact } from '../../db'
import { isValidEmail, isValidPhone } from '../../lib/utils'

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const contentType = request.headers.get('content-type')

    if (!contentType?.includes('application/json')) {
      return new Response(
        JSON.stringify({
          error: 'Content-Type must be application/json',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const body: ClientData = await request.json()
    const { nombre, correo, telefono } = body

    // Required fields validation
    if (!nombre || !correo || !telefono) {
      return new Response(
        JSON.stringify({
          error: 'Fields nombre, correo and telefono are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Name must be a valid text and cannot be empty',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof correo !== 'string' || !isValidEmail(correo)) {
      return new Response(
        JSON.stringify({
          error: 'correo must have a valid format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (typeof telefono !== 'string' || !isValidPhone(telefono)) {
      return new Response(
        JSON.stringify({
          error: 'Phone must have a valid format',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Clean and normalize data
    const cleanName = nombre.trim()
    const cleanEmail = correo.trim().toLowerCase()
    const cleanPhone = telefono.trim()

    // Try to insert into database
    const databaseUrl = locals.runtime.env.DATABASE_URL
    if (!databaseUrl) {
      console.error('DATABASE_URL is not configured')
      return new Response(JSON.stringify({ error: 'Servicio no disponible' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    await registerContact(databaseUrl, cleanName, cleanEmail, cleanPhone)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Client registered successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error: any) {
    console.error('Failed to register contact', error)
    if (error.code === '23505') {
      let message = 'A client with these details already exists'

      if (error.constraint?.includes('correo')) {
        message = 'A client with this correo is already registered'
      } else if (error.constraint?.includes('telefono')) {
        message = 'A client with this phone number is already registered'
      }

      return new Response(
        JSON.stringify({
          error: message,
          type: 'duplicate_value',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Generic server error
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        type: 'server_error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
