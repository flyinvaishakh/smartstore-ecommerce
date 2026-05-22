import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, ArrowUpRight } from 'lucide-react';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [timeRange, setTimeRange] = useState('6M');

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const totalRevenue = products.reduce((s, p) => s + (p.price * p.sales), 0);
  const totalSales = products.reduce((s, p) => s + p.sales, 0);
  const avgPrice = products.length ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2) : 0;
  const topProduct = [...products].sort((a, b) => b.sales - a.sales)[0];

  const barData = {
    labels: products.slice(0, 8).map(p => p.title.length > 12 ? p.title.slice(0, 12) + '…' : p.title),
    datasets: [{
      label: 'Revenue ($)',
      data: products.slice(0, 8).map(p => p.price * p.sales),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1a2e', borderColor: 'rgba(99,102,241,0.2)', borderWidth: 1, titleColor: '#e2e8f0', bodyColor: '#94a3b8', cornerRadius: 12, padding: 12 } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#4b5563', font: { size: 11 }, callback: v => '$' + v } },
      x: { grid: { display: false }, ticks: { color: '#4b5563', font: { size: 10 } } }
    }
  };

  const conversionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views', data: [320, 450, 380, 520, 410, 600, 480],
        borderColor: '#818cf8', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0,
      },
      {
        label: 'Conversions', data: [28, 42, 35, 58, 45, 72, 51],
        borderColor: '#22c55e', backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0, borderDash: [5, 5],
      }
    ]
  };

  const conversionOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top', labels: { color: '#6b7280', font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 } }, tooltip: { backgroundColor: '#1a1a2e', borderColor: 'rgba(99,102,241,0.2)', borderWidth: 1, titleColor: '#e2e8f0', bodyColor: '#94a3b8', cornerRadius: 12 } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false }, ticks: { color: '#4b5563', font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: '#4b5563', font: { size: 11 } } }
    }
  };

  const kpis = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', up: true, icon: <DollarSign size={16} /> },
    { label: 'Total Orders', value: totalSales, change: '+8.2%', up: true, icon: <ShoppingCart size={16} /> },
    { label: 'Avg. Price', value: `$${avgPrice}`, change: '-2.1%', up: false, icon: <TrendingDown size={16} /> },
    { label: 'Conversion Rate', value: '11.3%', change: '+3.4%', up: true, icon: <Eye size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track your store performance and growth metrics</p>
        </div>
        <div className="flex gap-2">
          {['1M', '3M', '6M', '1Y'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all border ${timeRange === r ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-card border-white/5 text-gray-500 hover:text-gray-300'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl bg-primary/10 text-primary">{kpi.icon}</span>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-success' : 'text-danger'}`}>
                {kpi.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />} {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Product */}
        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-base font-semibold text-white mb-1">Revenue by Product</h3>
          <p className="text-xs text-gray-500 mb-4">Top 8 products by revenue generated</p>
          <div className="h-72">
            {products.length > 0 ? <Bar data={barData} options={barOptions} /> : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">Add products to see revenue data</div>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-card rounded-2xl p-6 border border-white/5">
          <h3 className="text-base font-semibold text-white mb-1">Views vs Conversions</h3>
          <p className="text-xs text-gray-500 mb-4">Weekly traffic and conversion tracking</p>
          <div className="h-72">
            <Line data={conversionData} options={conversionOptions} />
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-base font-semibold text-white">Product Performance</h3>
          <p className="text-xs text-gray-500 mt-0.5">Ranked by total revenue</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sales</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[...products].sort((a, b) => (b.price * b.sales) - (a.price * a.sales)).slice(0, 8).map((p, i) => (
              <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-gray-200">{p.title}</td>
                <td className="px-5 py-3 text-gray-400">${p.price}</td>
                <td className="px-5 py-3 text-gray-400">{p.sales}</td>
                <td className="px-5 py-3 text-success font-medium">${(p.price * p.sales).toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${p.stock > 10 ? 'bg-success/10 text-success' : p.stock > 0 ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>
                    {p.stock}
                  </span>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" className="px-5 py-12 text-center text-gray-600 text-sm">No product data available yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
