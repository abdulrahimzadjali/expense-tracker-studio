
import React, { useMemo } from 'react';
import { type Expense, type Income } from '../types';

interface SummaryProps {
  expenses: Expense[];
  incomes: Income[];
}

const Summary: React.FC<SummaryProps> = ({ expenses, incomes }) => {
  const { totalExpenses, totalIncomes, balance } = useMemo(() => {
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const totalIncomes = incomes.reduce((acc, income) => acc + income.amount, 0);
    const balance = totalIncomes - totalExpenses;
    return { totalExpenses, totalIncomes, balance };
  }, [expenses, incomes]);

  return (
    <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
        <h2 className="text-lg font-semibold text-slate-300 mb-2">Balance</h2>
        <p className={`text-4xl font-bold ${balance >= 0 ? 'text-[#00bab3]' : 'text-red-400'}`}>
            {balance.toFixed(3)} OMR
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
                <h3 className="text-sm font-medium text-slate-400">Income</h3>
                <p className="text-xl font-semibold text-green-400">
                    +{totalIncomes.toFixed(3)} OMR
                </p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-400">Expenses</h3>
                <p className="text-xl font-semibold text-red-400">
                    -{totalExpenses.toFixed(3)} OMR
                </p>
            </div>
        </div>
    </section>
  );
};

export default Summary;
