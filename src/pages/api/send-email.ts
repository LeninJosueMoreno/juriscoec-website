import type { APIRoute } from 'astro'
import type { ContactFormData } from '../../../types'
import { generateEmailTemplate, validateContactForm } from '../../lib/utils'

export const POST: APIRoute = async ({ request, locals }) => {
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

    const resendApiKey = locals.runtime.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'Servicio no disponible' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const htmlTemplate = generateEmailTemplate(body)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Formulario Web <no-reply@juriscoec.co>',
        to: ['nathalia.zuniga@juriscoec.co'],
        subject: `Nuevo mensaje de ${body.name}`,
        html: htmlTemplate,
      }),
    })

    if (!response.ok) {
      console.error('Resend rejected the email', response.status, await response.text())
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
    console.error('Failed to send contact email', error)
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
