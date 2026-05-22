import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { TrendingUp, Package, DollarSign, ShoppingCart, AlertTriangle, Lightbulb, Loader2, ArrowUpRight, ArrowDownRight, Store } from 'lucide-react';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      if (data.length > 0) generateInsights(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const generateInsights = async (productsData) => {
    setLoadingInsights(true);
    try {
      const { data } = await api.post('/ai/sales-insights', { products: productsData });
      setInsights(data);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const lowStock = products.filter(p => p.stock <= 5).length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18} />, trend: '+12.5%', up: true, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Products', value: products.length, icon: <Package size={18} />, trend: `${products.length} items`, up: true, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Sales', value: totalSales, icon: <ShoppingCart size={18} />, trend: '+8.2%', up: true, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Low Stock', value: lowStock, icon: <AlertTriangle size={18} />, trend: lowStock > 0 ? 'Needs attention' : 'All good', up: lowStock === 0, color: lowStock > 0 ? 'text-warning' : 'text-success', bg: lowStock > 0 ? 'bg-warning/10' : 'bg-success/10' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      fill: true,
      label: 'Revenue',
      data: [1200, 1900, 3000, 5000, 4200, 6000],
      borderColor: '#6366f1',
      backgroundColor: (ctx) => {
        const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.15)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        return gradient;
      },
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#6366f1',
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a2e',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        titleColor: '#e2e8f0',
        bodyColor: '#94a3b8',
        cornerRadius: 12,
        padding: 12,
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#4b5563', font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: '#4b5563', font: { size: 11 } } }
    },
    interaction: { intersect: false, mode: 'index' }
  };

  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const doughnutData = {
    labels: topProducts.map(p => p.title),
    datasets: [{
      data: topProducts.map(p => p.sales),
      backgroundColor: ['#6366f1', '#818cf8', '#a78bfa', '#c4b5fd', '#ddd6fe'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</span>
              <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-success' : 'text-warning'}`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly revenue trend</p>
            </div>
            <div className="flex gap-2">
              {['6M', '1Y', 'All'].map(p => (
                <button key={p} className="px-3 py-1 text-xs rounded-lg bg-dark/50 text-gray-500 hover:text-white hover:bg-white/5 transition-colors">{p}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <Line options={chartOptions} data={chartData} />
          </div>
        </div>

        {/* Top Products Doughnut */}
        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-base font-semibold text-white mb-1">Top Products</h3>
          <p className="text-xs text-gray-500 mb-4">By sales volume</p>
          {topProducts.length > 0 ? (
            <>
              <div className="h-48 flex items-center justify-center">
                <Doughnut data={doughnutData} options={{ cutout: '70%', plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
              </div>
              <div className="mt-4 space-y-2">
                {topProducts.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#6366f1', '#818cf8', '#a78bfa'][i] }}></div>
                      <span className="text-gray-300 truncate max-w-[140px]">{p.title}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{p.sales} sold</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-600">
              <Package size={32} className="mb-2 opacity-40" />
              <p className="text-sm">No products yet</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Lightbulb size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI Store Assistant</h3>
            <p className="text-xs text-gray-500">Intelligent insights based on your product data</p>
          </div>
        </div>
        
        {loadingInsights ? (
          <div className="flex items-center justify-center py-12 text-gray-500 gap-3">
            <Loader2 className="animate-spin text-primary" size={20} />
            <p className="text-sm">Analyzing your store data...</p>
          </div>
        ) : insights ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark/40 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp size={13} className="text-success" /> Trending
              </h4>
              <ul className="space-y-2">
                {insights.trendingProducts?.map((p, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-dark/40 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle size={13} className="text-warning" /> Stock Alerts
              </h4>
              {insights.lowStockAlerts?.length > 0 ? (
                <ul className="space-y-2">
                  {insights.lowStockAlerts.map((p, i) => (
                    <li key={i} className="text-sm text-warning bg-warning/5 px-3 py-2 rounded-lg border border-warning/10">{p}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">All inventory levels are healthy.</p>
              )}
            </div>
            <div className="bg-dark/40 rounded-xl p-4 border border-white/5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb size={13} className="text-accent" /> Suggestions
              </h4>
              <ul className="space-y-2">
                {insights.suggestions?.map((s, i) => (
                  <li key={i} className="text-sm text-gray-400 leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600 text-center">
            <Store size={36} className="mb-3 opacity-30" />
            <p className="text-sm">Add products to get AI-powered insights and suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
}
