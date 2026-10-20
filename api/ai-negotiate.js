export const config = {
  runtime: 'edge', // Usa a Edge Runtime da Vercel para streaming ultrarrápido
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { brandMessage, followers, engagement } = await req.json();
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Chave API não encontrada.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analise de negociação para criador de conteúdo:
    Métricas: ${followers || 100}k seguidores | ${engagement || 4.8}% engajamento.
    Proposta recebida: "${brandMessage}".
    
    Retorne de forma objetiva:
    1. Análise de Viabilidade (vale a pena ou se o valor está abaixo).
    2. Cachê Sugerido (em R$).
    3. Resposta Profissional Pronta para copiar e colar para a marca.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro interno no servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
