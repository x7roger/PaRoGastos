import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../lib/context';
import { formatCurrency } from '../lib/utils';
import { User } from '../types';

// Helper to generate consistent vibrant color from string hash
const getStringColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use HSL for vibrant, distinct colors
  // Saturation 65-80, Lightness 45-60 for good visibility
  const h = Math.abs(hash) % 360;
  const s = 70 + (Math.abs(hash >> 8) % 15);
  const l = 50 + (Math.abs(hash >> 16) % 10);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const Dashboard = () => {
  const { expenses, currentUser, users, isOnline } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewBy, setViewBy] = useState<'category' | 'subcategory'>('category');
  const [filterType, setFilterType] = useState<'all' | 'me' | 'others'>('all');

  // Filter expenses by current month
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => {
      const date = new Date(e.date + 'T00:00:00');
      return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
    });
  }, [expenses, currentMonth]);

  // Optional user filter applied on top of monthly filter
  const displayExpenses = useMemo(() => {
    if (filterType === 'all' || !currentUser) return monthlyExpenses;
    if (filterType === 'me') return monthlyExpenses.filter(e => e.paidById === currentUser.id);
    if (filterType === 'others') return monthlyExpenses.filter(e => e.paidById !== currentUser.id);
    return monthlyExpenses;
  }, [monthlyExpenses, filterType, currentUser]);

  // KPIs
  const totalSpent = useMemo(() => displayExpenses.reduce((acc, e) => acc + e.amount, 0), [displayExpenses]);
  const mySpent = useMemo(() => monthlyExpenses.filter(e => e.paidById === currentUser?.id).reduce((acc, e) => acc + e.amount, 0), [monthlyExpenses, currentUser]);
  const othersSpent = monthlyExpenses.reduce((acc, e) => acc + e.amount, 0) - mySpent;

  // Chart Data: Category or Subcategory
  const chartData = useMemo(() => {
    const map = new Map<string, { name: string; value: number; color: string }>();
    
    displayExpenses.forEach(e => {
      const key = viewBy === 'category' ? e.categoryId : e.subcategory;
      const name = viewBy === 'category' ? e.categoryName : e.subcategory;
      const color = viewBy === 'category' ? e.categoryColor : getStringColor(e.subcategory);

      if (!map.has(key)) {
        map.set(key, { name, value: 0, color });
      }
      map.get(key)!.value += e.amount;
    });

    return Array.from(map.values()).sort((a, b) => b.value - a.value);
  }, [displayExpenses, viewBy]);

  // Pie Chart Specific Data: Group items beyond 8 into "Outros"
  const pieChartData = useMemo(() => {
    if (chartData.length <= 8) return chartData;
    
    const top7 = chartData.slice(0, 7);
    const othersValue = chartData.slice(7).reduce((acc, curr) => acc + curr.value, 0);
    
    return [
      ...top7,
      { name: 'Outros', value: othersValue, color: '#94a3b8' }
    ];
  }, [chartData]);

  const topCategoryName = chartData.length > 0 ? chartData[0].name : '-';

  // Month Navigation Logic
  const canGoNext = useMemo(() => {
    const today = new Date();
    const isBeforeCurrentMonth = 
      currentMonth.getFullYear() < today.getFullYear() || 
      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth());
    
    if (isBeforeCurrentMonth) return true;

    const nextMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    return expenses.some(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d >= nextMonthStart;
    });
  }, [currentMonth, expenses]);

  // Format month
  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentMonth);
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
          <p className="font-medium text-slate-800">{payload[0].payload.name}</p>
          <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col bg-slate-50 min-h-full pb-24">
      {/* Header - Compact 56px */}
      <header className="bg-white px-4 h-14 flex items-center justify-between shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner relative"
            style={{ backgroundColor: currentUser?.color }}
          >
            {currentUser?.name.charAt(0).toUpperCase()}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500 animate-pulse-slow' : 'bg-rose-500'}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 truncate max-w-[100px] leading-tight">{currentUser?.name}</span>
            {!isOnline && <span className="text-[9px] font-medium text-rose-500 leading-none">Sem conexão</span>}
          </div>
        </div>
        
        <div className="text-sm font-bold text-slate-500 uppercase tracking-tight">
          {formattedMonth}
        </div>
      </header>

      {/* Filters & Month Selector - Single line */}
      <div className="bg-white px-4 py-2 flex items-center justify-between gap-4 border-b border-slate-100 sticky top-14 z-20">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            disabled={!canGoNext}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors ${!canGoNext ? 'text-slate-300' : 'text-slate-500 hover:text-indigo-600'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg flex-1 max-w-[180px]">
          <button 
            onClick={() => setViewBy('category')}
            className={`flex-1 min-h-[44px] text-[11px] font-bold rounded-md transition-all ${viewBy === 'category' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Categorias
          </button>
          <button 
            onClick={() => setViewBy('subcategory')}
            className={`flex-1 min-h-[44px] text-[11px] font-bold rounded-md transition-all ${viewBy === 'subcategory' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
          >
            Subs
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-6 p-4">
        {/* KPI Cards - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`bg-indigo-600 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-center min-h-[80px] transition-opacity ${filterType !== 'all' ? 'opacity-60' : 'opacity-100'}`}>
            <h3 className="text-indigo-100 text-xs font-medium uppercase tracking-wider mb-1">Total</h3>
            <p className="text-xl font-bold truncate">{formatCurrency(totalSpent)}</p>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterType(filterType === 'me' ? 'all' : 'me')}
            className={`p-4 rounded-2xl shadow-sm border-2 flex flex-col justify-center text-left transition-all min-h-[80px] ${filterType === 'me' ? 'bg-indigo-600 border-indigo-600 text-white z-10' : 'bg-white border-slate-100 text-slate-800'} ${filterType !== 'all' && filterType !== 'me' ? 'opacity-60' : 'opacity-100'}`}
          >
            <h3 className={`text-xs font-medium uppercase tracking-wider mb-1 ${filterType === 'me' ? 'text-indigo-100' : 'text-slate-400'}`}>Meu Gasto</h3>
            <p className={`text-xl font-bold truncate ${filterType === 'me' ? 'text-white' : 'text-slate-800'}`}>{formatCurrency(mySpent)}</p>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilterType(filterType === 'others' ? 'all' : 'others')}
            className={`p-4 rounded-2xl shadow-sm border-2 flex flex-col justify-center text-left transition-all min-h-[80px] ${filterType === 'others' ? 'bg-indigo-600 border-indigo-600 text-white z-10' : 'bg-white border-slate-100 text-slate-800'} ${filterType !== 'all' && filterType !== 'others' ? 'opacity-60' : 'opacity-100'}`}
          >
            <h3 className={`text-xs font-medium uppercase tracking-wider mb-1 ${filterType === 'others' ? 'text-indigo-100' : 'text-slate-400'}`}>Outros</h3>
            <p className={`text-xl font-bold truncate ${filterType === 'others' ? 'text-white' : 'text-slate-800'}`}>{formatCurrency(othersSpent)}</p>
          </motion.button>

          <div className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center min-h-[80px] transition-opacity ${filterType !== 'all' ? 'opacity-60' : 'opacity-100'}`}>
            <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Líder</h3>
            <p className="text-xl font-bold text-slate-800 truncate">{topCategoryName}</p>
          </div>
        </div>

        {/* Charts Section */}
        {chartData.length > 0 ? (
          <>
            {/* Bar Chart - Priority, max 250px */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-6 font-sans">
            Gastos por {viewBy === 'category' ? 'Categoria' : 'Subcategoria'}
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 80, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    content={(props: any) => {
                      const { x, y, width, value } = props;
                      return (
                        <text 
                          x={x + width + 6} 
                          y={y + 12} 
                          fill="#475569" 
                          fontSize={10} 
                          fontWeight="bold"
                          textAnchor="start"
                        >
                          {formatCurrency(value)}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart - Compact */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-sm font-bold text-slate-800 mb-4 font-sans">
            Composição ({viewBy === 'category' ? 'Categoria' : 'Subcategoria'})
          </h3>
          <div className="h-48 flex flex-col items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center flex-col">
              <span className="text-slate-400 text-[10px]">Total</span>
              <span className="text-base font-bold text-slate-800">{formatCurrency(totalSpent)}</span>
            </div>
          </div>
            
          {/* Custom Legend - Below chart */}
           <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {pieChartData.map((entry, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                 <span className="text-sm text-slate-600 truncate">{entry.name}</span>
                 <span className="text-sm font-bold text-slate-800 ml-auto">{Math.round((entry.value / totalSpent) * 100)}%</span>
               </div>
            ))}
          </div>
        </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📭</span>
          </div>
          <p className="font-medium text-slate-500 mb-1">Nada por aqui ainda</p>
          <p className="text-sm">Nenhum gasto registrado em {formattedMonth}</p>
        </motion.div>
        )}
      </div>
    </div>
  );
};
