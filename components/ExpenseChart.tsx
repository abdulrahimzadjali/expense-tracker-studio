import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Expense, type Category } from '../types';

interface ExpenseChartProps {
  expenses: Expense[];
  categories: Category[];
}

const tailwindColorMap: { [key: string]: string } = {
  teal: '#00bab3',
  blue: '#3b82f6',
  red: '#ef4444',
  purple: '#a855f7',
  green: '#22c55e',
  orange: '#f97316',
  slate: '#64748b',
  pink: '#ec4899',
  yellow: '#eab308',
  cyan: '#06b6d4',
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses, categories }) => {
  const chartData = useMemo(() => {
    if (expenses.length === 0) return [];
    
    const categoriesMap = new Map(categories.map(cat => [cat.id, cat]));

    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = categoriesMap.get(expense.categoryId);
      if (category) {
          acc[category.name] = (acc[category.name] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(3)),
      color: categories.find(c => c.name === name)?.color || 'slate'
    }));
  }, [expenses, categories]);

  if (expenses.length === 0) {
    return (
        <section className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
             <h2 className="text-lg font-semibold text-slate-300 mb-4 text-center">Spending by Category</h2>
             <div className="flex justify-center items-center h-[250px]">
                <p className="text-slate-400 text-center">No expense data to display chart.</p>
             </div>
        </section>
    );
  }

  return (
    <section className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-300 mb-4 text-center">Spending by Category</h2>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {/* FIX: Explicitly type 'entry' to resolve 'Property 'name' does not exist on type 'unknown'' error. */}
              {/* The type inference for recharts data can be problematic with some TypeScript configurations. */}
              {chartData.map((entry: { name: string; color: string; }) => (
                <Cell key={`cell-${entry.name}`} fill={tailwindColorMap[entry.color] || tailwindColorMap.slate} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
              itemStyle={{ color: '#cbd5e1' }}
              // FIX: Explicitly type 'value' as 'number' to resolve 'Property 'toFixed' does not exist on type 'unknown'' error.
              // The formatter function from recharts can pass values with a type that is not correctly inferred.
              formatter={(value: number) => `${value.toFixed(3)} OMR`}
            />
            <Legend iconSize={10} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default ExpenseChart;