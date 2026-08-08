import { requireProfile } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { signOut } from '@/app/login/actions';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="md:flex">
      <Sidebar role={profile.role} name={profile.full_name} signOutAction={signOut} />
      <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
