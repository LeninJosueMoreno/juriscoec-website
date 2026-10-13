interface Env {
  DATABASE_URL: string
  RESEND_API_KEY: string
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>

declare namespace App {
  interface Locals extends Runtime {}
}
