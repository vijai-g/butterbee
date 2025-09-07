"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
export default function LoginPage() {
  const [phone, setPhone] = useState(""); const [password, setPassword] = useState("");
  const sp = useSearchParams(); const from = sp.get("from") || "/";
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, phone, password, callbackUrl: from });
    if (res?.ok) window.location.href = from; else alert("Invalid credentials");
  }
  return (<div className="mx-auto max-w-sm py-12">
    <h1 className="text-2xl font-bold mb-4">Sign in</h1>
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="w-full rounded-md border px-3 py-2" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input type="password" className="w-full rounded-md border px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn btn-primary w-full" type="submit">Sign in</button>
    </form>
    <div className="my-4 text-center text-sm text-black/60">or</div>
<button
  type="button"
  className="btn btn-secondary w-full"
  onClick={() =>
    signIn("google", { callbackUrl: from }).catch((e) => {
      console.error("Google signIn failed:", e);
      // hard fallback if JS is half-dead
      window.location.href = "/api/auth/signin?provider=google&callbackUrl=" + encodeURIComponent(from);
    })
  }
>
  Continue with Google
</button>

{/* No-JS fallback (works even if client bundle didn’t hydrate) */}
<noscript>
  <a className="btn btn-secondary w-full" href={"/api/auth/signin?provider=google&callbackUrl=" + encodeURIComponent(from)}>
    Continue with Google
  </a>
</noscript>

  </div>);
}
