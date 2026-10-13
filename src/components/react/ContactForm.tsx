import { useState } from 'react'
import { toast } from 'sonner'
import { sendEmail } from '../../services/email'
import type { ClientData, ContactFormData } from '../../../types'
import { registerClient } from '../../services/clients'
import { validateContactForm } from '../../lib/utils'

interface ContactFormProps {
  variant?: 'light' | 'dark'
}

export function ContactForm({ variant = 'dark' }: ContactFormProps) {
  const [loading, setLoading] = useState(false)

  const isLight = variant === 'light'

  const cardClasses = isLight
    ? 'rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(70,38,31,0.12)] sm:p-8'
    : 'bg-light/10 rounded-xl p-8 backdrop-blur intersect:animate-fade-up lg:intersect:animate-fade-left'

  const labelClasses = isLight
    ? 'mb-2 block text-sm font-medium text-foreground'
    : 'text-light mb-2 block'

  const inputClasses = isLight
    ? 'w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none'
    : 'bg-light/5 border-light/10 text-light placeholder:text-light/50 focus:border-primary w-full rounded-lg border px-4 py-1.5 focus:outline-none'

  const buttonClasses = isLight
    ? 'btn btn-primary btn-base w-full'
    : 'btn btn-primary btn-base w-full'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    const dataToSend = Object.fromEntries(
      formData.entries(),
    ) as unknown as ContactFormData

    const dataToRegister: ClientData = {
      nombre: dataToSend.name,
      telefono: dataToSend.phone,
      correo: dataToSend.email,
    }

    setLoading(true)

    const validateData = validateContactForm(dataToSend)

    if (!validateData.isValid) {
      toast.error(validateData.error || 'Error en el formulario')
      setLoading(false)
      return
    }

    try {
      const result = await sendEmail(dataToSend)

      if (!result.success) {
        toast.error(result.message)
        return
      }

      await registerClient(dataToRegister)
      toast.success('¡Gracias! Tu mensaje ha sido enviado correctamente.')
      form.reset()
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo enviar el mensaje. Intenta nuevamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cardClasses}>
      <form className='space-y-5' onSubmit={handleSubmit}>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div>
            <label htmlFor='name' className={labelClasses}>
              Nombre:
            </label>
            <input
              type='text'
              id='name'
              name='name'
              className={inputClasses}
              placeholder='Jhon Doe'
              required
            />
          </div>
          <div>
            <label htmlFor='phone' className={labelClasses}>
              Teléfono:
            </label>
            <input
              type='tel'
              id='phone'
              name='phone'
              className={inputClasses}
              placeholder='099 123 4567'
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor='email' className={labelClasses}>
            Email:
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className={inputClasses}
            placeholder='tu@email.com'
            required
          />
        </div>

        <div>
          <label htmlFor='subject' className={labelClasses}>
            Asunto:
          </label>
          <input
            type='text'
            id='subject'
            name='subject'
            className={inputClasses}
            placeholder='Asunto de tu mensaje'
            required
          />
        </div>

        <div>
          <label htmlFor='message' className={labelClasses}>
            Mensaje:
          </label>
          <textarea
            id='message'
            name='message'
            rows={3}
            className={inputClasses + ' min-h-32 resize-none py-3'}
            placeholder='Escribe tu mensaje aquí...'
            required
          ></textarea>
        </div>

        <button type='submit' disabled={loading} className={buttonClasses}>
          {loading ? (
            <>
              <Spinner />
              <span className='ml-2'>Enviando...</span>
            </>
          ) : (
            'Enviar Mensaje'
          )}
        </button>
      </form>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      aria-hidden='true'
      className='h-5 w-5 animate-spin fill-white text-gray-200'
      viewBox='0 0 100 101'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
        fill='currentColor'
      />
      <path
        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
        fill='currentFill'
      />
    </svg>
  )
}
