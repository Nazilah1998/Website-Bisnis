import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { faqs, services, pricingPlans } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Gather context from DB
    const [allFaqs, allServices, allPricing] = await Promise.all([
      db.select().from(faqs),
      db.select().from(services),
      db.select().from(pricingPlans),
    ]);

    const faqContext = allFaqs.map(f => `Q: ${f.questionId}\nA: ${f.answerId}`).join('\n\n');
    const servicesContext = allServices.map(s => `- ${s.titleId}: ${s.descId}`).join('\n');
    const pricingContext = allPricing.map(p => `- ${p.name} (${p.type}): ${p.price}`).join('\n');

    const systemPrompt = `Kamu adalah asisten virtual untuk ZilyaDigital, sebuah agensi jasa pembuatan website dan aplikasi profesional di Indonesia.

Jawab pertanyaan pengunjung dengan ramah, singkat, dan profesional dalam bahasa Indonesia. Jika pertanyaan tidak relevan dengan layanan kami, arahkan mereka untuk menghubungi kami langsung.

=== DATA LAYANAN KAMI ===
${servicesContext}

=== PAKET HARGA ===
${pricingContext}

=== FAQ ===
${faqContext}

=== ATURAN ===
- Jawab HANYA dalam bahasa Indonesia
- Maksimal 3 kalimat per jawaban
- Jika tidak yakin atau butuh info lebih lanjut, arahkan pengunjung untuk klik tab "WhatsApp" di atas kotak chat ini, atau hubungi nomor 082157204572.
- Selalu akhiri dengan ajakan ramah untuk berkonsultasi lebih lanjut.
- Jangan buat janji di luar kapabilitas yang sudah disebutkan`;

    const tryGemini = async () => {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('No Gemini key');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nPertanyaan pengunjung: ${message}` }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      });
      if (!response.ok) throw new Error('Gemini API error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    };

    const tryGroq = async () => {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error('No Groq key');
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error('Groq API error');
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    };

    const tryMistral = async () => {
      const apiKey = process.env.MISTRAL_API_KEY;
      if (!apiKey) throw new Error('No Mistral key');
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error('Mistral API error');
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    };

    const tryOpenRouter = async () => {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) throw new Error('No OpenRouter key');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-preview-02-05:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });
      if (!response.ok) throw new Error('OpenRouter API error');
      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    };

    let reply = null;
    const providers = [tryGemini, tryGroq, tryMistral, tryOpenRouter];
    
    for (const provider of providers) {
      try {
        const result = await provider();
        if (result) {
          reply = result;
          break; // Stop and use this reply if successful
        }
      } catch {
        console.log('Fallback triggered, trying next provider...');
      }
    }

    if (!reply) {
      return NextResponse.json({ reply: 'Maaf, sistem chatbot sedang dalam pemeliharaan. Silakan hubungi kami langsung via WhatsApp ya!' });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ reply: 'Maaf, terjadi kesalahan. Silakan hubungi kami langsung via WhatsApp ya! 😊' });
  }
}
