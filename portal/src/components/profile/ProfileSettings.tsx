'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AtSign, KeyRound, UserRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';

type Feedback = { tone: 'success' | 'error'; message: string } | null;

export function ProfileSettings({
  profileId, initialName, initialEmail,
}: {
  profileId: string;
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState<'name' | 'email' | 'password' | null>(null);
  const [nameFeedback, setNameFeedback] = useState<Feedback>(null);
  const [emailFeedback, setEmailFeedback] = useState<Feedback>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fullName = name.trim();
    if (!fullName) return;

    setSaving('name');
    setNameFeedback(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profileId)
      .select('full_name')
      .single();

    setSaving(null);
    if (error) {
      setNameFeedback({ tone: 'error', message: error.message });
      return;
    }
    setName(fullName);
    setNameFeedback({ tone: 'success', message: 'Name updated.' });
    router.refresh();
  }

  async function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmail = email.trim().toLowerCase();
    if (!nextEmail || nextEmail === initialEmail.toLowerCase()) return;

    setSaving('email');
    setEmailFeedback(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser(
      { email: nextEmail },
      { emailRedirectTo: `${window.location.origin}/dashboard/profile` }
    );

    setSaving(null);
    if (error) {
      setEmailFeedback({ tone: 'error', message: error.message });
      return;
    }
    setEmailFeedback({ tone: 'success', message: 'Check your email to confirm the new address.' });
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (newPassword.length < 12) {
      setPasswordFeedback({ tone: 'error', message: 'Use at least 12 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ tone: 'error', message: 'The passwords do not match.' });
      return;
    }

    setSaving('password');
    setPasswordFeedback(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setSaving(null);
    if (error) {
      setPasswordFeedback({ tone: 'error', message: error.message });
      return;
    }
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFeedback({ tone: 'success', message: 'Password changed.' });
  }

  return (
    <div className="space-y-4">
      <SettingsCard icon={UserRound} title="Name">
        <form onSubmit={saveName} className="space-y-3">
          <div>
            <Label htmlFor="profile-full-name">Full name</Label>
            <Input id="profile-full-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={80} />
          </div>
          <FeedbackMessage feedback={nameFeedback} />
          <Button type="submit" loading={saving === 'name'} disabled={!name.trim() || name.trim() === initialName}>Save name</Button>
        </form>
      </SettingsCard>

      <SettingsCard icon={AtSign} title="Email">
        <form onSubmit={saveEmail} className="space-y-3">
          <div>
            <Label htmlFor="profile-email">Login email</Label>
            <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </div>
          <FeedbackMessage feedback={emailFeedback} />
          <Button type="submit" loading={saving === 'email'} disabled={!email.trim() || email.trim().toLowerCase() === initialEmail.toLowerCase()}>Change email</Button>
        </form>
      </SettingsCard>

      <SettingsCard icon={KeyRound} title="Password">
        <form onSubmit={savePassword} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="profile-new-password">New password</Label>
              <Input id="profile-new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} required />
            </div>
            <div>
              <Label htmlFor="profile-confirm-password">Confirm password</Label>
              <Input id="profile-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} required />
            </div>
          </div>
          <FeedbackMessage feedback={passwordFeedback} />
          <Button type="submit" loading={saving === 'password'} disabled={!newPassword || !confirmPassword}>Change password</Button>
        </form>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({
  icon: Icon, title, children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <Icon size={18} className="text-brand-700" />
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return <p className={`text-sm ${feedback.tone === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}>{feedback.message}</p>;
}
