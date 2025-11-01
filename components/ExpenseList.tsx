
import React, { useMemo } from 'react';
import { type Expense, type Category } from '../types';
import ExpenseItem from './ExpenseItem';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, categories, onDeleteExpense }) => {
  const categoriesMap = useMemo(() => 
    new Map(categories.map(cat => [cat.id, cat])), 
  [categories]);

  const groupedExpenses = useMemo(() => {
    const groups: { [key: string]: Expense[] } = {};
    expenses.forEach(expense => {
      const dateKey = expense.date.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(expense);
    });
    return Object.entries(groups);
  }, [expenses]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {expenses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-slate-400">No expenses recorded yet.</p>
          <p className="text-sm text-slate-500">Tap the '+' button to add one.</p>
        </div>
      ) : (
        groupedExpenses.map(([date, expensesOnDate]) => (
          <div key={date}>
            <h3 className="text-slate-400 font-semibold mb-2 px-2 sticky top-0 bg-slate-900 py-1 z-10">{formatDate(date)}</h3>
            <ul className="space-y-3">
              {expensesOnDate.map((expense) => (
                <ExpenseItem 
                  key={expense.id} 
                  expense={expense} 
                  category={categoriesMap.get(expense.categoryId)} 
                  onDelete={onDeleteExpense} 
                />
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
