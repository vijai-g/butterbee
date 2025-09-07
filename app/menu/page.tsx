import { redirect } from "next/navigation";

export default function MenuRedirect({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  // map legacy ?category=... to ?department=...
  const department =
    (searchParams?.department as string) ??
    (searchParams?.category as string) ??
    "";

  const q = department ? `?department=${encodeURIComponent(department)}` : "";
  redirect(`/shop${q}`);
}
