import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Rocket, Users, Layout, ArrowRight, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/apiClient';

export const OnboardingWizard: React.FC = () => {
  const { user, setCredentials, accessToken } = useAuthStore();
  const [step, setStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  if (!user || user.isOnboarded || isClosing) return null;

  const steps = [
    {
      title: 'Welcome to Tsass!',
      desc: 'Let’s get your workspace ready for growth. This take less than a minute.',
      icon: Rocket,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Define your CRM',
      desc: 'Organize your leads and deals effectively with our 3D pipeline view.',
      icon: Layout,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Invite your Team',
      desc: 'SaaS is better together. Bring your collaborators on board.',
      icon: Users,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const handleComplete = async () => {
    try {
      await apiClient.patch('/users/onboarding-complete');
      // Update local state without logout
      if (user && accessToken) {
        setCredentials(accessToken, { ...user, isOnboarded: true }, null);
      }
      setIsClosing(true);
    } catch (error) {
      console.error('Failed to complete onboarding', error);
      setIsClosing(true); // Close anyway so user isn't stuck
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`} 
                />
              ))}
            </div>
            <button onClick={() => setIsClosing(true)} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 ${currentStep.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                <currentStep.icon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">{currentStep.title}</h2>
              <p className="text-slate-500 mb-8 leading-relaxed px-4">{currentStep.desc}</p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={nextStep}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200"
          >
            {step === steps.length - 1 ? 'Start Exploring' : 'Next Step'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
