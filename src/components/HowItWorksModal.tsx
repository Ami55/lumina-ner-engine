import React from 'react';
import { X, Search, Tags, BarChart3, Smile, CheckCircle2 } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export const HowItWorksModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm p-4 flex items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div><h2 className="text-lg font-bold text-gray-900">How Lumina NER Works</h2><p className="text-xs text-gray-500">Named entities, salience, and sentiment—explained</p></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X size={20} /></button>
        </header>
        <div className="p-6 space-y-6 text-sm text-gray-700">
          <section className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <h3 className="font-bold text-blue-900 mb-3">Practical instructions</h3>
            <ol className="space-y-2 text-xs leading-relaxed list-decimal pl-4">
              <li>Paste a focused passage into <strong>Input Text</strong>. Shorter, coherent passages usually produce clearer entity salience.</li>
              <li>Select <strong>Analyze Text</strong> and keep the page open while the server-side model processes it.</li>
              <li>Read the annotated passage; hover over a highlighted entity to see its category and salience.</li>
              <li>Use Entity Breakdown to review category, relative importance, and entity-level sentiment.</li>
              <li>Review overall sentiment and magnitude to understand tone and emotional intensity.</li>
              <li>Validate names, dates, prices, and ambiguous classifications before exporting findings.</li>
            </ol>
          </section>
          <section>
            <h3 className="font-bold text-gray-900 mb-3">Five-stage analysis framework</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                [Search, '1. Span discovery', 'Finds candidate names, places, organizations, products, events, numbers, and prices.'],
                [Tags, '2. Entity classification', 'Assigns the most specific supported category to each detected text span.'],
                [BarChart3, '3. Salience estimation', 'Estimates each entity’s relative importance to the passage on a 0–1 scale.'],
                [Smile, '4. Sentiment mapping', 'Estimates entity-level and overall tone from negative to positive, plus magnitude.'],
                [CheckCircle2, '5. Structured output', 'Returns tagged source text and a sortable entity table for review.'],
              ].map(([Icon, title, description]: any) => (
                <div key={title} className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <Icon size={18} className="text-blue-600 mb-2" /><strong className="block text-gray-900">{title}</strong><p className="mt-1 text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <strong>Interpretation note:</strong> Salience and sentiment are model-based estimates, not Google Cloud Natural Language measurements. NER can be ambiguous, so use the output as a review aid rather than an authoritative database.
          </section>
        </div>
      </div>
    </div>
  );
};
