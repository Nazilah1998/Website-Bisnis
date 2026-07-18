import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { invoices, projects, clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

function generateDokuSignature(
  clientId: string,
  requestId: string,
  requestTimestamp: string,
  requestTarget: string,
  body: unknown,
  secretKey: string
) {
  const digest = crypto.createHash('sha256').update(JSON.stringify(body)).digest('base64');
  const signatureString = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
  const hmac = crypto.createHmac('sha256', secretKey).update(signatureString).digest('base64');
  return `HMACSHA256=${hmac}`;
}

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();
    if (!invoiceId) return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });

    const clientId = process.env.DOKU_CLIENT_ID;
    const secretKey = process.env.DOKU_SECRET_KEY;
    
    if (!clientId || !secretKey) {
      throw new Error('DOKU credentials are not set');
    }

    // Get Invoice and Client details using joins
    const result = await db
      .select({
        inv: invoices,
        cli: clients,
      })
      .from(invoices)
      .leftJoin(projects, eq(invoices.projectId, projects.id))
      .leftJoin(clients, eq(projects.clientId, clients.id))
      .where(eq(invoices.id, invoiceId))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const { inv, cli } = result[0];

    if (inv.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (request.headers.get('origin') ? request.headers.get('origin') : 'http://localhost:3000');

    // Prepare DOKU Checkout Payload
    const payload = {
      order: {
        amount: inv.amount,
        // Tambahkan timestamp agar invoice_number selalu unik per percobaan bayar
        // DOKU menolak invoice_number yang sama jika sudah pernah dipakai sebelumnya
        // Format: <invoiceId>_<timestamp> — webhook akan mem-parse balik invoiceId dari sini
        invoice_number: `${inv.id}_${Date.now()}`,
        currency: 'IDR',
        callback_url: `${baseUrl}/id/client/dashboard`,
        // notification_url adalah URL server-to-server yang dipanggil DOKU setelah pembayaran berhasil
        // Ini BERBEDA dengan callback_url yang hanya redirect browser
        notification_url: `${baseUrl}/api/doku/webhook`,
        auto_redirect: true,
      },
      payment: {
        payment_due_date: 60 // 60 minutes
      },
      customer: {
        id: cli?.id || 'CUST-001',
        name: cli?.name || 'Client',
        email: cli?.email || 'client@example.com'
      }
    };

    const requestId = crypto.randomUUID();
    const requestTimestamp = new Date().toISOString().substring(0, 19) + "Z";
    const requestTarget = '/checkout/v1/payment';
    
    const signature = generateDokuSignature(
      clientId,
      requestId,
      requestTimestamp,
      requestTarget,
      payload,
      secretKey
    );

    const dokuResponse = await fetch('https://api-sandbox.doku.com/checkout/v1/payment', {
      method: 'POST',
      headers: {
        'Client-Id': clientId,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const dokuData = await dokuResponse.json();

    if (!dokuResponse.ok) {
      console.error('DOKU Checkout Error:', dokuData);
      throw new Error(dokuData?.error?.message || 'Gagal membuat sesi pembayaran DOKU');
    }

    return NextResponse.json({ 
      payment_url: dokuData.response.payment.url 
    });

  } catch (error: unknown) {
    console.error('DOKU API error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
