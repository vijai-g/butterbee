import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function TTPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || !['ADMIN', 'PARTNER'].includes(role)) redirect("/login?from=/tt");
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Delivery Console</h1>
      <p className="text-black/60 mt-2">Coming soon: route planning & today’s orders.</p>
    </section>
  );
}
