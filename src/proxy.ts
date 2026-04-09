import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Routes accessibles sans auth Clerk (landing, auth, APIs publiques)
const isPublic = createRouteMatcher([
  '/',
  '/demo(.*)',
  '/login(.*)',
  '/signup(.*)',
  '/p/(.*)',
  '/api/public/(.*)',
  '/api/demo/(.*)',
  '/api/webhooks/(.*)',
  '/api/recipient/(.*)',
])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Routes publiques → laisser passer
  if (isPublic(request)) return

  // Session sandbox → bypass Clerk pour les routes protégées
  // Le cookie ml-demo est posé par /api/demo/verify après Turnstile.
  // Même si quelqu'un le falsifie, les pages utilisent getDemoProfile()
  // et les API routes ont leur propre requireAuth() — aucun risque sur les vraies données.
  const demoCookie = request.cookies.get('ml-demo')
  if (demoCookie?.value === '1') return NextResponse.next()

  // Sinon : protection Clerk standard
  await auth.protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
