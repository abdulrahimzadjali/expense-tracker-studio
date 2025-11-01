
import React, { useState } from 'react';
import { Expense, Category } from '../types';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

interface ExpensesPageProps {
  expenses: Expense[];
  categories: Category[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

const ExpensesPage: React.FC<ExpensesPageProps> = ({ expenses, categories, onAddExpense, onDeleteExpense }) => {
    const [showForm, setShowForm] = useState(false);
  return (
    <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Expenses History</h2>
        <ExpenseList expenses={expenses} categories={categories} onDeleteExpense={onDeleteExpense} />
        {showForm && <ExpenseForm onAddExpense={onAddExpense} categories={categories} onClose={() => setShowForm(false)} />}
        <button onClick={() => setShowForm(true)} className="fixed bottom-24 right-5 bg-[#00bab3] hover:bg-[#00a39e] text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#00bab3] z-40" aria-label="Add new expense">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
  );
};

export default ExpensesPage;
