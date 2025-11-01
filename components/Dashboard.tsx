
import React from 'react';
import { Expense, Income, Category } from '../types';
import Summary from './Summary';
import ExpenseChart from './ExpenseChart';

interface DashboardProps {
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, incomes, categories }) => {
  return (
    <div className="space-y-6">
      <Summary expenses={expenses} incomes={incomes} />
      <ExpenseChart expenses={expenses} categories={categories} />
    </div>
  );
};

export default Dashboard;
