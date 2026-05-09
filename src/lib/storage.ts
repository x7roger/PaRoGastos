import { AppState, Category, Expense, User } from '../types';

const STORAGE_KEY = 'paro_gastos_data';

const initialUsers: User[] = [
  { id: 'u1', name: 'Rogério', color: '#10b981' }, // emerald-500
  { id: 'u2', name: 'Patrícia', color: '#8b5cf6' }, // violet-500
];

const initialCategories: Category[] = [
  { id: 'c1', name: 'Carro', icon: '🚙', color: '#3b82f6' }, // blue-500
  { id: 'c2', name: 'Apartamento', icon: '🏠', color: '#f59e0b' }, // amber-500
  { id: 'c3', name: 'Moto', icon: '🏍️', color: '#ef4444' }, // red-500
  { id: 'c4', name: 'Trabalho', icon: '💼', color: '#6366f1' }, // indigo-500
  { id: 'c5', name: 'Pet', icon: '🐾', color: '#ec4899' }, // pink-500
  { id: 'c6', name: 'Alimentação', icon: '🍽️', color: '#14b8a6' }, // teal-500
  { id: 'c7', name: 'Mercado', icon: '🛒', color: '#84cc16' }, // lime-500
  { id: 'c8', name: 'Diversos', icon: '📦', color: '#64748b' }, // slate-500
];

const generateDummyExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const now = new Date();
  
  const sampleData = [
    { cat: 'c1', sub: 'Combustível', desc: 'Posto Ipiranga', amt: 250, uid: 'u1' },
    { cat: 'c1', sub: 'Lavagem', desc: '', amt: 50, uid: 'u2' },
    { cat: 'c2', sub: 'Condomínio', desc: 'Mês atual', amt: 850, uid: 'u1' },
    { cat: 'c2', sub: 'Luz', desc: 'Enel', amt: 120, uid: 'u2' },
    { cat: 'c6', sub: 'Jantar', desc: 'Pizzaria', amt: 180, uid: 'u1' },
    { cat: 'c6', sub: 'Almoço', desc: 'Restaurante', amt: 45, uid: 'u2' },
    { cat: 'c7', sub: 'Compras da semana', desc: 'Atacadão', amt: 450, uid: 'u1' },
    { cat: 'c7', sub: 'Padaria', desc: '', amt: 35, uid: 'u2' },
    { cat: 'c5', sub: 'Ração', desc: 'Petz', amt: 140, uid: 'u1' },
    { cat: 'c5', sub: 'Veterinário', desc: 'Vacina', amt: 200, uid: 'u2' },
    { cat: 'c8', sub: 'Netflix', desc: 'Assinatura', amt: 55, uid: 'u1' },
    { cat: 'c4', sub: 'Material', desc: 'Papelaria', amt: 80, uid: 'u2' },
    { cat: 'c6', sub: 'Lanches', desc: 'Ifood', amt: 90, uid: 'u1' },
    { cat: 'c7', sub: 'Hortifruti', desc: 'Feira', amt: 65, uid: 'u2' },
    { cat: 'c2', sub: 'Internet', desc: 'Claro', amt: 110, uid: 'u1' },
  ];

  sampleData.forEach((item, index) => {
    const cat = initialCategories.find(c => c.id === item.cat)!;
    // Spread dates across the last 15 days
    const date = new Date(now.getTime() - (index * 24 * 60 * 60 * 1000));
    
    expenses.push({
      id: `exp_${index}`,
      amount: item.amt,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      categoryIcon: cat.icon,
      subcategory: item.sub,
      description: item.desc,
      date: date.toISOString(),
      paidById: item.uid,
      createdAt: new Date().toISOString()
    });
  });

  return expenses;
};

export const loadState = (): Partial<AppState> => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      return JSON.parse(serialized);
    }
  } catch (e) {
    console.error('Error loading state from local storage', e);
  }
  
  // Return initial data if nothing in storage
  const state = {
    users: initialUsers,
    categories: initialCategories,
    expenses: generateDummyExpenses(),
  };
  saveState(state);
  return state;
};

export const saveState = (state: Partial<AppState>) => {
  try {
    // Determine what we actually want to save (don't save currentUser/tab session)
    const stateToSave = {
      users: state.users || [],
      categories: state.categories || [],
      expenses: state.expenses || []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Error saving state to local storage', e);
  }
};
