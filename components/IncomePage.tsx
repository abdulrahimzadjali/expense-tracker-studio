
import React, { useState, FormEvent, useMemo } from 'react';
import { type Income } from '../types';

interface IncomePageProps {
  incomes: Income[];
  onAddIncome: (income: Omit<Income, 'id'>) => Promise<void>;
  onDeleteIncome: (id: string) => Promise<void>;
}

const IncomeForm: React.FC<{onAddIncome: (income: Omit<Income, 'id'>) => void; onClose: () => void;}> = ({ onAddIncome, onClose }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !date) {
            setError('Please fill out all fields');
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid, positive amount');
            return;
        }
        onAddIncome({ description, amount: parsedAmount, date: new Date(date + 'T00:00:00') });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 p-4 flex justify-center items-start overflow-y-auto">
            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full max-w-lg mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-300">Add New Income</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl" aria-label="Close form">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
                    <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md" required />
                    <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md" step="0.001" required />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md" required />
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Add Income</button>
                </form>
            </section>
        </div>
    );
};


const IncomePage: React.FC<IncomePageProps> = ({ incomes, onAddIncome, onDeleteIncome }) => {
    const [showForm, setShowForm] = useState(false);
    
    const groupedIncomes = useMemo(() => {
        const groups: { [key: string]: Income[] } = {};
        incomes.forEach(income => {
            const monthKey = income.date.toISOString().substring(0, 7); // YYYY-MM
            if (!groups[monthKey]) groups[monthKey] = [];
            groups[monthKey].push(income);
        });
        return Object.entries(groups);
    }, [incomes]);

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    };

  return (
    <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Income History</h2>
         <div className="space-y-6">
            {incomes.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-slate-400">No income recorded yet.</p>
                    <p className="text-sm text-slate-500">Tap the '+' button to add some.</p>
                </div>
            ) : (
                groupedIncomes.map(([month, incomesInMonth]) => (
                    <div key={month}>
                        <h3 className="text-slate-400 font-semibold mb-2 px-2 sticky top-0 bg-slate-900 py-1 z-10">{formatMonth(month)}</h3>
                        <ul className="space-y-3">
                            {incomesInMonth.sort((a,b) => b.date.getTime() - a.date.getTime()).map(income => (
                                <li key={income.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg group hover:bg-slate-700/50">
                                    <div className="overflow-hidden">
                                        <p className="truncate">{income.description}</p>
                                        <p className="text-sm text-slate-400">{income.date.toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <p className="font-bold text-green-400">+{income.amount.toFixed(3)} OMR</p>
                                        <button onClick={() => onDeleteIncome(income.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
        {showForm && <IncomeForm onAddIncome={onAddIncome} onClose={() => setShowForm(false)} />}
        <button onClick={() => setShowForm(true)} className="fixed bottom-24 right-5 bg-green-600 hover:bg-green-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-green-500 z-40" aria-label="Add new income">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </button>
    </div>
  );
};

export default IncomePage;
