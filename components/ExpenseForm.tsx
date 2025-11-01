import { GoogleGenAI, Type } from "@google/genai";
import React, { useState, FormEvent } from 'react';
import { type Category, type Expense } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  categories: Category[];
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, categories, onClose }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sms, setSms] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  
  const handleParseSms = async () => {
    if (!sms) return;
    setIsParsing(true);
    setError('');

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      const categoryNames = categories.map(c => c.name).join(', ');
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Parse the following transaction message and extract the expense details. Message: "${sms}". Provide the response as a JSON object with keys: "description" (string), "amount" (number), and "categoryName" (string). The categoryName must be one of the following: [${categoryNames}]. If no specific category matches, use "Other".`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    categoryName: { type: Type.STRING }
                },
                required: ['description', 'amount', 'categoryName']
            }
          }
      });

      const result = JSON.parse(response.text);
      
      setDescription(result.description || '');
      setAmount(result.amount?.toString() || '');
      
      const matchedCategory = categories.find(c => c.name.toLowerCase() === result.categoryName?.toLowerCase());
      if (matchedCategory) {
        setCategoryId(matchedCategory.id);
      } else {
        const otherCategory = categories.find(c => c.name.toLowerCase() === 'other');
        if (otherCategory) setCategoryId(otherCategory.id);
      }
      setSms('');

    } catch (e) {
      console.error('AI parsing failed:', e);
      setError('Failed to parse message. Please enter manually.');
    } finally {
      setIsParsing(false);
    }
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !categoryId) {
      setError('Please fill out all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid, positive amount.');
      return;
    }
    setError('');
    onAddExpense({
      description,
      amount: parsedAmount,
      // FIX: 'categoryId' does not exist in type 'Omit<Expense, "id">'. Corrected to 'category_id'.
      category_id: categoryId,
      date: new Date(date + 'T00:00:00'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 p-4 flex justify-center items-start overflow-y-auto">
        <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full max-w-lg mt-10">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-300">Add New Expense</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl" aria-label="Close form">&times;</button>
        </div>
        
        <div className="mb-4">
            <label htmlFor="sms" className="block text-sm font-medium text-slate-400 mb-1">Parse from message</label>
            <div className="flex gap-2">
                <textarea
                    id="sms"
                    value={sms}
                    onChange={(e) => setSms(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none text-sm"
                    placeholder="Paste SMS here..."
                    rows={2}
                    aria-label="Paste transaction message"
                />
                <button onClick={handleParseSms} disabled={isParsing || !sms} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed shrink-0">
                    {isParsing ? '...' : 'Parse'}
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}
            <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                placeholder="e.g., Coffee"
                required
            />
            </div>
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-1">Amount (OMR)</label>
                <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                placeholder="0.000"
                step="0.001"
                required
                />
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                required
                />
            </div>
            </div>
            <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-[#00bab3] focus:border-[#00bab3] outline-none"
                required
            >
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            </div>
            <button
            type="submit"
            className="w-full bg-[#00bab3] hover:bg-[#00a39e] text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-[#00bab3]"
            >
            Add Expense
            </button>
        </form>
        </section>
    </div>
  );
};

export default ExpenseForm;