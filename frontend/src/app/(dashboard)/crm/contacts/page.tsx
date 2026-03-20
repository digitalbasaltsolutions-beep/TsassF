'use client';
import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  MessageSquare, 
  Phone, 
  Mail, 
  Filter, 
  Download, 
  Smartphone, 
  Users,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EmptyState } from '@/components/shared/EmptyState';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '' });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get('/crm/contacts', { 
        params: { search, page, limit: meta.limit } 
      });
      setContacts(res.data.data);
      setMeta(res.data.meta);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/crm/contacts', newContact);
      setShowAddModal(false);
      setNewContact({ name: '', email: '', phone: '', company: '' });
      fetchContacts(1);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    try {
      await apiClient.delete(`/crm/contacts/${id}`);
      fetchContacts(meta.page);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWhatsApp = async (contactId: string) => {
    try {
      await apiClient.post(`/crm/contacts/${contactId}/whatsapp`, { 
        message: 'Hello from Bashanssas CRM!' 
      });
      alert('WhatsApp message queued!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between mb-8 shrink-0 px-1">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Contacts</h1>
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-inner">
             <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">Total</span>
             <span className="text-sm font-extrabold text-blue-400">{meta.total}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-zinc-300 w-72 backdrop-blur-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts Table Container */}
      <div className="flex-1 bg-zinc-950/30 rounded-3xl border border-zinc-800/50 overflow-hidden flex flex-col min-h-0 backdrop-blur-sm">
        <div className="overflow-auto flex-1 scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10">
              <tr className="border-b border-zinc-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Contact Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Email Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Phone Number</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-[73px]">
                      <div className="h-4 bg-zinc-900/50 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 bg-transparent border-none text-center">
                    <EmptyState 
                      icon={Users}
                      title="No Contacts Found"
                      description={search ? "We couldn't find any contacts matching your search criteria." : "Your database is empty. Add your first lead to start growing your business."}
                      actionLabel="Add First Contact"
                      onAction={() => setShowAddModal(true)}
                    />
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/10 flex items-center justify-center text-blue-400 font-extrabold shadow-inner overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${contact.name}&background=random&color=random`} alt="" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{contact.name}</div>
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{contact.company || 'Private'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 group/email cursor-pointer">
                        <Mail className="w-3.5 h-3.5 text-zinc-600 group-hover/email:text-blue-400 transition-colors" />
                        <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                          {contact.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-sm font-medium text-zinc-400 font-mono tracking-tighter text-[13px]">
                          {contact.phone || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                         <span className="text-[10px] font-extrabold text-emerald-400 tracking-wider">ACTIVE</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleWhatsApp(contact._id)}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all group/icon"
                        >
                          <MessageSquare className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                        </button>
                        <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 transition-all group/icon">
                          <Phone className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                        </button>
                        <button 
                          onClick={() => handleDelete(contact._id)}
                          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all font-bold text-[10px]">
                          DELETE
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/20 shrink-0">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
            Showing {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={meta.page <= 1}
              onClick={() => fetchContacts(meta.page - 1)}
              className="p-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 font-extrabold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              PREV
            </button>
            <button 
              disabled={meta.page * meta.limit >= meta.total}
              onClick={() => fetchContacts(meta.page + 1)}
              className="p-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 font-extrabold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all flex items-center gap-1"
            >
              NEXT
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-blue-900/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-white tracking-tight">Add New Contact</h2>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                  <input 
                    type="text" 
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Company</label>
                <input 
                  type="text" 
                  value={newContact.company}
                  onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl border border-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
