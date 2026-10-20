export default async function handler(req, res) {
  // Configurar CORS para aceitar requisições do seu app
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

    // Montar o prompt estratégico para o Gemini
    const prompt = `Atue como um agente especialista em negociação de publis para influenciadores digitais. 
    O criador tem ${followers || 100}k seguidores e uma taxa de engajamento de ${engagement || 4.8}%.
    A marca enviou a seguinte mensagem/proposta: "${brandMessage}".
    
    Por favor, analise a proposta e retorne estritamente:
    1. Uma análise curta se vale a pena ou se está abaixo do valor de mercado.
    2. O valor de cachê sugerido em Reais (R$).
    3. Uma sugestão de resposta profissional pronta para o criador copiar e colar para a marca.`;

    // Chamar diretamente a API oficial do Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Não foi possível gerar a resposta no momento.';

    return res.status(200).json({ result: aiText });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao processar a inteligência artificial.' });
  }
}
