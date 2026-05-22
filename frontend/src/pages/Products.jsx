import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Wand2, Loader2, Tag, Search, Filter, Package, X } from 'lucide-react';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '', price: '', stock: '', sales: '', description: '', tags: '', marketingCaption: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        title: product.title, price: product.price, stock: product.stock, sales: product.sales || 0,
        description: product.description || '', tags: product.tags ? product.tags.join(', ') : '',
        marketingCaption: product.marketingCaption || ''
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', price: '', stock: '', sales: '0', description: '', tags: '', marketingCaption: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error saving product', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try { await api.delete(`/products/${id}`); fetchProducts(); }
      catch (error) { console.error('Error deleting product', error); }
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.price) { alert('Please enter a Title and Price first.'); return; }
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/generate-content', { title: formData.title, price: formData.price });
      setFormData(prev => ({
        ...prev,
        description: data.description || prev.description,
        tags: data.tags ? data.tags.join(', ') : prev.tags,
        marketingCaption: data.marketingCaption || prev.marketingCaption
      }));
    } catch (error) {
      console.error('Error generating AI content', error);
      alert('Failed to generate AI content. The AI service may be temporarily unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const filtered = products
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => filterStock === 'all' ? true : filterStock === 'low' ? p.stock <= 5 : p.stock > 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Products</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} products in your store</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-secondary text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" placeholder="Search products..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-white/5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {[['all', 'All'], ['low', 'Low Stock'], ['ok', 'In Stock']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterStock(val)}
              className={`px-3 py-2 text-xs font-medium rounded-xl transition-all border ${filterStock === val ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-card border-white/5 text-gray-500 hover:text-gray-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">AI</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="px-5 py-16 text-center">
                <Package size={32} className="mx-auto mb-3 text-gray-700" />
                <p className="text-gray-500 text-sm">{searchQuery ? 'No products match your search.' : 'No products yet. Add your first one!'}</p>
              </td></tr>
            ) : (
              filtered.map(product => (
                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-200">{product.title}</div>
                    <div className="text-xs text-gray-600 truncate max-w-xs mt-0.5">{product.description || 'No description'}</div>
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-300">${product.price}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${product.stock > 10 ? 'bg-success/10 text-success' : product.stock > 0 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{product.sales || 0}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {product.description && product.tags?.length > 0 ? (
                      <span className="flex items-center gap-1 text-primary text-xs font-medium"><Wand2 size={12} /> Optimized</span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(product)} className="p-2 text-gray-500 hover:text-white bg-dark/60 rounded-lg border border-white/5 transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-500 hover:text-danger bg-dark/60 rounded-lg border border-white/5 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-2xl rounded-2xl border border-white/5 shadow-2xl shadow-black/50 flex flex-col max-h-[90vh] animate-slide-up">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={closeModal} className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"><X size={18} /></button>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Title</label>
                    <input type="text" required className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Price ($)</label>
                    <input type="number" required min="0" step="0.01" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Stock</label>
                    <input type="number" required min="0" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Sales Count</label>
                    <input type="number" min="0" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.sales} onChange={e => setFormData({...formData, sales: e.target.value})} />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Wand2 className="text-primary" size={16} /> AI Content Generation
                    </h4>
                    <button type="button" onClick={handleAIGenerate} disabled={aiLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors text-xs font-medium disabled:opacity-50">
                      {aiLoading ? <Loader2 className="animate-spin" size={13} /> : <Wand2 size={13} />}
                      Auto-Generate
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
                      <textarea rows="3" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="AI will generate this..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1"><Tag size={12} /> Tags</label>
                      <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="Comma separated..." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Marketing Caption</label>
                      <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-dark/60 border border-white/5 text-white text-sm focus:outline-none focus:border-primary/40 transition-all" value={formData.marketingCaption} onChange={e => setFormData({...formData, marketingCaption: e.target.value})} placeholder="Catchy social caption..." />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-dark/30 rounded-b-2xl">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium">Cancel</button>
              <button form="productForm" type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-primary hover:bg-secondary text-white text-sm transition-all font-medium flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={15} /> : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
