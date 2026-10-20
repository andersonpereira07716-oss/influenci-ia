import React, { useState, useEffect } from 'react';
import { Sparkles, DollarSign, Users, TrendingUp, MessageSquare, ShieldCheck, Send, Copy, Check, Calculator, FileText, Lock, Crown, Zap } from 'lucide-react';

interface Deal {
  id: string;
  brand: string;
  value: number;
  status: 'Em Negociação' | 'Fechado' | 'Concluído';
  date: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'negotiator' | 'calculator' | 'contracts' | 'mediakit'>('dashboard');
  
  // Controle Freemium (Limites e Status VIP)
  const [isVip, setIsVip] = useState<boolean>(() => {
    return localStorage.getItem('influenci_ia_vip') === 'true';
  });
  const [usageCount, setUsageCount] = useState<number>(() => {
    return Number(localStorage.getItem('influenci_ia_usage') || 0);
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);

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

  // Histórico de Publis
  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('influenci_ia_deals');
    return saved ? JSON.parse(saved) : [
      { id: '1', brand: 'TechBrand Brasil', value: 4500, status: 'Fechado', date: '2026-10-18' },
      { id: '2', brand: 'GamerZone', value: 3200, status: 'Em Negociação', date: '2026-10-19' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('influenci_ia_deals', JSON.stringify(deals));
    localStorage.setItem('influenci_ia_usage', usageCount.toString());
    localStorage.setItem('influenci_ia_vip', isVip.toString());
  }, [deals, usageCount, isVip]);

  const totalRevenue = deals.reduce((acc, deal) => deal.status === 'Fechado' ? acc + deal.value : acc, 18450);

  const incrementUsage = () => {
    if (!isVip) {
      const nextUsage = usageCount + 1;
      setUsageCount(nextUsage);
    }
  };

      const handleAiNegotiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandMessage.trim()) return;

    if (!isVip && usageCount >= 3) {
      setShowUpgradeModal(true);
      return;
    }
    
    setLoading(true);
    setProposalResult(null);

    try {
      const response = await fetch('/api/ai-negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandMessage, followers, engagement })
      });

      const data = await response.json();

      if (data.error) {
        setProposalResult(`❌ Erro da IA: ${data.error}`);
      } else {
        setProposalResult(data.result);
        incrementUsage();
      }
    } catch (err) {
      setProposalResult('❌ Erro de conexão com o servidor seguro da IA.');
    } finally {
      setLoading(false);
    }
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

    if (!isVip && usageCount >= 3) {
      setShowUpgradeModal(true);
      return;
    }

    const text = `TERMO DE PARCERIA E COMERCIALIZAÇÃO DE CONTEÚDO\n\n` +
      `CONTRATANTE: ${contractBrand}\n` +
      `CRIADOR: Anderson Silva (@anderson-ps1)\n\n` +
      `1. ESCOPO DAS ENTREGAS:\n- ${contractDeliverables}\n\n` +
      `2. VALOR E PAGAMENTO:\n- Valor Total: R$ ${contractValue}\n- Condição: 50% no aceite e 50% após publicação.\n\n` +
      `3. DIREITOS DE IMAGEM:\nUso exclusivo para redes sociais pelo período de 30 dias.\n\n` +
      `Data: ${new Date().toLocaleDateString('pt-BR')}`;

    setGeneratedContract(text);
    incrementUsage();
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
            <p className="text-[10px] text-slate-400">Modelo Freemium Activo</p>
          </div>
        </div>
        
        {isVip ? (
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10px] text-amber-400 font-bold">
            <Crown className="w-3 h-3 text-amber-400" /> CREATOR PRO
          </div>
        ) : (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-[10px] text-purple-400 font-medium hover:border-purple-500/50 transition-all"
          >
            <Zap className="w-3 h-3 text-purple-400" /> {3 - usageCount} Créditos Grátis
          </button>
        )}
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

            {!isVip && (
              <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/30 border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-purple-300">Créditos Gratuitos do Mês</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Usaste {usageCount} de 3 consultas grátis.</p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold py-2 px-3 rounded-lg shadow-lg"
                >
                  Fazer Upgrade
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'negotiator' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-white mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> Negociador de DMs com IA Real
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Cole a proposta enviada pela marca. A IA analisa via backend seguro e retorna a estratégia de resposta.
              </p>

              <form onSubmit={handleAiNegotiate} className="space-y-3">
                <textarea
                  rows={3}
                  value={brandMessage}
                  onChange={(e) => setBrandMessage(e.target.value)}
                  placeholder="Ex: 'Olá, queremos mandar um produto em troca de divulgação nos stories...'"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !brandMessage.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  {loading ? 'Consultando a IA com segurança...' : <><Send className="w-3.5 h-3.5" /> Analisar com IA</>}
                </button>
              </form>
            </div>

            {proposalResult && (
              <div className="bg-purple-950/20 border border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-purple-300">Parecer do Google Gemini</span>
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
                Descubra o valor exato que você deve cobrar por pacote com base nas suas métricas.
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
              onClick={() => {
                navigator.clipboard.writeText("https://influenci-ia.vercel.app/m/anderson");
                alert('Link copiado com sucesso!');
              }}
              className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Copy className="w-4 h-4 text-purple-400" /> Copiar Link do Mídia Kit Dinâmico
            </button>
          </div>
        )}
      </main>

      {/* MODAL DE UPGRADE FREEMIUM / PAYWALL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 bg-purple-600/20 border border-purple-500/40 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Crown className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-white mb-1">Atingiste o teu limite gratuito!</h3>
            <p className="text-[11px] text-slate-300 mb-4 leading-relaxed">
              Consumiste as tuas 3 análises de IA gratuitas deste mês. Desbloqueia o plano <b>Creator Pro</b> para continuar a fechar publis com o valor justo.
            </p>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4 text-left space-y-2 text-[10px] text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Negociador IA de DMs Ilimitado
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Gerador de Contratos de Parceria
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Mídia Kit Dinâmico sem Marca d'Água
              </div>
            </div>

            <div className="mb-4">
              <span className="text-2xl font-black text-white">R$ 29,90</span>
              <span className="text-[10px] text-slate-400"> / mês</span>
            </div>

            <button
              onClick={() => {
                setIsVip(true);
                setShowUpgradeModal(false);
                alert('🎉 Parabéns! O teu plano Creator Pro (VIP) foi ativado com sucesso!');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-purple-500/30 transition-all mb-2"
            >
              Assinar Creator Pro (Ativação Instântanea)
            </button>

            <p className="text-[9px] text-slate-500">Cancela a qualquer momento sem fidelidade.</p>
          </div>
        </div>
      )}
    </div>
  );
}
