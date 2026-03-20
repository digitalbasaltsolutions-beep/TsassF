'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  MoreHorizontal, 
  Plus, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
  Search,
  X,
  ChevronDown
} from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [activePipeline, setActivePipeline] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: '', value: 0, pipelineId: '', stageId: '', contactId: '' });
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [pipeRes, contactRes] = await Promise.all([
        apiClient.get('/crm/pipelines'),
        apiClient.get('/crm/contacts', { params: { limit: 100 } })
      ]);
      setPipelines(pipeRes.data);
      setContacts(contactRes.data.data || []);
      
      if (pipeRes.data.length > 0) {
        const firstPipe = pipeRes.data[0];
        setActivePipeline(firstPipe);
        fetchPipelineDetails(firstPipe._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPipelineDetails = async (pipelineId: string) => {
    try {
      const [stageRes, dealRes] = await Promise.all([
        apiClient.get(`/crm/pipelines/${pipelineId}/stages`),
        apiClient.get('/crm/deals', { params: { pipelineId, limit: 100 } })
      ]);
      setStages(stageRes.data);
      setDeals(dealRes.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStageMove = async (dealId: string, stageId: string) => {
    try {
      await apiClient.patch(`/crm/deals/${dealId}/move-stage`, { stageId });
      fetchPipelineDetails(activePipeline._id);
    } catch (e) {
      console.error(e);
      alert('Failed to move deal. Check pipeline constraints.');
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/crm/deals', { 
        ...newDeal, 
        pipelineId: activePipeline._id
      });
      setShowAddModal(false);
      setNewDeal({ title: '', value: 0, pipelineId: '', stageId: '', contactId: '' });
      fetchPipelineDetails(activePipeline._id);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateTotal = (stageId: string) => {
    return deals
      .filter(d => (d.stageId?._id || d.stageId) === stageId)
      .reduce((sum, d) => sum + (d.value || 0), 0);
  };

  const getStageColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500', 'bg-rose-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Kanban Toolbar */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-2 text-3xl font-extrabold text-white tracking-tight hover:text-blue-400 transition-colors">
              {activePipeline?.name || 'Loading...'}
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
               {pipelines.map(p => (
                 <button 
                  key={p._id}
                  onClick={() => { setActivePipeline(p); fetchPipelineDetails(p._id); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    activePipeline?._id === p._id ? "bg-blue-600 text-white" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                  )}
                 >
                   {p.name}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl p-1 shadow-inner px-2">
             <button className="px-4 py-1.5 rounded-lg bg-zinc-950/50 text-blue-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <LayoutGrid className="w-3.5 h-3.5" />
                Kanban
             </button>
             <button className="px-4 py-1.5 rounded-lg text-zinc-600 text-xs font-bold hover:text-zinc-400 transition-colors flex items-center gap-1.5 cursor-not-allowed">
                <List className="w-3.5 h-3.5" />
                List
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98]"
            onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Create Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-hide select-none transition-all">
        {stages.length === 0 && !loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <EmptyState 
              icon={LayoutGrid}
              title="No Pipeline Configured"
              description="Your sales process starts here. Create your first pipeline and stages to track your deals."
              actionLabel="Create Pipeline"
              onAction={() => {}}
            />
          </div>
        ) : (
          stages.map((stage, idx) => {
            const stageDeals = deals.filter(d => (d.stageId?._id || d.stageId) === stage._id);
            const totalValue = calculateTotal(stage._id);

            return (
              <div key={stage._id} className="flex flex-col min-w-[320px] w-[320px] group/column">
                <div className="mb-4 px-1">
                  <div className={cn("h-1.5 w-full rounded-full mb-4 opacity-70 transition-all group-hover/column:opacity-100", getStageColor(idx))} />
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-sm tracking-wide uppercase transition-colors group-hover/column:text-blue-400">{stage.name}</h3>
                    <div className="text-[10px] font-black text-zinc-600 bg-zinc-900/50 border border-zinc-800 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      ${totalValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stageDeals.length} Deal{stageDeals.length !== 1 ? 's' : ''}</div>
                </div>

                <div className="flex-1 bg-zinc-950/20 rounded-3xl p-2 border border-zinc-800/30 space-y-3 overflow-y-auto scrollbar-hide min-h-0 backdrop-blur-sm">
                  {loading ? (
                    <div className="h-32 bg-zinc-900/30 rounded-2xl animate-pulse" />
                  ) : (
                    stageDeals.map((deal) => (
                      <div 
                        key={deal._id} 
                        className="bg-zinc-900/50 border border-zinc-800/50 hover:border-blue-500/40 p-4 rounded-2xl shadow-lg transition-all hover:translate-y-[-2px] hover:bg-zinc-900/80 cursor-grab active:cursor-grabbing group/card"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-extrabold text-[13px] text-zinc-100 leading-tight group-hover/card:text-blue-400 transition-colors uppercase tracking-tight">
                            {deal.title}
                          </h4>
                          <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                           <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                              <DollarSign className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 text-xs font-black tracking-tighter">
                                {deal.value?.toLocaleString() || '0'}
                              </span>
                           </div>
                           <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-lg border border-zinc-800/50">
                              <Calendar className="w-3 h-3 text-zinc-500" />
                              <span className="text-zinc-400 text-[10px] font-bold">
                                {new Date(deal.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                              </span>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/30">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full border border-zinc-800 bg-zinc-950 overflow-hidden flex items-center justify-center">
                                <img src={`https://ui-avatars.com/api/?name=${deal.contactId?.name || 'U'}&background=random&size=40`} alt="" />
                             </div>
                             <span className="text-[10px] font-bold text-zinc-500 max-w-[120px] truncate uppercase tracking-tight">
                               {deal.contactId?.name || 'Unassigned'}
                             </span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            {stages.filter(s => s._id !== stage._id).slice(0, 1).map(nextStage => (
                              <button 
                                key={nextStage._id}
                                onClick={() => handleStageMove(deal._id, nextStage._id)}
                                className="p-1 px-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-black text-[8px] hover:bg-blue-600 hover:text-white transition-all">
                                MOVE NEXT
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <button 
                    onClick={() => {
                      setNewDeal({ ...newDeal, stageId: stage._id });
                      setShowAddModal(true);
                    }}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/10 text-zinc-600 hover:text-zinc-400 transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Deal</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in transition-all">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-white tracking-tighter">CREATE NEW DEAL</h2>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2 ml-1">Deal Title</label>
                <input required type="text" value={newDeal.title} onChange={(e) => setNewDeal({...newDeal, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all" placeholder="e.g. Enterprise License" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2 ml-1">Value ($)</label>
                  <input required type="number" value={newDeal.value} onChange={(e) => setNewDeal({...newDeal, value: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2 ml-1">Contact</label>
                  <select required value={newDeal.contactId} onChange={(e) => setNewDeal({...newDeal, contactId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white appearance-none">
                    <option value="">Select Contact</option>
                    {contacts.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-transparent hover:bg-zinc-900 text-zinc-400 font-black py-4 rounded-2xl border border-zinc-800 transition-all">CANCEL</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-blue-900/30 transition-all active:scale-[0.98]">SAVE DEAL</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
