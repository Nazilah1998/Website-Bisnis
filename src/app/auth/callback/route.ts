import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Default to Indonesian locale for redirect if no locale specified
  const locale = searchParams.get('locale') || 'id';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user?.email) {
      const email = data.user.email;
      
      // Sync with our custom `clients` table
      let clientId = '';
      const existingClient = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
      
      if (existingClient.length > 0) {
        clientId = existingClient[0].id;
      } else {
        // Auto-register client if they don't exist in our custom table
        clientId = crypto.randomUUID();
        const randomPassword = crypto.randomUUID(); // They won't use this anyway
        const passwordHash = await bcrypt.hash(randomPassword, 10);
        
        await db.insert(clients).values({
          id: clientId,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: email,
          passwordHash,
          createdAt: new Date(),
        });
      }

      // Set our custom client_token cookie for the custom dashboard
      cookieStore.set('client_token', clientId, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
      
      return NextResponse.redirect(`${origin}/${locale}/client/dashboard`);
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/${locale}/client/login?error=oauth_failed`);
}
