export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { brandMessage, followers, engagement } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Chave da API do Gemini não configurada no servidor.' });
    }

    // Prompt conciso para processamento ultra-rápido
    const prompt = `Analise rápida de negociação de publis:
    Criador: ${followers || 100}k seguidores, ${engagement || 4.8}% engajamento.
    Proposta da marca: "${brandMessage}".
    
    Retorne de forma ultra objetiva:
    1. Avaliação rápida (se vale a pena ou permuta desvantajosa).
    2. Cachê sugerido (R$).
    3. Resposta curta e profissional para o criador copiar e enviar.`;

    const model = 'gemini-3.8-flash';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // Configurações para priorizar VELOCIDADE de resposta
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Erro na resposta da API Gemini.' });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiText) {
      return res.status(200).json({ result: aiText });
    } else {
      return res.status(503).json({ error: 'Não foi possível obter resposta no momento.' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao processar a inteligência artificial.' });
  }
}
