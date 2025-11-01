
export interface Category {
  id: string;
  name: string;
  icon: string; // SVG path data
  color: string; // A key for a color map, e.g., 'teal'
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  categoryId: string;
  date: Date;
}

export interface Income {
  id: number;
  description: string;
  amount: number;
  date: Date;
}
