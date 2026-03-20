'use client';
import { useState, useEffect, useCallback, memo, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import { Plus, Trash2, Edit2, X, Loader2, ChevronDown, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
  DndContext, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function cn(...c: (string | boolean | undefined)[]) { return c.filter(Boolean).join(' '); }

// ─── Deal Card ────────────────────────────────────────────────────────────────
const DealCard = memo(({ deal, onEdit, onDelete }: { deal: any; onEdit: (d: any) => void; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal._id });
  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const contactName = deal.contactId
    ? `${deal.contactId.firstName ?? ''} ${deal.contactId.lastName ?? ''}`.trim()
    : null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-blue-500/30 transition-colors select-none group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">{deal.title}</h4>
        <div className="flex gap-1 shrink-0" onPointerDown={e => e.stopPropagation()}>
          <button onClick={() => onEdit(deal)}
            className="p-1 rounded-md text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 opacity-0 group-hover:opacity-100 transition-all">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(deal._id)}
            className="p-1 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {deal.companyName && (
        <p className="text-xs text-zinc-500 mb-2 font-medium">{deal.companyName}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-blue-400">${(deal.value ?? 0).toLocaleString()}</span>
        {contactName && (
          <span className="text-[10px] text-zinc-600 truncate max-w-[120px]">{contactName}</span>
        )}
      </div>
    </div>
  );
});
DealCard.displayName = 'DealCard';

