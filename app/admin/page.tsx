import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import AdminSettings from "./AdminSettings";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login?from=/admin");
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin</h1>
      <AdminDashboard />
      <AdminSettings />
    </section>
  );
}
