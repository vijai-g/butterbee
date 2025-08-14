'use client';
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export function Header(){
  const { count } = useCart();
  const [open,setOpen] = useState(false);
  const nav = [
    {href:"/menu", label:"Menu"},
    {href:"/cart", label:"Cart"},
    {href:"/checkout", label:"Checkout"},
    {href:"/about", label:"About"},
    {href:"/contact", label:"Contact"},
  ];
  return (
    <header className="border-b bg-white">
      <div className="container-px py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image src="/logo.svg" width={36} height={36} alt="ButterBee logo"/>
          <span className="text-2xl font-extrabold">Butter<span className="text-primary">Bee</span></span>
        </Link>
        <button className="md:hidden ml-auto btn" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="mainnav">
          ☰
        </button>
        <nav id="mainnav" className={`ml-auto ${open ? "" : "hidden"} md:block`}>
          <ul className="flex gap-4 items-center">
            {nav.map(n => (
              <li key={n.href}>
                <Link className="hover:underline" href={n.href}>{n.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/cart" className="relative btn btn-outline" aria-label="Cart">
                🛒
                {count > 0 && (
                  <span aria-label={`${count} items in cart`} className="absolute -top-2 -right-2 bg-primary text-secondary rounded-full text-xs font-bold px-2 py-0.5">
                    {count}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
