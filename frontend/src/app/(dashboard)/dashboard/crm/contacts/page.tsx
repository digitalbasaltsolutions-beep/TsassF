'use client';
import { useState, useEffect, useCallback, memo, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import {
  Search, Plus, Trash2, Edit2, X, Loader2,
  RotateCcw, ChevronLeft, ChevronRight, Mail, Phone, Building2, Tag
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Helpers ────────────────────────────────────────────────────────────────
function cn(...c: (string | boolean | undefined)[]) { return c.filter(Boolean).join(' '); }
const EMPTY = { firstName: '', lastName: '', email: '', phone: '', company: '', tags: '' };

// ─── Modal ───────────────────────────────────────────────────────────────────
const ContactModal = memo(({ isOpen, isSaving, isEditing, contact, onClose, onSave }: {
  isOpen: boolean; isSaving: boolean; isEditing: boolean; contact: any;
  onClose: () => void; onSave: (d: any) => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);
  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const fd = new FormData(ref.current);
    onSave({
      ...contact,
      firstName: fd.get('firstName') as string,
      lastName:  fd.get('lastName')  as string,
      email:     fd.get('email')     as string,
      phone:     (fd.get('phone')    as string) || undefined,
      company:   (fd.get('company')  as string) || undefined,
      tags:      (fd.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
    });
  };

  const F = ({ label, name, type = 'text', required = false, placeholder = '' }: any) => (
    <div>
      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">{label}</label>
      <input name={name} type={type} required={required} disabled={isSaving}
        defaultValue={name === 'tags' ? (contact.tags || []).join(', ') : contact[name] || ''}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md bg-[#111] border border-zinc-800 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">{isEditing ? 'Edit Contact' : 'New Contact'}</h2>
          <button onClick={onClose} disabled={isSaving} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form ref={ref} onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <F label="First Name" name="firstName" required placeholder="John" />
            <F label="Last Name"  name="lastName"  required placeholder="Doe"  />
          </div>
          <F label="Email" name="email" type="email" required placeholder="john@company.com" />
          <div className="grid grid-cols-2 gap-3">
            <F label="Phone"   name="phone"   placeholder="+1 555 000" />
            <F label="Company" name="company" placeholder="Acme Corp" />
          </div>
          <F label="Tags (comma separated)" name="tags" placeholder="vip, enterprise" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-700 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
ContactModal.displayName = 'ContactModal';

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [meta, setMeta]         = useState({ total: 0, page: 1, limit: 15 });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [modal, setModal]       = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent]   = useState<any>(EMPTY);

  const load = useCallback(async (page = 1, q = search, del = showDeleted) => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/crm/contacts', {
        params: { page, limit: 15, search: q || undefined, showDeleted: del || undefined }
      });
      setContacts(res.data || []);
      setMeta(res.meta || { total: 0, page, limit: 15 });
    } catch { toast.error('Failed to load contacts'); }
    finally  { setLoading(false); }
  }, [search, showDeleted]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(1, search, showDeleted), 300);
    return () => clearTimeout(t);
  }, [search, showDeleted]);

  const openAdd  = () => { setCurrent(EMPTY); setIsEditing(false); setModal(true); };
  const openEdit = (c: any) => { setCurrent(c); setIsEditing(true); setModal(true); };

  const handleSave = async (data: any) => {
    const tempId = `tmp-${Date.now()}`;
    const prev = [...contacts];
    setModal(false);
    setIsSaving(true);
    try {
      if (isEditing) {
        setContacts(cs => cs.map(c => c._id === data._id ? { ...c, ...data } : c));
        await apiClient.put(`/crm/contacts/${data._id}`, data);
        toast.success('Contact updated');
      } else {
        setContacts(cs => [{ ...data, _id: tempId, createdAt: new Date().toISOString() }, ...cs]);
        const res: any = await apiClient.post('/crm/contacts', data);
        setContacts(cs => cs.map(c => c._id === tempId ? res.data : c));
        toast.success('Contact created');
      }
    } catch (e: any) {
      setContacts(prev);
      toast.error(e?.response?.data?.message || 'Failed to save');
    } finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string) => {
    const prev = [...contacts];
    setContacts(cs => cs.filter(c => c._id !== id));
    try {
      await apiClient.delete(`/crm/contacts/${id}`);
      toast.success('Contact archived', {
        action: { label: 'Undo', onClick: () => handleRestore(id) }
      });
    } catch { setContacts(prev); toast.error('Delete failed'); }
  };

  const handleRestore = async (id: string) => {
    try {
      await apiClient.patch(`/crm/contacts/${id}/restore`);
      toast.success('Contact restored');
      load(meta.page);
    } catch { toast.error('Restore failed'); }
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{meta.total} total contacts</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search contacts..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white w-52 outline-none focus:border-blue-500 transition-colors" />
          </div>
          {/* Archive toggle */}
          <button onClick={() => setShowDeleted(v => !v)}
            className={cn('px-3 py-2 rounded-xl text-sm font-medium border transition-colors',
              showDeleted ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white')}>
            {showDeleted ? 'Show Active' : 'Archive'}
          </button>
          {/* Add */}
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
            <Plus className="w-4 h-4" /> New Contact
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-24" /></td>
                  ))}
                </tr>
              )) : contacts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-zinc-600">
                  {showDeleted ? 'No archived contacts' : 'No contacts yet — add your first one!'}
                </td></tr>
              ) : contacts.map(c => (
                <tr key={c._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
                        {c.firstName?.[0]}{c.lastName?.[0]}
                      </div>
                      <span className="font-medium text-white">{c.firstName} {c.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{c.email}</td>
                  <td className="px-6 py-4 text-zinc-500">{c.phone || '—'}</td>
                  <td className="px-6 py-4 text-zinc-500">{c.company || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {(c.tags || []).map((t: string) => (
                        <span key={t} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-md text-[10px]">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {showDeleted ? (
                        <button onClick={() => handleRestore(c._id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      ) : (
                        <>
                          <button onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(c._id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-zinc-800 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Page {meta.page} of {totalPages} · {meta.total} contacts
            </span>
            <div className="flex gap-2">
              <button disabled={meta.page <= 1} onClick={() => load(meta.page - 1)}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={meta.page >= totalPages} onClick={() => load(meta.page + 1)}
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ContactModal isOpen={modal} isSaving={isSaving} isEditing={isEditing}
        contact={current} onClose={() => setModal(false)} onSave={handleSave} />
    </div>
  );
}
