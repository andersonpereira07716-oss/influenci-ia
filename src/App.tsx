import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Users, TrendingUp, MessageSquare, ShieldCheck, Send, Copy, Check, Calculator, FileText, Plus, Trash2 } from 'lucide-react';

interface Deal {
  id: string;
  brand: string;
  value: number;
  status: 'Em Negociação' | 'Fechado' | 'Concluído';
  date: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'negotiator' | 'calculator' | 'contracts' | 'mediakit'>('dashboard');
  
  // Negociador IA
  const [brandMessage, setBrandMessage] = useState('');
  const [proposalResult, setProposalResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculadora de Cachê
  const [followers, setFollowers] = useState(100);
  const [engagement, setEngagement] = useState(4.8);
  const [calcResult, setCalcResult] = useState<number | null>(null);

  // Gerador de Contrato
  const [contractBrand, setContractBrand] = useState('');
  const [contractValue, setContractValue] = useState('');
  const [contractDeliverables, setContractDeliverables] = useState('1 Reel + 3 Stories');
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);

  // Histórico de Publis (Persistência Local)
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('influenci_ia_deals');
    return saved ? JSON.parse(saved) : [
      { id: '1', brand: 'TechBrand Brasil', value: 4500, status: 'Fechado', date: '2026-10-18' },
      { id: '2', brand: 'GamerZone', value: 3200, status: 'Em Negociação', date: '2026-10-19' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('influenci_ia_deals', JSON.stringify(deals));
  }, [deals]);

  const totalRevenue = deals.reduce((acc, deal) => deal.status === 'Fechado' ? acc + deal.value : acc, 18450);

