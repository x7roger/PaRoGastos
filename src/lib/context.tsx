import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Category, Expense, Subcategory, User } from '../types';
import { loadState, saveState } from './storage';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

type AppContextType = AppState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTab: (tab: AppState['currentTab']) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  saveSubcategory: (nome: string, categoria: string) => Promise<void>;
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

    const initialUsers = loaded.users && loaded.users.length > 0 ? loaded.users : defaultUsers;
    
    const usersWithEmails = initialUsers.map(u => {
      if (u.name === 'Rogério' && !u.email) return { ...u, email: 'roger@roger.com' };
      if (u.name === 'Patrícia' && !u.email) return { ...u, email: 'paty@paty.com' };
      return u;
    });

    return {
      users: usersWithEmails,
      categories: loaded.categories || [],
      expenses: [],
      subcategories: [],
      currentUser: null,
      currentTab: 'dashboard',
      isOnline: true,
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
    // Intentionally only on mount — users are static
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time listener for all expenses from Firestore
  useEffect(() => {
    const q = query(collection(db, "gastos"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Expense[];
      expenses.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setState(s => ({ ...s, expenses }));
    }, (error) => {
      console.error("Error fetching expenses from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for subcategories from Firestore
  useEffect(() => {
    const q = query(collection(db, "subcategorias"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subcategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subcategory[];
      setState(s => ({ ...s, subcategories }));
    }, (error) => {
      console.error("Error fetching subcategories from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for categories from Firestore
  useEffect(() => {
    const q = query(collection(db, "categorias"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      if (categories.length > 0) {
        setState(s => ({ ...s, categories }));
      }
    }, (error) => {
      console.error("Error fetching categories from Firestore:", error);
    });

    return () => unsubscribe();
  }, []);

  // Connection status listener
  useEffect(() => {
    const handleOnline = () => setState(s => ({ ...s, isOnline: true }));
    const handleOffline = () => setState(s => ({ ...s, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save only users to localStorage (categories and expenses are in Firestore)
  useEffect(() => {
    saveState({
      users: state.users,
    });
  }, [state.users]);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setState(s => ({ ...s, currentTab: 'dashboard' }));
  };

  const setTab = (tab: AppState['currentTab']) => setState(s => ({ ...s, currentTab: tab }));

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, "gastos"), {
        ...expense,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("ERRO DETALHADO:", error.code, error.message, error);
      alert("Erro ao salvar gasto. Tente novamente.");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "gastos", id));
    } catch (error) {
      console.error("Error deleting expense from Firestore:", error);
      alert("Erro ao excluir gasto. Tente novamente.");
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, "categorias"), category);
    } catch (error) {
      console.error("Error adding category to Firestore:", error);
      alert("Erro ao salvar categoria.");
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categorias", id));
    } catch (error) {
      console.error("Error deleting category from Firestore:", error);
      alert("Erro ao excluir categoria.");
    }
  };

  const saveSubcategory = async (nome: string, categoria: string) => {
    try {
      const q = query(collection(db, "subcategorias"), where("nome", "==", nome), where("categoria", "==", categoria));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await addDoc(collection(db, "subcategorias"), {
          nome,
          categoria,
          criadoEm: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error saving subcategory to Firestore:", error);
    }
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
      saveSubcategory,
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
