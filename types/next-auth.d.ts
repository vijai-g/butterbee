import { DefaultSession } from "next-auth";

declare module "next-auth" {
  type Role = "USER" | "ADMIN" | "PARTNER";

  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN" | "PARTNER";
  }
}
