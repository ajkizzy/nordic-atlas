'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AssetKind, ClientAsset } from '@/types/db';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FileText, Image as ImageIcon, Trash2, Download, UploadCloud } from 'lucide-react';

const KIND_LABELS: Record<AssetKind, string> = {
  mockup: 'AI mockup (billing proof)',
  contract: 'Contract',
  document: 'Document',
};

export function AssetManager({ clientId, initialAssets }: { clientId: string; initialAssets: ClientAsset[] }) {
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState(initialAssets);
  const [kind, setKind] = useState<AssetKind>('mockup');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUploading(false);
      return setError('Your session has expired. Please sign in again.');
    }
    for (const file of Array.from(files)) {
      const path = `${clientId}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('client-assets').upload(path, file);
      if (upErr) { setError(upErr.message); continue; }
      const { data, error: dbErr } = await supabase
        .from('client_assets')
        .insert({ client_id: clientId, file_path: path, file_name: file.name, file_type: file.type, kind, uploaded_by: user.id })
        .select()
        .single();
      if (dbErr) setError(dbErr.message);
      else setAssets((a) => [data as ClientAsset, ...a]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function download(asset: ClientAsset) {
    // Private bucket → short-lived signed URL
    const { data, error } = await supabase.storage.from('client-assets').createSignedUrl(asset.file_path, 300);
    if (error) return setError(error.message);
    window.open(data.signedUrl, '_blank');
  }

  async function remove(asset: ClientAsset) {
    const { error: sErr } = await supabase.storage.from('client-assets').remove([asset.file_path]);
    const { error: dErr } = await supabase.from('client_assets').delete().eq('id', asset.id);
    if (sErr || dErr) return setError((sErr ?? dErr)!.message);
    setAssets((a) => a.filter((x) => x.id !== asset.id));
  }

  return (
    <Card>
      <CardHeader
        title="Assets"
        subtitle="Mockups used as proof of billing, contracts, and other documents"
        action={
          <div className="flex items-center gap-2">
            <Select value={kind} onChange={(e) => setKind(e.target.value as AssetKind)} className="w-auto text-xs">
              {(Object.keys(KIND_LABELS) as AssetKind[]).map((k) => (
                <option key={k} value={k}>{KIND_LABELS[k]}</option>
              ))}
            </Select>
            <Button size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
              <UploadCloud size={14} /> Upload
            </Button>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              accept="image/png,image/jpeg,image/webp,image/avif,application/pdf,.doc,.docx"
              onChange={(e) => upload(e.target.files)}
            />
          </div>
        }
      />
      <ul className="divide-y divide-slate-100">
        {assets.map((a) => (
          <li key={a.id} className="flex items-center gap-3 px-5 py-3">
            <span className="text-slate-400">
              {a.file_type?.startsWith('image/') ? <ImageIcon size={18} /> : <FileText size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">{a.file_name}</p>
              <p className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString('da-DK')}</p>
            </div>
            <Badge>{KIND_LABELS[a.kind]}</Badge>
            <button onClick={() => download(a)} className="p-1.5 text-slate-400 hover:text-brand-700" title="Download">
              <Download size={16} />
            </button>
            <button onClick={() => remove(a)} className="p-1.5 text-slate-400 hover:text-rose-600" title="Delete">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {assets.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-slate-400">No files attached yet.</li>
        )}
      </ul>
      {error && <p className="px-5 pb-4 text-sm text-rose-600">{error}</p>}
    </Card>
  );
}
