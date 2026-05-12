import { AppState, Category, User } from '../types';

const STORAGE_KEY = 'paro_gastos_data';

const initialUsers: User[] = [
  { id: 'usr_rogerio', name: 'Rogério', color: '#4F46E5', email: 'roger@roger.com' },
  { id: 'usr_patricia', name: 'Patrícia', color: '#EC4899', email: 'paty@paty.com' },
];

const initialCategories: Category[] = [
  { id: 'c1', name: 'Carro', icon: '🚙', color: '#3b82f6' },
  { id: 'c2', name: 'Apartamento', icon: '🏠', color: '#f59e0b' },
  { id: 'c3', name: 'Moto', icon: '🏍️', color: '#ef4444' },
  { id: 'c4', name: 'Trabalho', icon: '💼', color: '#6366f1' },
  { id: 'c5', name: 'Pet', icon: '🐾', color: '#ec4899' },
  { id: 'c6', name: 'Alimentação', icon: '🍽️', color: '#14b8a6' },
  { id: 'c7', name: 'Mercado', icon: '🛒', color: '#84cc16' },
  { id: 'c8', name: 'Diversos', icon: '📦', color: '#64748b' },
];

export const loadState = (): Partial<AppState> => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (Array.isArray(parsed.users)) {
        parsed.users = parsed.users.map(u => ({
          ...u,
          name: u.name === 'João' ? 'Rogério' : u.name === 'Maria' ? 'Patrícia' : u.name
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return {
        users: parsed.users || initialUsers,
        categories: parsed.categories || initialCategories,
      };
    }
  } catch (e) {
    console.error('Error loading state from local storage', e);
  }

  return {
    users: initialUsers,
    categories: initialCategories,
  };
};

export const saveState = (state: Partial<AppState>) => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    const parsed = serialized ? JSON.parse(serialized) : {};
    
    // Only update the keys that are passed in the state object
    const stateToSave = {
      ...parsed,
      ...(state.users ? { users: state.users } : {}),
      ...(state.categories ? { categories: state.categories } : {}),
      ...(state.expenses ? { expenses: state.expenses } : {})
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Error saving state to local storage', e);
  }
};
