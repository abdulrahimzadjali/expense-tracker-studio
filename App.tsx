
import React, { useState, useCallback } from 'react';
import { type Expense, type Income, type Category } from './types';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpensesPage from './components/ExpensesPage';
import IncomePage from './components/IncomePage';
import CategoriesPage from './components/CategoriesPage';

const DEFAULT_CATEGORIES: Category[] = [
    { id: 'food', name: 'Food', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6', color: 'cyan' },
    { id: 'transport', name: 'Transport', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', color: 'blue' },
    { id: 'bills', name: 'Bills', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'red' },
    { id: 'entertainment', name: 'Entertainment', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'purple' },
    { id: 'health', name: 'Health', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', color: 'green' },
    { id: 'shopping', name: 'Shopping', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'orange' },
    { id: 'other', name: 'Other', icon: 'M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z', color: 'slate' },
];

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            // JSON reviver to correctly parse date strings back into Date objects
            return item ? JSON.parse(item, (k, v) => (k === 'date' && typeof v === 'string') ? new Date(v) : v) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    };
    return [storedValue, setValue];
}

const App: React.FC = () => {
    const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
    const [incomes, setIncomes] = useLocalStorage<Income[]>('incomes', []);
    const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
    const [currentPage, setCurrentPage] = useState('dashboard');

    const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
        setExpenses(prev => [{ ...expense, id: Date.now() }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
    }, [setExpenses]);

    const deleteExpense = useCallback((id: number) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, [setExpenses]);

    const addIncome = useCallback((income: Omit<Income, 'id'>) => {
        setIncomes(prev => [{ ...income, id: Date.now() }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
    }, [setIncomes]);

    const deleteIncome = useCallback((id: number) => {
        setIncomes(prev => prev.filter(i => i.id !== id));
    }, [setIncomes]);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard expenses={expenses} incomes={incomes} categories={categories} />;
            case 'expenses':
                return <ExpensesPage expenses={expenses} categories={categories} onAddExpense={addExpense} onDeleteExpense={deleteExpense} />;
            case 'income':
                return <IncomePage incomes={incomes} onAddIncome={addIncome} onDeleteIncome={deleteIncome} />;
            case 'categories':
                return <CategoriesPage categories={categories} setCategories={setCategories} />;
            default:
                return <Dashboard expenses={expenses} incomes={incomes} categories={categories} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans pb-24">
            <div className="container mx-auto max-w-lg p-4">
                <Header />
                <main>
                    {renderPage()}
                </main>
            </div>
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
    );
};

export default App;