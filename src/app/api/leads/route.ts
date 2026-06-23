import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const id = crypto.randomUUID();
    
    await db.insert(leads).values({
      id,
      clientName: body.clientName,
      whatsappNumber: body.whatsappNumber,
      company: body.company || '-',
      requirements: body.requirements,
      estimatedBudget: body.estimatedBudget,
      status: 'New',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to save lead' }, { status: 500 });
  }
}
