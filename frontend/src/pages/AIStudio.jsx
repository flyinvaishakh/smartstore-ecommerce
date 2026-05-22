import { useState, useEffect } from 'react';
import { Sparkles, Wand2, FileText, Hash, Megaphone, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import api from '../api';

export default function AIStudio() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const [mode, setMode] = useState('product'); // product or custom

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    let title, price;
    if (mode === 'product') {
      const p = products.find(pr => pr._id === selectedProduct);
      if (!p) { alert('Select a product first.'); return; }
      title = p.title;
      price = p.price;
    } else {
      if (!customTitle || !customPrice) { alert('Enter a title and price.'); return; }
      title = customTitle;
      price = customPrice;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/generate-content', { title, price });
      setResult({ ...data, title, price });
    } catch (error) {
      alert('AI generation failed. The service may be temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const applyToProduct = async () => {
    if (!result || mode !== 'product' || !selectedProduct) return;
    try {
      await api.put(`/products/${selectedProduct}`, {
        description: result.description,
        tags: result.tags,
        marketingCaption: result.marketingCaption
      });
      alert('Applied to product successfully!');
    } catch (err) {
      alert('Failed to apply. Try again.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-gradient-to-tr from-primary to-accent rounded-xl shadow-lg shadow-primary/20">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Studio</h2>
          <p className="text-sm text-gray-500 mt-0.5">Generate product descriptions, SEO tags, and marketing captions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-card rounded-2xl border border-white/5 p-6 space-y-5">
          <h3 className="text-base font-semibold text-white">Input</h3>

          {/* Mode Selector */}
          <div className="flex gap-2">
            <button onClick={() => setMode('product')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all border ${mode === 'product' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-dark/40 border-white/5 text-gray-500 hover:text-gray-300'}`}>
              From Existing Product
            </button>
            <button onClick={() => setMode('custom')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all border ${mode === 'custom' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-dark/40 border-white/5 text-gray-500 hover:text-gray-300'}`}>
              Custom Input
            </button>
          </div>

          {mode === 'product' ? (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Select Product</label>
              <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer">
                <option value="" className="bg-dark">Choose a product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id} className="bg-dark">{p.title} — ${p.price}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Product Title</label>
                <input type="text" value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Price ($)</label>
                <input type="number" min="0" step="0.01" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="49.99"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all placeholder-gray-600" />
              </div>
            </div>
          )}

          <button onClick={handleGenerate} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-card rounded-2xl border border-white/5 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Generated Content</h3>
            {result && (
              <div className="flex gap-2">
                <button onClick={handleGenerate} className="p-2 text-gray-500 hover:text-primary bg-dark/40 rounded-lg border border-white/5 transition-colors" title="Regenerate">
                  <RefreshCw size={14} />
                </button>
                {mode === 'product' && selectedProduct && (
                  <button onClick={applyToProduct} className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
                    Apply to Product
                  </button>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="relative">
                <Loader2 className="animate-spin text-primary" size={32} />
                <Sparkles size={14} className="absolute -top-1 -right-1 text-accent animate-pulse" />
              </div>
              <p className="text-sm text-gray-500">AI is crafting your content...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Description */}
              <div className="bg-dark/40 rounded-xl p-4 border border-white/5 group">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"><FileText size={12} /> Description</span>
                  <button onClick={() => copyText(result.description, 'desc')} className="text-gray-600 hover:text-primary transition-colors">
                    {copied === 'desc' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{result.description}</p>
              </div>

              {/* Tags */}
              <div className="bg-dark/40 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"><Hash size={12} /> SEO Tags</span>
                  <button onClick={() => copyText(result.tags?.join(', '), 'tags')} className="text-gray-600 hover:text-primary transition-colors">
                    {copied === 'tags' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.tags?.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-primary/10 text-primary border border-primary/10 font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Marketing Caption */}
              <div className="bg-dark/40 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider"><Megaphone size={12} /> Marketing Caption</span>
                  <button onClick={() => copyText(result.marketingCaption, 'caption')} className="text-gray-600 hover:text-primary transition-colors">
                    {copied === 'caption' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-sm text-gray-300 italic">"{result.marketingCaption}"</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Sparkles size={36} className="text-gray-700 mb-3" />
              <p className="text-sm text-gray-500">Select a product or enter details, then click Generate.</p>
              <p className="text-xs text-gray-600 mt-1">AI will create SEO-optimized content instantly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
