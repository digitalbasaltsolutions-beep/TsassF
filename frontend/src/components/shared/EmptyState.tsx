import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/40 rounded-3xl border-2 border-dashed border-zinc-800/50 backdrop-blur-sm"
    >
      <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
        <Icon className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">{description}</p>
      
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-900/20"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
