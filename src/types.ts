export type User = {
  id: string;
  name: string;
  color: string;
  email?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  subcategory: string;
  description: string;
  date: string;
  paidById: string;
  createdAt: string;
};

export type AppState = {
  users: User[];
  categories: Category[];
  expenses: Expense[];
  currentUser: User | null;
  currentTab: "dashboard" | "history" | "settings";
};
