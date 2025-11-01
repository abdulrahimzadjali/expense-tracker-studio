
export interface Category {
  id: string;
  name: string;
  icon: string; // SVG path data
  color: string; // A key for a color map, e.g., 'teal'
  user_id?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  date: Date;
  user_id?: string;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: Date;
  user_id?: string;
}
