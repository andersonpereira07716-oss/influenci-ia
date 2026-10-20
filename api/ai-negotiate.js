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

    const prompt = `Atue como um especialista em negociação de publis para influenciadores digitais.
    Dados do criador: ${followers || 100}k seguidores, ${engagement || 4.8}% de engajamento.
    Proposta da marca: "${brandMessage}".
    
    Retorne de forma estruturada, objetiva e direta:
    1. Análise se vale a pena ou se está abaixo do valor de mercado.
    2. Cachê sugerido em Reais (R$).
    3. Sugestão de resposta profissional e persuasiva pronta para o criador copiar e enviar para a marca.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 600
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Erro no processamento da IA.' });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiText) {
      return res.status(200).json({ result: aiText });
    } else {
      return res.status(503).json({ error: 'Servidores da IA sobrecarregados. Tente novamente em instantes.' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao processar a inteligência artificial.' });
  }
}
