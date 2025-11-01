
import React from 'react';
import { type Expense, type Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface ExpenseItemProps {
  expense: Expense;
  category?: Category;
  onDelete: (id: string) => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, category, onDelete }) => {
  if (!category) {
    // Fallback for an expense with a deleted category
    return (
        <li className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <p className="text-slate-400 italic">Expense with missing category</p>
            <p className="font-bold text-lg text-red-400">
                -{expense.amount.toFixed(3)} OMR
            </p>
      </li>
    );
  }
  
  return (
    <li className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 group">
      <div className="flex items-center space-x-4 overflow-hidden">
        <CategoryIcon category={category} />
        <div className="overflow-hidden">
          <p className="font-semibold text-slate-100 truncate">{expense.description}</p>
          <p className="text-sm text-slate-400">
            {category.name}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 shrink-0">
        <p className="font-bold text-lg text-red-400">
          -{expense.amount.toFixed(3)} OMR
        </p>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          aria-label={`Delete expense ${expense.description}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export default ExpenseItem;
