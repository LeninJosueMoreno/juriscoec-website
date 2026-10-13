import type { APIRoute } from 'astro'
import type { ContactFormData } from '../../../types'
import { generateEmailTemplate, validateContactForm } from '../../lib/utils'

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as ContactFormData

    const validation = validateContactForm(body)

    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: validation.error,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const htmlTemplate = generateEmailTemplate(body)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Formulario Web <no-reply@juriscoec.co>',
        to: ['abogadazo@juriscoec.co'],
        subject: `Nuevo mensaje de ${body.name}`,
        html: htmlTemplate,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al enviar el correo electrónico')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
