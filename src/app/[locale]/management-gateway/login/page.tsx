import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  
  if (token?.value === (process.env.ADMIN_SECRET || 'secret123')) {
    redirect('/id/management-gateway/dashboard');
  }

  async function loginAction(formData: FormData) {
    'use server';
    const password = formData.get('password');
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
      const cookiesStore = await cookies();
      cookiesStore.set('admin_token', process.env.ADMIN_SECRET || 'secret123', { httpOnly: true, path: '/' });
      redirect('/id/management-gateway/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
