"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [from, setFrom] = useState<string>("/");

  // Avoid useSearchParams during static generation – read from window at runtime
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      setFrom(sp.get("from") || "/");
    } catch {
      setFrom("/");
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      user,            // accepts phone OR user id (see auth note below)
      password,
      callbackUrl: from,
    });
    if (res?.ok) window.location.href = from;
    else alert("Invalid credentials");
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="mb-4 text-2xl font-bold">Sign in</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Phone or User ID"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded-md border px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-full" type="submit">
          Sign in
        </button>
      </form>

      <div className="my-4 text-center text-sm text-black/60">or</div>

      <button
        type="button"
        className="btn btn-secondary w-full"
        onClick={() =>
          signIn("google", { callbackUrl: from }).catch(() => {
            // hard fallback if client script fails
            window.location.href =
              "/api/auth/signin?provider=google&callbackUrl=" +
              encodeURIComponent(from);
          })
        }
      >
        Continue with Google
      </button>

      <noscript>
        <a
          className="btn btn-secondary w-full inline-block text-center mt-3"
          href={
            "/api/auth/signin?provider=google&callbackUrl=" +
            encodeURIComponent(from)
          }
        >
          Continue with Google
        </a>
      </noscript>
    </div>
  );
}
