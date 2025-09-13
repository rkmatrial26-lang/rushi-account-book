
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
  category?: string;
}

export type Screen = 'home' | 'new' | 'search';
