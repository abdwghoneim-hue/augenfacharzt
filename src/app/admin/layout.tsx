import { requireAdminUser } from "@/lib/guards";
import { Nav } from "@/components/Nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser();
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Nav user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
