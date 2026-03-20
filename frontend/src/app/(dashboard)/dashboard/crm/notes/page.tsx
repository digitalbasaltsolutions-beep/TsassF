'use client';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  FileText,
  User,
  Briefcase,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12 });
  
  // Search is usually on content, but notes are often linked to entities
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotes(1);
  }, []);

  const fetchNotes = async (page = 1) => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/crm/notes', { 
        params: { search, page, limit: meta.limit } 
      });
      setNotes(res.data || []);
      setMeta(res.meta || { total: 0, page: 1, limit: 12 });
    } catch (e: any) {
      console.error(e);
      toast.error(e.apiError?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      await apiClient.delete(`/crm/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note removed');
    } catch (e: any) {
      toast.error(e.apiError?.message || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">CRM Notes</h1>
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
              placeholder="Search notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-zinc-300 w-64 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-hide">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <EmptyState 
              icon={FileText}
              title="No Notes Found"
              description="Keep track of nuances. Notes added to contacts and deals will appear here for quick access."
              actionLabel="Go to Contacts"
              onAction={() => window.location.href = '/dashboard/crm/contacts'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {notes.map(note => (
              <div key={note._id} className="bg-zinc-950/30 border border-zinc-800/80 rounded-3xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <button 
                    onClick={() => handleDelete(note._id)}
                    className="p-2 rounded-xl text-zinc-700 hover:text-rose-500 hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4 flex-1 mb-6">
                  {note.content}
                </p>

                <div className="pt-4 border-t border-zinc-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400">
                        {note.ownerId?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                        {note.ownerId?.firstName} {note.ownerId?.lastName}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-zinc-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {note.linkedEntityId && (
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800/50 w-fit">
                      {note.linkedEntityType === 'Contact' ? (
                        <User className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Briefcase className="w-3 h-3 text-emerald-500" />
                      )}
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        Linked {note.linkedEntityType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.total > meta.limit && (
        <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between bg-zinc-950/20 shrink-0 mt-4 rounded-b-3xl">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
            Showing {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={meta.page <= 1}
              onClick={() => fetchNotes(meta.page - 1)}
              className="p-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 font-extrabold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" /> PREV
            </button>
            <button 
              disabled={meta.page * meta.limit >= meta.total}
              onClick={() => fetchNotes(meta.page + 1)}
              className="p-1.5 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 font-extrabold text-[10px] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-all flex items-center gap-1"
            >
              NEXT <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
