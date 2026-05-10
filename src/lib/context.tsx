import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Category, Expense, User } from '../types';
import { loadState, saveState } from './storage';
import { auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

type AppContextType = AppState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTab: (tab: AppState['currentTab']) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (isOpen: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadState();
    const defaultUsers: User[] = [
      { id: 'usr_rogerio', name: 'Rogério', color: '#4F46E5', email: 'roger@roger.com' } as User & { email: string },
      { id: 'usr_patricia', name: 'Patrícia', color: '#EC4899', email: 'paty@paty.com' } as User & { email: string }
    ];

    return {
      users: loaded.users && loaded.users.length > 0 ? loaded.users : defaultUsers,
      categories: loaded.categories || [],
      expenses: loaded.expenses || [],
      currentUser: null,
      currentTab: 'dashboard',
    };
  });
  
  const [loading, setLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = state.users.find(u => (u as any).email === firebaseUser.email);
        if (user) {
          setState(s => ({ ...s, currentUser: user }));
        }
      } else {
        setState(s => ({ ...s, currentUser: null }));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [state.users]);

  useEffect(() => {
    saveState({
      users: state.users,
      categories: state.categories,
      expenses: state.expenses
    });
  }, [state.users, state.categories, state.expenses]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setState(s => ({ ...s, currentTab: 'dashboard' }));
  };

  const setTab = (tab: AppState['currentTab']) => setState(s => ({ ...s, currentTab: tab }));

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setState(s => ({ ...s, expenses: [newExpense, ...s.expenses] }));
  };

  const deleteExpense = (id: string) => {
    setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat_${Date.now()}`
    };
    setState(s => ({ ...s, categories: [...s.categories, newCategory] }));
  };

  const deleteCategory = (id: string) => {
    setState(s => ({ ...s, categories: s.categories.filter(c => c.id !== id) }));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`
    };
    setState(s => ({ ...s, users: [...s.users, newUser] }));
  };

  const deleteUser = (id: string) => {
    setState(s => ({ ...s, users: s.users.filter(u => u.id !== id) }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login, logout, setTab,
      addExpense, deleteExpense,
      addCategory, deleteCategory,
      addUser, deleteUser,
      isAddExpenseOpen, setIsAddExpenseOpen
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
