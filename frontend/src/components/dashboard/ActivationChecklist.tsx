'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, PartyPopper } from 'lucide-react';
import apiClient from '@/lib/apiClient';

const STEPS = [
  { id: 'org', label: 'Setup Organization details', path: '/settings' },
  { id: 'contacts', label: 'Add your first Contact', path: '/crm/contacts' },
  { id: 'deals', label: 'Create a Pipeline deal', path: '/crm/deals' },
  { id: 'sub', label: 'Select a growth plan', path: '/billing' },
];

export default function ActivationChecklist() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get('/auth/me'); // Assume profile has completedSteps
      setCompleted(res.data.completedSteps || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || completed.length === STEPS.length) return null;

  const progress = Math.round((completed.length / STEPS.length) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden mb-8">
      <div className="bg-[#0A4BD4] p-6 text-white relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <span>Get Started with Business OS</span>
            <PartyPopper className="w-5 h-5" />
          </h3>
          <p className="text-blue-100 text-sm mt-1">Complete these steps to unlock full platform potential.</p>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-bold">{progress}% DONE</span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map((step) => {
          const isDone = completed.includes(step.id);
          return (
            <div 
              key={step.id}
              onClick={() => window.location.href = step.path}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isDone ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-md'}`}
            >
              <div className="flex items-center space-x-3">
                {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-blue-300" />}
                <span className={`text-sm font-semibold ${isDone ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{step.label}</span>
              </div>
              {!isDone && <ArrowRight className="w-4 h-4 text-blue-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