  const handleAiNegotiate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandMessage.trim()) return;
    
    setLoading(true);
    setProposalResult(null);

    setTimeout(() => {
      setLoading(false);
      setProposalResult(
        `🤖 **Análise da Inteligência:**\nA marca solicitou divulgação sem definir orçamento explícito.\n\n**Sugestão de Resposta Profissional:**\n"Olá! Obrigado pelo contacto e interesse em colaborar connosco. Para o formato de conteúdo com maior retorno no nosso perfil, o valor de investimento para este pacote é de R$ 4.500,00. Podemos avançar com o envio do briefing e termo de parceria?"`
      );
    }, 1000);
  };

  const calculateCache = (e: React.FormEvent) => {
    e.preventDefault();
    const base = (followers * 1000 * 0.025) * (engagement / 4);
    const finalValue = Math.max(base, 350);
    setCalcResult(Math.round(finalValue));
  };

  const generateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractBrand || !contractValue) return;

    const text = `TERMO DE PARCERIA E COMERCIALIZAÇÃO DE CONTEÚDO\n\n` +
      `CONTRATANTE: ${contractBrand}\n` +
      `CRIADOR: Anderson Silva (@anderson-ps1)\n\n` +
      `1. ESCOPO DAS ENTREGAS:\n- ${contractDeliverables}\n\n` +
      `2. VALOR E PAGAMENTO:\n- Valor Total: R$ ${contractValue}\n- Condição: 50% no aceite e 50% após publicação.\n\n` +
      `3. DIREITOS DE IMAGEM:\nUso exclusivo para redes sociais pelo período de 30 dias.\n\n` +
      `Data: ${new Date().toLocaleDateString('pt-BR')}`;

    setGeneratedContract(text);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-10">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-purple-600 to-pink-600 p-2 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Influenci IA
            </h1>
            <p className="text-[10px] text-slate-400">Autonomia & Gestão para Criadores</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-[10px] text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          IA Ativa
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex border-b border-slate-800 bg-slate-900/40 px-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-w-[70px] py-3 text-[11px] font-semibold border-b-2 transition-all text-center ${
            activeTab === 'dashboard' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Painel
        </button>
        <button
          onClick={() => setActiveTab('negotiator')}
          className={`flex-1 min-w-[80px] py-3 text-[11px] font-semibold border-b-2 transition-all text-center ${
            activeTab === 'negotiator' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Negociador
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 min-w-[75px] py-3 text-[11px] font-semibold border-b-2 transition-all text-center ${
            activeTab === 'calculator' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Cachê IA
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex-1 min-w-[80px] py-3 text-[11px] font-semibold border-b-2 transition-all text-center ${
            activeTab === 'contracts' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Contratos
        </button>
        <button
          onClick={() => setActiveTab('mediakit')}
          className={`flex-1 min-w-[70px] py-3 text-[11px] font-semibold border-b-2 transition-all text-center ${
            activeTab === 'mediakit' ? 'border-purple-500 text-purple-400 bg-purple-500/5' : 'border-transparent text-slate-400'
          }`}
        >
          Mídia Kit
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-xl">
              <span className="text-[11px] text-purple-300 font-medium uppercase tracking-wider">Faturamento do Mês</span>
              <div className="text-3xl font-extrabold text-white mt-1">R$ {totalRevenue.toLocaleString('pt-BR')},00</div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +24% em relação ao mês anterior
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs">Seguidores</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-bold text-white">128.4K</div>
                <span className="text-[10px] text-emerald-400">Engajamento: 4.8%</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs">Publis Ativas</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white">{deals.length} Marcas</div>
                <span className="text-[10px] text-slate-400">Em acompanhamento</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Alertas da Inteligência
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                ⚡ 3 marcas enviaram mensagem direta hoje sem propor cachê. Utilize a aba <b>Negociador</b> para filtrar e gerar respostas automáticas.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'negotiator' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Resposta Automática para DMs de Marcas
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Cole a proposta da marca para que a IA avalie se vale a pena e crie uma resposta profissional cobrando o justo.
              </p>

              <form onSubmit={handleAiNegotiate} className="space-y-3">
                <textarea
                  rows={3}
                  value={brandMessage}
                  onChange={(e) => setBrandMessage(e.target.value)}
                  placeholder="Ex: 'Olá, adoramos o teu perfil. Queremos mandar um kit em troca de divulgação...'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !brandMessage.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? 'Analisando proposta...' : <><Send className="w-3.5 h-3.5" /> Analisar e Gerar Resposta</>}
                </button>
              </form>
            </div>

            {proposalResult && (
              <div className="bg-purple-950/20 border border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-300">Parecer da IA</span>
                  <button
                    onClick={() => copyToClipboard(proposalResult)}
                    className="text-[10px] text-purple-400 flex items-center gap-1 bg-purple-950/50 px-2 py-1 rounded border border-purple-800/50"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="text-[11px] text-slate-200 whitespace-pre-line leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {proposalResult}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" /> Precificador de Publi por IA
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Descubra o valor exato que você deve cobrar por pacote (Stories + Reels) com base nas suas métricas.
              </p>

              <form onSubmit={calculateCache} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Número de Seguidores (em milhar, ex: 100 para 100k)</label>
                  <input
                    type="number"
                    value={followers}
                    onChange={(e) => setFollowers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Taxa de Engajamento Média (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={engagement}
                    onChange={(e) => setEngagement(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  Calcular Cachê Ideal
                </button>
              </form>
            </div>

            {calcResult !== null && (
              <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold">Valor Sugerido por Pacote (Reels + Stories)</span>
                <div className="text-2xl font-black text-white mt-1">R$ {calcResult.toLocaleString('pt-BR')},00</div>
                <p className="text-[10px] text-slate-400 mt-2">Calculado com base em retenção, alcance médio e conversão do seu público.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Gerador de Termos e Contratos
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Gere um termo formal de parceria para enviar à marca e garanta seus direitos antes da publicação.
              </p>

              <form onSubmit={generateContract} className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nome da Marca Contratante</label>
                  <input
                    type="text"
                    placeholder="Ex: Nike Brasil"
                    value={contractBrand}
                    onChange={(e) => setContractBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Valor Acordado (R$)</label>
                    <input
                      type="text"
                      placeholder="Ex: 4500"
                      value={contractValue}
                      onChange={(e) => setContractValue(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Formatos/Entregas</label>
                    <input
                      type="text"
                      placeholder="Ex: 1 Reel + 2 Stories"
                      value={contractDeliverables}
                      onChange={(e) => setContractDeliverables(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  Gerar Termo de Parceria
                </button>
              </form>
            </div>

            {generatedContract && (
              <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-300">Termo Pronto para Envio</span>
                  <button
                    onClick={() => copyToClipboard(generatedContract)}
                    className="text-[10px] text-purple-400 flex items-center gap-1 bg-purple-950/50 px-2 py-1 rounded border border-purple-800/50"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado!' : 'Copiar Termo'}
                  </button>
                </div>
                <pre className="text-[10px] text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {generatedContract}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mediakit' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-tr from-slate-900 to-purple-950/40 border border-slate-800 rounded-2xl p-5 text-center">
              <div className="w-14 h-14 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400 font-bold text-sm">
                AS
              </div>
              <h3 className="font-bold text-white text-sm">Anderson Silva</h3>
              <p className="text-[11px] text-purple-400 font-medium">@anderson-ps1 • Tech & Creator</p>
              
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Alcance</div>
                  <div className="font-bold text-xs text-white">450K/mês</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Engajamento</div>
                  <div className="font-bold text-xs text-emerald-400">4.8%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Público</div>
                  <div className="font-bold text-xs text-white">18-34 anos</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard("https://influenci-ia.app/m/anderson")}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-4 h-4 text-purple-400" /> Copiar Link do Mídia Kit Dinâmico
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
