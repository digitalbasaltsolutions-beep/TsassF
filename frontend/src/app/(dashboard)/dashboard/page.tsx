'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

export default function DashboardPage() {
  const [stats, setStats] = useState({ contacts: 0, deals: 0, revenue: 0, sales: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [contactsRes, dealsRes, ordersRes] = await Promise.all([
          apiClient.get('/crm/contacts'),
          apiClient.get('/crm/deals'),
          apiClient.get('/ecommerce/orders')
        ]);
        
        const contacts = contactsRes.data.length;
        const deals = dealsRes.data.length;
        const crmRevenue = dealsRes.data
          .filter((d: any) => d.status === 'Won')
          .reduce((sum: number, d: any) => sum + d.value, 0);

        const ecommerceSales = ordersRes.data
          .filter((o: any) => o.status !== 'canceled')
          .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        setStats({ contacts, deals, revenue: crmRevenue, sales: ecommerceSales });
      } catch (e) {
        console.error('Failed to fetch stats', e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Contacts</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.contacts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pipeline</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.deals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Deal Rev</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">${stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Store Sales</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">${stats.sales.toLocaleString()}</p>
        </div>
      </div>
      
      {/* Activity Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p className="text-gray-400">Activity Chart & Recent Logs will appear here</p>
      </div>
    </div>
  );
}
