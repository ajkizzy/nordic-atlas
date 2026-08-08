import { requireProfile } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProfileNamePrompt } from '@/components/profile/ProfileNamePrompt';
import { signOut } from '@/app/login/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="md:flex">
      <Sidebar role={profile.role} name={profile.full_name} email={profile.email} signOutAction={signOut} />
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
      {!profile.full_name.trim() && <ProfileNamePrompt profileId={profile.id} email={profile.email} />}
    </div>
  );
}
