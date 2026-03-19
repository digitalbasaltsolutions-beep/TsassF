'use client';
import { useState, useEffect } from 'react';
import apiClient from '../../../lib/apiClient';

export default function BillingPage() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await apiClient.get('/billing/plans');
      setPlans(res.data);
    } catch (e) {
      console.error('Failed to fetch plans', e);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await apiClient.get('/billing/my-subscription');
      setSubscription(res.data);
    } catch (e) {
      console.error('Failed to fetch subscription', e);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/billing/create-checkout-session', { plan: planId });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (e) {
      console.error('Failed to start checkout', e);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
      
      {subscription && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Current Plan: {subscription.plan}</h3>
            <p className="text-sm text-gray-500 mt-1">Status: <span className="text-green-600 font-semibold uppercase">{subscription.status}</span></p>
          </div>
          {subscription.plan !== 'Free' && (
            <button className="text-sm font-semibold text-red-600 hover:text-red-800">Cancel Subscription</button>
          )}
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 pt-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan: any) => (
          <div key={plan.id} className={`bg-white p-6 rounded-lg border-2 shadow-sm ${subscription?.plan === plan.id ? 'border-blue-500' : 'border-gray-100'}`}>
            <h3 className="font-bold text-xl text-gray-900">{plan.name}</h3>
            <p className="text-3xl font-extrabold text-blue-600 mt-4">${plan.price}<span className="text-sm text-gray-500 font-medium">/mo</span></p>
            <ul className="mt-6 space-y-3 mb-8">
              <li className="flex items-center text-sm text-gray-600">
                <span className="mr-2 text-green-500">✓</span> Up to {plan.limits.contacts} Contacts
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="mr-2 text-green-500">✓</span> Standard Support
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={loading || subscription?.plan === plan.id || plan.id === 'Free'}
              className="w-full py-2 rounded-lg font-bold text-sm bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
            >
              {subscription?.plan === plan.id ? 'Current Plan' : (plan.id === 'Free' ? 'Included' : 'Upgrade')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
