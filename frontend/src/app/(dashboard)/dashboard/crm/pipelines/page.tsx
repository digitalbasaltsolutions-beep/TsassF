'use client';
import { useState, useEffect, useRef, memo } from 'react';
import apiClient from '@/lib/apiClient';
import { Plus, Trash2, Edit2, X, Loader2, Settings, ChevronUp, ChevronDown, GitBranch, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

// ─── Pipeline Modal ───────────────────────────────────────────────────────────
const PipelineModal = memo(({ isOpen, isSaving, isEditing, pipeline, onClose, onSave }: any) => {
  const ref = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const fd = new FormData(ref.current);
    onSave({ ...pipeline, name: fd.get('name') as string });
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm bg-[#111] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Pipeline' : 'New Pipeline'}</h2>
          <button onClick={onClose} disabled={isSaving} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form ref={ref} onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Pipeline Name</label>
            <input name="name" required disabled={isSaving} type="text" defaultValue={pipeline?.name || ''} autoFocus
              placeholder="e.g. Main Sales Pipeline"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
PipelineModal.displayName = 'PipelineModal';

// ─── Stage Modal ──────────────────────────────────────────────────────────────
const StageModal = memo(({ isOpen, isSaving, isEditing, stage, onClose, onSave }: any) => {
  const ref = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const fd = new FormData(ref.current);
    onSave({ ...stage, name: fd.get('name') as string });
  };
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xs bg-[#111] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold text-white">{isEditing ? 'Edit Stage' : 'Add Stage'}</h2>
          <button onClick={onClose} disabled={isSaving} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form ref={ref} onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Stage Name</label>
            <input name="name" required disabled={isSaving} type="text" defaultValue={stage?.name || ''} autoFocus
              placeholder="e.g. Qualified"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700">Cancel</button>
            <button type="submit" disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save' : 'Add Stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
StageModal.displayName = 'StageModal';

// ─── Stage Panel ──────────────────────────────────────────────────────────────
function StagePanel({ pipeline, onClose }: { pipeline: any; onClose: () => void }) {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageModal, setStageModal] = useState(false);
  const [isStageSaving, setIsStageSaving] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);

  useEffect(() => { loadStages(); }, [pipeline._id]);

  const loadStages = async () => {
    try { setLoading(true); const res: any = await apiClient.get(`/crm/pipelines/${pipeline._id}/stages`); setStages(res.data || []); }
    catch { toast.error('Failed to load stages'); } finally { setLoading(false); }
  };

  const saveStage = async (data: any) => {
    setIsStageSaving(true); setStageModal(false);
    try {
      if (editingStage) {
        setStages(ss => ss.map(s => s._id === data._id ? { ...s, name: data.name } : s));
        await apiClient.put(`/crm/stages/${data._id}`, { name: data.name });
        toast.success('Stage updated');
      } else {
        const res: any = await apiClient.post('/crm/stages', { name: data.name, pipelineId: pipeline._id, order: stages.length });
        setStages(ss => [...ss, res.data]);
        toast.success('Stage added');
      }
    } catch { toast.error('Failed'); loadStages(); }
    finally { setIsStageSaving(false); setEditingStage(null); }
  };

  const deleteStage = async (id: string) => {
    if (!confirm('Delete this stage?')) return;
    const prev = [...stages];
    setStages(ss => ss.filter(s => s._id !== id));
    try { await apiClient.delete(`/crm/stages/${id}`); toast.success('Stage removed'); }
    catch { setStages(prev); toast.error('Failed'); }
  };

  const reorder = async (id: string, dir: 'up' | 'down') => {
    const idx = stages.findIndex(s => s._id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === stages.length - 1) return;
    const updated = [...stages];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [updated[idx], updated[swap]] = [updated[swap], updated[idx]];
    setStages(updated);
    try { await apiClient.patch(`/crm/pipelines/${pipeline._id}/reorder-stages`, { stages: updated.map((s, i) => ({ id: s._id, order: i })) }); }
    catch { loadStages(); toast.error('Reorder failed'); }
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[400px] bg-[#0d0d0d] border-l border-zinc-800 h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">{pipeline.name}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Manage stages · {stages.length} stages</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-zinc-900 rounded-xl animate-pulse" />) :
            stages.length === 0 ? <div className="text-center py-12 text-zinc-600 text-sm">No stages yet — add one below</div> :
            stages.map((stage, idx) => (
              <div key={stage._id} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 group">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => reorder(stage._id, 'up')} disabled={idx === 0} className="text-zinc-700 hover:text-white disabled:opacity-20"><ChevronUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => reorder(stage._id, 'down')} disabled={idx === stages.length - 1} className="text-zinc-700 hover:text-white disabled:opacity-20"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">{idx + 1}</div>
                <span className="flex-1 text-sm font-medium text-white">{stage.name}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingStage(stage); setStageModal(true); }} className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteStage(stage._id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))
          }
        </div>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={() => { setEditingStage(null); setStageModal(true); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Stage
          </button>
        </div>
      </div>
      <StageModal isOpen={stageModal} isSaving={isStageSaving} isEditing={!!editingStage}
        stage={editingStage} onClose={() => { setStageModal(false); setEditingStage(null); }} onSave={saveStage} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent]     = useState<any>(null);
  const [managing, setManaging]   = useState<any>(null);

  useEffect(() => { loadPipelines(); }, []);

  const loadPipelines = async () => {
    try { setLoading(true); const res: any = await apiClient.get('/crm/pipelines'); setPipelines(res.data || []); }
    catch { toast.error('Failed to load pipelines'); } finally { setLoading(false); }
  };

  const savePipeline = async (data: any) => {
    setModal(false); setIsSaving(true);
    try {
      if (isEditing) {
        setPipelines(ps => ps.map(p => p._id === data._id ? { ...p, name: data.name } : p));
        await apiClient.put(`/crm/pipelines/${data._id}`, { name: data.name });
        toast.success('Pipeline updated');
      } else {
        const res: any = await apiClient.post('/crm/pipelines', { name: data.name });
        setPipelines(ps => [...ps, res.data]);
        toast.success('Pipeline created');
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.apiError?.message || err?.response?.data?.message;
      if (status === 403) {
        toast.error(message || 'Pipeline limit reached. Please upgrade your plan to create more pipelines.', { duration: 6000 });
      } else {
        toast.error('Failed to save pipeline. Please try again.');
      }
      loadPipelines();
    }
    finally { setIsSaving(false); }
  };

  const deletePipeline = async (id: string) => {
    if (!confirm('Delete this pipeline?')) return;
    const prev = [...pipelines];
    setPipelines(ps => ps.filter(p => p._id !== id));
    try { await apiClient.delete(`/crm/pipelines/${id}`); toast.success('Deleted'); }
    catch { setPipelines(prev); toast.error('Failed'); }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipelines</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{pipelines.length} pipeline{pipelines.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={() => { setCurrent(null); setIsEditing(false); setModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Pipeline
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : pipelines.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <GitBranch className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-white font-semibold">No pipelines yet</p>
          <p className="text-zinc-500 text-sm">Create your first pipeline to start managing deals</p>
          <button onClick={() => { setCurrent(null); setIsEditing(false); setModal(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Create Pipeline
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelines.map(p => (
            <div key={p._id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 group hover:border-zinc-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Active Pipeline</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setCurrent(p); setIsEditing(true); setModal(true); }}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePipeline(p._id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`/dashboard/crm/deals?pipeline=${p._id}`}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> View Board
                </a>
                <button onClick={() => setManaging(p)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Stages
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PipelineModal isOpen={modal} isSaving={isSaving} isEditing={isEditing}
        pipeline={current} onClose={() => setModal(false)} onSave={savePipeline} />
      {managing && <StagePanel pipeline={managing} onClose={() => setManaging(null)} />}
    </div>
  );
}
