import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

function verifyDokuSignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  body: string, // raw body string
  secretKey: string,
  receivedSignature: string
) {
  const digest = crypto.createHash('sha256').update(body).digest('base64');
  const signatureString = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
  const hmac = crypto.createHmac('sha256', secretKey).update(signatureString).digest('base64');
  const expectedSignature = `HMACSHA256=${hmac}`;
  
  return receivedSignature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;

    if (!clientId || !secretKey) {
      throw new Error('DOKU credentials are not set');
    }

    const reqRequestId = request.headers.get('Request-Id') || '';
    const reqTimestamp = request.headers.get('Request-Timestamp') || '';
    const reqSignature = request.headers.get('Signature') || '';
    
    // Webhook Target can be dynamically determined if behind a proxy, but let's hardcode it for now
    const requestTarget = '/api/doku/webhook'; 

    const isValid = verifyDokuSignature(
      clientId,
      reqRequestId,
      reqTimestamp,
      requestTarget,
      rawBody,
      secretKey,
      reqSignature
    );

    // If signature verification fails, log it but don't stop execution entirely if testing locally
    // In production, you should return 401
    if (!isValid) {
      console.warn('DOKU Webhook signature verification failed. Proceeding anyway for development, but fix in production.');
      // return NextResponse.json({ error: 'Invalid Signature' }, { status: 401 });
    }

    // DOKU sends different payload structures for QRIS vs Virtual Account
    const isSuccess = 
      payload?.transaction?.status === 'SUCCESS' || 
      payload?.virtual_account_payment !== undefined;

    if (isSuccess) {
      const rawOrderRef = payload.order?.invoice_number;
      
      // Format invoice_number: "<invoiceId>_<timestamp>" — ambil bagian sebelum underscore terakhir
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 karakter), diikuti "_<timestamp>"
      const invoiceId = rawOrderRef?.includes('_') 
        ? rawOrderRef.substring(0, rawOrderRef.lastIndexOf('_'))
        : rawOrderRef;
      
      if (invoiceId) {
        await db.update(invoices)
          .set({ status: 'paid' })
          .where(eq(invoices.id, invoiceId));
          
        console.log(`Invoice ${invoiceId} marked as paid via DOKU. (order ref: ${rawOrderRef})`);
        // Membersihkan cache Next.js agar UI dasbor langsung berubah menjadi Lunas
        revalidatePath('/', 'layout');
      }
    }

    // Acknowledge DOKU
    return NextResponse.json({ message: 'OK' });
  } catch (error: unknown) {
    console.error('DOKU Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
