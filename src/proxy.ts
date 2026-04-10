import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/demo', '/login', '/signup', '/p/']
const PUBLIC_API   = ['/api/public/', '/api/demo/', '/api/webhooks/', '/api/recipient/']

function isPublicRoute(pathname: string) {
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) return true
  if (PUBLIC_API.some(p => pathname.startsWith(p))) return true
  return false
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Sandbox demo → bypass auth
  if (request.cookies.get('ml-demo')?.value === '1') return response

  // Routes publiques → laisser passer
  if (isPublicRoute(request.nextUrl.pathname)) return response

  // Vérifier la session Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
