'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Users, Building2, Trash2, ShieldCheck, Activity, Edit2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States for editing
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState('Free');
  const [editSubscriptions, setEditSubscriptions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  const availableProducts = ['crm', 'ecommerce', 'marketing', 'whatsapp'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, orgsRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/organizations')
      ]);
      setStats(statsRes.data);
      setOrgs(orgsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrg = async (id: string) => {
    if (!confirm('Are you sure you want to delete this organization? All data will be lost.')) return;
    try {
      await apiClient.delete(`/admin/organizations/${id}`);
      setOrgs(orgs.filter(o => o._id !== id));
    } catch (e) {
      alert('Delete failed');
    }
  };

  const startEdit = (org: any) => {
    setEditingOrgId(org._id);
    setEditPlan(org.subscriptionPlan || 'Free');
    setEditSubscriptions(org.subscriptions || ['crm']);
  };

  const cancelEdit = () => {
    setEditingOrgId(null);
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      const { data } = await apiClient.patch(`/admin/organizations/${id}`, {
        subscriptionPlan: editPlan,
        subscriptions: editSubscriptions
      });
      setOrgs(orgs.map(o => o._id === id ? { ...o, subscriptionPlan: data.subscriptionPlan, subscriptions: data.subscriptions } : o));
      setEditingOrgId(null);
    } catch (e) {
      alert('Failed to update organization');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSubscription = (productId: string) => {
    setEditSubscriptions(prev => 
      prev.includes(productId) ? prev.filter(p => p !== productId) : [...prev, productId]
    );
  };

  if (loading) return <div className="p-8">Loading Platform Admin...</div>;

  const filteredOrgs = orgs.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) || 
    org._id.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Admin</h1>
          <p className="text-gray-500 mt-1">Manage global organizations and system health</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-100">
          <Activity className="w-4 h-4" />
          <span>System: Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Organizations</p>
            <p className="text-2xl font-bold">{stats?.totalOrganizations || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Sec Nodes</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Platform MRR</p>
            <p className="text-2xl font-bold text-emerald-600">${(stats?.mrr || 1500).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Global Organizations</h2>
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Plan</th>
              <th className="px-6 py-3 font-semibold text-center">Products</th>
              <th className="px-6 py-3 font-semibold">Created At</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrgs.map((org) => (
              <tr key={org._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">
                  {org.name}
                  <div className="font-mono text-[10px] font-normal text-gray-400 mt-0.5">{org._id}</div>
                </td>
                
                {editingOrgId === org._id ? (
                  <td className="px-6 py-4" colSpan={2}>
                    <div className="bg-white border text-sm border-blue-200 p-4 rounded-xl shadow-sm">
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Plan</label>
                        <select 
                          className="w-full border-gray-200 rounded-lg text-sm"
                          value={editPlan}
                          onChange={e => setEditPlan(e.target.value)}
                        >
                          <option value="Free">Free</option>
                          <option value="Pro">Pro</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Enabled Products</label>
                        <div className="flex flex-wrap gap-2">
                          {availableProducts.map(prod => (
                            <button
                              key={prod}
                              onClick={() => toggleSubscription(prod)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center space-x-1
                                ${editSubscriptions.includes(prod) 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                            >
                              {editSubscriptions.includes(prod) ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span className="capitalize">{prod}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button onClick={cancelEdit} className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button onClick={() => saveEdit(org._id)} disabled={isSaving} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {org.subscriptionPlan || 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center flex-wrap gap-1 max-w-[200px]">
                        {(org.subscriptions || ['crm']).map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 text-[10px] font-bold uppercase uppercase tracking-wider">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </>
                )}

                {editingOrgId !== org._id && (
                  <>
                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">{new Date(org.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => startEdit(org)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Edit Plan & Products"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrg(org._id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete Organization"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
