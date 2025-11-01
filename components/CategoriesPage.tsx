
import React, { useState } from 'react';
import { type Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface CategoriesPageProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id' | 'user_id'>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const CategoryForm: React.FC<{onSave: (category: Omit<Category, 'id' | 'user_id'>) => void; onClose: () => void}> = ({onSave, onClose}) => {
    const [name, setName] = useState('');
    const colors = ['teal', 'blue', 'red', 'purple', 'green', 'orange', 'pink', 'yellow', 'cyan', 'slate'];
    const [color, setColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
    const icons = [
        "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", // default pin
        "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z", // cart
        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", // clock
        "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00-.547-1.806z" // game
    ];
    const [icon, setIcon] = useState(icons[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) return;
        onSave({name, icon, color});
    }

    return (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 p-4 flex justify-center items-start overflow-y-auto">
            <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 w-full max-w-lg mt-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-300">Add New Category</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl" aria-label="Close form">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Category Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-700 p-2 rounded-md" required/>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map(c => <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full bg-${c}-500 transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`} aria-label={`Select ${c} color`}></button>)}
                        </div>
                    </div>
                     <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md">Save Category</button>
                </form>
            </section>
        </div>
    );
};

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, onAddCategory, onDeleteCategory }) => {
    const [showForm, setShowForm] = useState(false);
    
    const handleSaveCategory = async (category: Omit<Category, 'id' | 'user_id'>) => {
        await onAddCategory(category);
        setShowForm(false);
    };

  return (
    <div>
        <h2 className="text-2xl font-bold text-slate-200 mb-4">Manage Categories</h2>
        <div className="space-y-3">
            {categories.map(cat => (
                <div key={cat.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg group hover:bg-slate-700/50">
                    <div className="flex items-center gap-4">
                        <CategoryIcon category={cat} />
                        <span>{cat.name}</span>
                    </div>
                    <button onClick={() => onDeleteCategory(cat.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            ))}
        </div>
        {showForm && <CategoryForm onSave={handleSaveCategory} onClose={() => setShowForm(false)} />}
        <button onClick={() => setShowForm(true)} className="fixed bottom-24 right-5 bg-sky-600 hover:bg-sky-700 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg z-40" aria-label="Add new category">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
        </button>
    </div>
  );
};

export default CategoriesPage;
