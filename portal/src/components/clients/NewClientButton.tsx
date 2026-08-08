'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Plus, X } from 'lucide-react';

export function NewClientButton() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', org_number: '', contact_name: '', email: '', phone: '', city: '' });

  async function submit() {
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaving(false);
      return setError('Your session has expired. Please sign in again.');
    }
    const { data, error } = await supabase.from('clients').insert({
      ...form,
      created_by: user.id,
      org_number: form.org_number || null,
      contact_name: form.contact_name || null,
      email: form.email || null,
      phone: form.phone || null,
      city: form.city || null,
    }).select('id').single();
    setSaving(false);
    if (error) return setError(error.message);
    setOpen(false);
    router.push(`/dashboard/clients/${data.id}`);
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}><Plus size={14} /> New client</Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg">New client</h3>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div><Label>Company name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>CVR number</Label><Input value={form.org_number} onChange={(e) => setForm({ ...form, org_number: e.target.value })} /></div>
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            </div>
            <div><Label>Contact person</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button loading={saving} disabled={!form.name.trim()} onClick={submit} className="w-full">Create client</Button>
          </div>
        </div>
      )}
    </>
  );
}
