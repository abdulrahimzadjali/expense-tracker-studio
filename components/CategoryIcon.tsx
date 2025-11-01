import React from 'react';
import { type Category } from '../types';

interface CategoryIconProps {
  category: Category;
}

const colorMap: { [key: string]: string } = {
  teal: 'bg-[#00bab3]/20 text-[#00bab3]',
  blue: 'bg-blue-500/20 text-blue-400',
  red: 'bg-red-500/20 text-red-400',
  purple: 'bg-purple-500/20 text-purple-400',
  green: 'bg-green-500/20 text-green-400',
  orange: 'bg-orange-500/20 text-orange-400',
  slate: 'bg-slate-500/20 text-slate-400',
  pink: 'bg-pink-500/20 text-pink-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorMap[category.color] || colorMap.slate}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
      </svg>
    </div>
  );
};

export default CategoryIcon;