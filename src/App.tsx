import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  User, 
  MapPin, 
  Building2, 
  Calendar, 
  Package, 
  Hash, 
  DollarSign, 
  Info,
  ChevronRight,
  Loader2,
  Copy,
  Check,
  Smile,
  Frown,
  Meh,
  BarChart3
  ,HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeText } from './services/gemini';
import { NERResult, EntityType, Entity } from './types';
import { HowItWorksModal } from './components/HowItWorksModal';

const ENTITY_ICONS: Record<EntityType, React.ReactNode> = {
  [EntityType.PERSON]: <User size={14} />,
  [EntityType.LOCATION]: <MapPin size={14} />,
  [EntityType.ORGANIZATION]: <Building2 size={14} />,
  [EntityType.EVENT]: <Calendar size={14} />,
  [EntityType.CONSUMER_GOOD]: <Package size={14} />,
  [EntityType.NUMBER]: <Hash size={14} />,
  [EntityType.PRICE]: <DollarSign size={14} />,
  [EntityType.OTHER]: <Info size={14} />,
};

const DEFAULT_TEXT = "Google was founded on September 4, 1998, by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. The company went public in 2004 and moved to its headquarters in Mountain View, California, known as the Googleplex. In 2015, Google was reorganized as the principal subsidiary of the holding company Alphabet Inc. Sundar Pichai was appointed CEO of Google, replacing Larry Page, who became the CEO of Alphabet. The Pixel 8 Pro, their latest smartphone, retails for $999.";

const getSentimentIcon = (score: number) => {
  if (score > 0.25) return <Smile size={18} className="text-green-500" />;
  if (score < -0.25) return <Frown size={18} className="text-red-500" />;
  return <Meh size={18} className="text-amber-500" />;
};

const getSentimentLabel = (score: number) => {
  if (score > 0.6) return "Very Positive";
  if (score > 0.2) return "Positive";
  if (score > -0.2) return "Neutral";
  if (score > -0.6) return "Negative";
  return "Very Negative";
};

export default function App() {
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [result, setResult] = useState<NERResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeText(inputText);
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze text. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAnnotatedText = useMemo(() => {
    if (!result) return null;

    const parts: React.ReactNode[] = [];
    const regex = /<entity type="([^"]+)" id="([^"]+)">([\s\S]*?)<\/entity>/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(result.annotated_text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(result.annotated_text.substring(lastIndex, match.index));
      }

      const type = match[1] as EntityType;
      const id = match[2];
      const content = match[3];
      const entity = result.entities.find(e => e.id === parseInt(id));

      parts.push(
        <span key={`${id}-${match.index}`} className={`entity-tag entity-${type} mx-0.5 group relative`}>
          {ENTITY_ICONS[type]}
          {content}
          <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 flex flex-col items-center gap-0.5 shadow-xl">
            <span className="font-bold uppercase tracking-wider">{type}</span>
            {entity && (
              <span className="opacity-80">Salience: {(entity.salience * 100).toFixed(0)}%</span>
            )}
          </span>
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < result.annotated_text.length) {
      parts.push(result.annotated_text.substring(lastIndex));
    }

    return parts;
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Lumina NER</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Entity & Sentiment Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
          >
            <HelpCircle size={16} /> How It Works
          </button>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-600">Gemini 3.1 Pro Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Section */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Search size={16} className="text-gray-400" />
                Input Text
              </span>
              <button 
                onClick={handleCopy}
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-500"
                title="Copy text"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to analyze..."
              className="flex-1 p-4 text-sm leading-relaxed resize-none focus:outline-none bg-white font-sans min-h-[300px]"
            />
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-100"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze Text
                  </>
                )}
              </button>
              {error && (
                <p className="mt-3 text-xs text-red-600 font-medium text-center">{error}</p>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-300"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Info size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Analysis</h3>
                <p className="text-sm text-gray-500 max-w-xs">
                  Paste your text on the left and click "Analyze Text" to begin the NLP analysis.
                </p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
                </div>
                <p className="mt-6 text-sm font-medium text-gray-600 animate-pulse">Processing natural language patterns...</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                {/* Sentiment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      result.overall_sentiment.score > 0.25 ? 'bg-green-50 text-green-600' : 
                      result.overall_sentiment.score < -0.25 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {getSentimentIcon(result.overall_sentiment.score)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall Sentiment</p>
                      <h4 className="text-lg font-bold text-gray-900">{getSentimentLabel(result.overall_sentiment.score)}</h4>
                      <p className="text-xs text-gray-500">Score: {result.overall_sentiment.score.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Emotional Magnitude</p>
                      <h4 className="text-lg font-bold text-gray-900">{result.overall_sentiment.magnitude.toFixed(2)}</h4>
                      <p className="text-xs text-gray-500">Strength of emotional content</p>
                    </div>
                  </div>
                </div>

                {/* Annotated Text View */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">Annotated Analysis</span>
                  </div>
                  <div className="p-6 text-sm leading-loose text-gray-800 whitespace-pre-wrap">
                    {renderAnnotatedText}
                  </div>
                </div>

                {/* Entity List View */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Entity Breakdown</span>
                    </div>
                    <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {result?.entities.length} Found
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                          <th className="px-4 py-3 border-b border-gray-100">Entity</th>
                          <th className="px-4 py-3 border-b border-gray-100">Category</th>
                          <th className="px-4 py-3 border-b border-gray-100">Salience</th>
                          <th className="px-4 py-3 border-b border-gray-100">Sentiment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {result?.entities
                          .sort((a, b) => b.salience - a.salience)
                          .map((entity) => (
                          <tr key={entity.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-gray-900">{entity.text}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`entity-tag entity-${entity.type} scale-90 origin-left`}>
                                {ENTITY_ICONS[entity.type]}
                                {entity.type}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${entity.salience * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">{(entity.salience * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {entity.sentiment !== undefined ? (
                                <div className="flex items-center gap-1">
                                  {getSentimentIcon(entity.sentiment)}
                                  <span className="text-[10px] font-bold text-gray-500">{entity.sentiment.toFixed(1)}</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-gray-300">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <HowItWorksModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center">
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
          © 2026 Lumina NER Engine. Developed by <strong className="text-gray-600">SEO Girl - Ami</strong>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
