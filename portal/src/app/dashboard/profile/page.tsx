import { requireProfile } from '@/lib/auth';
import { ProfileSettings } from '@/components/profile/ProfileSettings';

export default async function ProfilePage() {
  const profile = await requireProfile();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 text-2xl">Profile</h1>
      <p className="mb-6 text-sm text-slate-500">Manage your personal sign-in and profile details.</p>
      <ProfileSettings profileId={profile.id} initialName={profile.full_name} initialEmail={profile.email} />
    </div>
  );
}