// ─── Deal Modal ───────────────────────────────────────────────────────────────
const DealModal = memo(({ isOpen, isSaving, isEditing, deal, stages, contacts, stageId, onClose, onSave }: {
  isOpen: boolean; isSaving: boolean; isEditing: boolean; deal: any;
  stages: any[]; contacts: any[]; stageId?: string;
  onClose: () => void; onSave: (d: any) => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const fd = new FormData(ref.current);
    onSave({
      ...deal,
      title:       fd.get('title') as string,
      companyName: fd.get('companyName') as string || undefined,
      value:       Number(fd.get('value') || 0),
      contactId:   (fd.get('contactId') as string) || undefined,
      stageId:     fd.get('stageId') as string,
    });
  };

  const defaultStage = deal?.stageId?._id || deal?.stageId || stageId || stages[0]?._id || '';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md bg-[#111] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Deal' : 'New Deal'}</h2>
          <button onClick={onClose} disabled={isSaving} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form ref={ref} onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Deal Title *</label>
            <input name="title" required disabled={isSaving} type="text" defaultValue={deal?.title || ''} autoFocus
              placeholder="e.g. Acme Corp — Enterprise License"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Company Name</label>
            <input name="companyName" disabled={isSaving} type="text" defaultValue={deal?.companyName || ''}
              placeholder="e.g. Acme Corp"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Value ($)</label>
              <input name="value" disabled={isSaving} type="number" min="0" defaultValue={deal?.value ?? 0}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Stage *</label>
              <select name="stageId" required disabled={isSaving} defaultValue={defaultStage}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors appearance-none">
                {stages.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Contact</label>
            <select name="contactId" disabled={isSaving} defaultValue={deal?.contactId?._id || deal?.contactId || ''}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors appearance-none">
              <option value="">— No contact —</option>
              {contacts.map(c => <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
DealModal.displayName = 'DealModal';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DealsPage() {
  const [pipelines, setPipelines]     = useState<any[]>([]);
  const [activePipeline, setActivePipeline] = useState<any>(null);
  const [stages, setStages]           = useState<any[]>([]);
  const [deals, setDeals]             = useState<any[]>([]);
  const [contacts, setContacts]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(false);
  const [isSaving, setIsSaving]       = useState(false);
  const [isEditing, setIsEditing]     = useState(false);
  const [current, setCurrent]         = useState<any>(null);
  const [defaultStageId, setDefaultStageId] = useState<string>('');
  const [activeId, setActiveId]       = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const loadBoard = useCallback(async (pipelineId: string) => {
    try {
      setLoading(true);
      const [stagesRes, dealsRes]: any[] = await Promise.all([
        apiClient.get(`/crm/pipelines/${pipelineId}/stages`),
        apiClient.get('/crm/deals', { params: { pipelineId, limit: 500 } }),
      ]);
      setStages(stagesRes.data || []);
      setDeals(dealsRes.data || []);
    } catch { toast.error('Failed to load board'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [pipRes, conRes]: any[] = await Promise.all([
          apiClient.get('/crm/pipelines'),
          apiClient.get('/crm/contacts', { params: { limit: 500 } }),
        ]);
        const pips = pipRes.data || [];
        setContacts(conRes.data || []);
        setPipelines(pips);
        if (pips.length > 0) {
          setActivePipeline(pips[0]);
          loadBoard(pips[0]._id);
        } else { setLoading(false); }
      } catch { setLoading(false); }
    })();
  }, [loadBoard]);

  // ── Drag handlers ──
  const onDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const drag = deals.find(d => d._id === active.id);
    if (!drag) return;
    const overId = over.id as string;
    const overStage = stages.find(s => s._id === overId);
    const targetSid = overStage?._id ?? deals.find(d => d._id === overId)?.stageId;
    if (!targetSid) return;
    const curSid = drag.stageId?._id ?? drag.stageId;
    if (curSid !== targetSid) setDeals(prev => prev.map(d => d._id === active.id ? { ...d, stageId: targetSid } : d));
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const drag = deals.find(d => d._id === active.id);
    if (!drag) return;
    const overId = over.id as string;
    let targetSid = stages.find(s => s._id === overId)?._id ?? deals.find(d => d._id === overId)?.stageId;
    if (!targetSid) return;
    const curSid = drag.stageId?._id ?? drag.stageId;
    if (curSid !== targetSid) {
      try { await apiClient.patch(`/crm/deals/${drag._id}/move-stage`, { stageId: targetSid }); }
      catch { loadBoard(activePipeline._id); }
    }
  };

  // ── CRUD ───
  const openAdd = (stageId?: string) => {
    setCurrent(null); setIsEditing(false);
    setDefaultStageId(stageId || stages[0]?._id || '');
    setModal(true);
  };
  const openEdit = (deal: any) => { setCurrent(deal); setIsEditing(true); setModal(true); };

  const handleSave = async (data: any) => {
    if (!activePipeline) return;
    if (!data.stageId) { toast.error('Please select a stage'); return; }
    const tempId = isEditing ? data._id : `tmp-${Date.now()}`;
    const prev = [...deals];
    const optimistic = { ...data, _id: tempId, pipelineId: activePipeline._id, status: data.status || 'Open', createdAt: data.createdAt || new Date().toISOString() };
    if (isEditing) setDeals(ds => ds.map(d => d._id === tempId ? optimistic : d));
    else setDeals(ds => [optimistic, ...ds]);
    setModal(false); setIsSaving(true);
    try {
      if (isEditing) {
        const res: any = await apiClient.put(`/crm/deals/${data._id}`, { ...data, pipelineId: activePipeline._id });
        setDeals(ds => ds.map(d => d._id === tempId ? res.data : d));
        toast.success('Deal updated');
      } else {
        const res: any = await apiClient.post('/crm/deals', { ...data, pipelineId: activePipeline._id, status: 'Open' });
        setDeals(ds => ds.map(d => d._id === tempId ? res.data : d));
        toast.success('Deal created');
      }
    } catch (err: any) {
      setDeals(prev);
      toast.error(err?.response?.data?.message || 'Failed to save deal');
    } finally { setIsSaving(false); setIsEditing(false); }
  };

  const handleDelete = async (id: string) => {
    const prev = [...deals];
    setDeals(ds => ds.filter(d => d._id !== id));
    try { await apiClient.delete(`/crm/deals/${id}`); toast.success('Deal deleted'); }
    catch { setDeals(prev); toast.error('Failed to delete'); }
  };

  const totalValue = deals.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Pipeline switcher */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-xl font-bold text-white hover:text-blue-400 transition-colors">
              {loading ? 'Loading...' : activePipeline?.name || 'No Pipeline'}
              <ChevronDown className="w-5 h-5 text-zinc-500" />
            </button>
            {pipelines.length > 1 && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#111] border border-zinc-800 rounded-xl shadow-2xl z-50 py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                {pipelines.map(p => (
                  <button key={p._id} onClick={() => { setActivePipeline(p); loadBoard(p._id); }}
                    className={cn('w-full text-left px-4 py-2.5 text-sm transition-colors', activePipeline?._id === p._id ? 'text-blue-400 bg-blue-400/5' : 'text-zinc-400 hover:text-white hover:bg-white/5')}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
            <DollarSign className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-sm font-semibold text-white">${totalValue.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500">total · {deals.length} deals</span>
          </div>
        </div>
        <button onClick={() => openAdd()}
          disabled={!activePipeline || stages.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Deal
        </button>
      </div>

      {/* Empty state */}
      {!loading && pipelines.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-white font-semibold">No pipelines yet</p>
          <p className="text-zinc-500 text-sm">Create a pipeline first to start managing deals</p>
          <a href="/dashboard/crm/pipelines"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Create Pipeline
          </a>
        </div>
      )}

      {/* Kanban Board */}
      {(loading || pipelines.length > 0) && (
        <DndContext sensors={sensors} collisionDetection={closestCorners}
          onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[280px] h-full bg-zinc-900/40 border border-zinc-800 rounded-2xl animate-pulse" />
            )) : stages.map(stage => {
              const stageDeals = deals.filter(d => (d.stageId?._id ?? d.stageId) === stage._id);
              const stageValue = stageDeals.reduce((s, d) => s + (d.value || 0), 0);
              return (
                <div key={stage._id} className="min-w-[280px] w-[280px] flex flex-col">
                  {/* Stage header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{stage.name}</h3>
                      <p className="text-[10px] text-zinc-500">{stageDeals.length} deals · ${stageValue.toLocaleString()}</p>
                    </div>
                    <button onClick={() => openAdd(stage._id)}
                      className="p-1 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Deals */}
                  <SortableContext id={stage._id} items={stageDeals.map(d => d._id)} strategy={verticalListSortingStrategy}>
                    <div id={stage._id} className="flex-1 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-2 space-y-2 min-h-[200px] overflow-y-auto">
                      {stageDeals.map(deal => (
                        <DealCard key={deal._id} deal={deal} onEdit={openEdit} onDelete={handleDelete} />
                      ))}
                      {stageDeals.length === 0 && (
                        <button onClick={() => openAdd(stage._id)}
                          className="w-full py-8 rounded-xl border border-dashed border-zinc-800 text-zinc-700 hover:text-zinc-500 hover:border-zinc-700 text-xs transition-colors">
                          + Add deal
                        </button>
                      )}
                    </div>
                  </SortableContext>
                </div>
              );
            })}
          </div>
        </DndContext>
      )}

      <DealModal isOpen={modal} isSaving={isSaving} isEditing={isEditing}
        deal={current} stages={stages} contacts={contacts} stageId={defaultStageId}
        onClose={() => { setModal(false); setIsEditing(false); }}
        onSave={handleSave} />
    </div>
  );
}
