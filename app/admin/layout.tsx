// Force all admin pages to render dynamically (no static pre-render at build time)
// Required because Supabase client initialization needs runtime env vars
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
