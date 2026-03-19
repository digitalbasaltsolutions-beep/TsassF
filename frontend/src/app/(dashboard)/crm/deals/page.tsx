'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

const STAGES = ['Lead', 'Negotiation', 'Closed Won', 'Closed Lost'];

export default function DealsPage() {
  const [deals, setdeals] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await apiClient.get('/crm/deals');
      setdeals(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Deals Pipeline</h1>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.pipelineStage === stage);
          return (
            <div key={stage} className="min-w-[300px] bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-4">{stage} <span className="text-gray-400 text-sm ml-2">({stageDeals.length})</span></h3>
              <div className="space-y-3">
                {stageDeals.map(deal => (
                  <div key={deal._id} className="bg-white p-3 rounded shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition">
                    <h4 className="font-medium text-gray-900">{deal.title}</h4>
                    <p className="text-green-600 font-medium text-sm mt-1">${deal.value.toLocaleString()}</p>
                    {deal.contactId && <p className="text-xs text-gray-500 mt-2">{deal.contactId.name}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
