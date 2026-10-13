interface Partner {
  slug: string
  name: string
  email: string
  role: string
  image: string
  description: string
  specialties: string[]
}

export const partners: Partner[] = [
  {
    slug: 'nathalia-zuniga',
    name: 'Abg. Nathalia Zúñiga',
    email: 'nathalia.zuniga@juriscoec.co',
    role: 'Socia · Colombia y Ecuador',
    image: '/images/partners/nathalia-zuniga-photo.jpg',
    description:
      'Abogada graduada de la Universidad Católica de Colombia, con Maestría en Litigio y Arbitraje Internacional por la Universidad San Francisco de Quito. Se encuentra habilitada para ejercer la profesión tanto en Colombia como en Ecuador, brindando asesoría jurídica integral. Su práctica profesional se enfoca en las áreas de derecho civil y derecho de familia, donde acompaña a personas y empresas en la prevención, gestión y solución de conflictos legales.',
    specialties: ['Derecho civil', 'Derecho de familia'],
  },
  {
    slug: 'patricia-zuniga',
    name: 'Abg. Patricia Zuñiga',
    email: 'patricia.zuniga@juriscoec.co',
    role: 'Socia · Colombia y Ecuador',
    image: '/images/partners/patricia-zuniga-portrait.webp',
    description:
      'Abogada graduada de la Universidad Católica de Colombia, con estudios de posgrado en Derecho Constitucional y Derecho Penal Militar por la Universidad Militar Nueva Granada. Se encuentra habilitada para ejercer la profesión y patrocinar causas tanto en Colombia como en Ecuador, brindando asesoría jurídica integral con una visión jurídica binacional. Cuenta con amplia experiencia en las áreas de derecho civil, familia y constitucional, así como una sólida trayectoria en litigio y representación judicial.',
    specialties: ['Derecho civil', 'Familia', 'Derecho constitucional'],
  },
]
