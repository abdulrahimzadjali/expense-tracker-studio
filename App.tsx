
import React, { useState, useCallback, useEffect } from 'react';
import { type Expense, type Income, type Category } from './types';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExpensesPage from './components/ExpensesPage';
import IncomePage from './components/IncomePage';
import CategoriesPage from './components/CategoriesPage';
import AuthPage from './components/AuthPage';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return <AuthPage />;
    }

    return <AppWithSession key={session.user.id} session={session} />;
};


const AppWithSession: React.FC<{ session: Session }> = ({ session }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setDataLoading(true);
            try {
                const { data: categoriesData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true });
                if (catError) throw catError;

                const { data: expensesData, error: expError } = await supabase
                    .from('expenses')
                    .select('*')
                    .order('date', { ascending: false });
                if (expError) throw expError;

                const { data: incomesData, error: incError } = await supabase
                    .from('incomes')
                    .select('*')
                    .order('date', { ascending: false });
                if (incError) throw incError;

                setCategories(categoriesData || []);
                setExpenses((expensesData || []).map(e => ({...e, date: new Date(e.date)})));
                setIncomes((incomesData || []).map(i => ({...i, date: new Date(i.date)})));

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, [session]);

    const addExpense = useCallback(async (expense: Omit<Expense, 'id'>) => {
        try {
            const { data: newExpense, error } = await supabase
                .from('expenses')
                .insert({ ...expense, user_id: session.user.id })
                .select()
                .single();
            if (error) throw error;
            if (newExpense) {
                 setExpenses(prev => [{ ...newExpense, date: new Date(newExpense.date) }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
            }
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    }, [session.user.id]);

    const deleteExpense = useCallback(async (id: string) => {
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch(error) {
            console.error("Error deleting expense:", error);
        }
    }, []);

    const addIncome = useCallback(async (income: Omit<Income, 'id'>) => {
        try {
             const { data: newIncome, error } = await supabase
                .from('incomes')
                .insert({ ...income, user_id: session.user.id })
                .select()
                .single();
            if (error) throw error;
            if(newIncome) {
                setIncomes(prev => [{ ...newIncome, date: new Date(newIncome.date) }, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
            }
        } catch(error) {
            console.error("Error adding income", error);
        }
    }, [session.user.id]);

    const deleteIncome = useCallback(async (id: string) => {
        try {
            const { error } = await supabase.from('incomes').delete().eq('id', id);
            if(error) throw error;
            setIncomes(prev => prev.filter(i => i.id !== id));
        } catch(error) {
            console.error("Error deleting income:", error);
        }
    }, []);
    
    const addCategory = useCallback(async (category: Omit<Category, 'id'>) => {
        try {
            const {data: newCategory, error} = await supabase
                .from('categories')
                .insert({ ...category, user_id: session.user.id})
                .select()
                .single();
            if(error) throw error;
            if(newCategory) {
                setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    }, [session.user.id]);
    
    const deleteCategory = useCallback(async (id: string) => {
        // Note: This does not delete associated expenses. They will become uncategorized.
        // A more robust solution might involve setting category_id to null or deleting expenses.
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch(error) {
            console.error("Error deleting category:", error);
        }
    }, []);


    const renderPage = () => {
        if (dataLoading) {
            return <div className="text-center py-10 text-slate-400">Loading your data...</div>;
        }
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard expenses={expenses} incomes={incomes} categories={categories} />;
            case 'expenses':
                return <ExpensesPage expenses={expenses} categories={categories} onAddExpense={addExpense} onDeleteExpense={deleteExpense} />;
            case 'income':
                return <IncomePage incomes={incomes} onAddIncome={addIncome} onDeleteIncome={deleteIncome} />;
            case 'categories':
                return <CategoriesPage categories={categories} onAddCategory={addCategory} onDeleteCategory={deleteCategory} />;
            default:
                return <Dashboard expenses={expenses} incomes={incomes} categories={categories} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans pb-24">
            <div className="container mx-auto max-w-lg p-4">
                <Header session={session} />
                <main>
                    {renderPage()}
                </main>
            </div>
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
    );
};

export default App;
