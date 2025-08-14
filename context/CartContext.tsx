'use client';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
type CartItem = { id: string; name: string; price: number; image: string; quantity: number; };
type CartContextType = {
  items: CartItem[];
  add: (item: Omit<CartItem,"quantity">, qty?: number)=>void;
  remove: (id: string)=>void;
  update: (id: string, quantity: number)=>void;
  clear: ()=>void;
  total: number;
  count: number;
};
const CartContext = createContext<CartContextType | null>(null);
const LS_KEY = "butterbee_cart_v1";
export function CartProvider({children}:{children: React.ReactNode}){
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(()=>{ try{ const s = window.localStorage.getItem(LS_KEY); if(s){ const parsed = JSON.parse(s); if(Array.isArray(parsed)) setItems(parsed); } }catch{} },[]);
  useEffect(()=>{ try{ window.localStorage.setItem(LS_KEY, JSON.stringify(items)); }catch{} },[items]);
  const api = useMemo<CartContextType>(()=>{
    const add: CartContextType["add"] = (item, qty=1) => {
      setItems(prev => {
        const i = prev.findIndex(p => p.id === item.id);
        if(i >= 0){ const copy = [...prev]; copy[i] = { ...copy[i], quantity: copy[i].quantity + qty }; return copy; }
        return [...prev, { ...item, quantity: qty }];
      });
    };
    const remove = (id: string) => setItems(prev => prev.filter(p => p.id !== id));
    const update = (id: string, quantity: number) => setItems(prev => prev.map(p => p.id===id ? {...p, quantity} : p));
    const clear = () => setItems([]);
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const count = items.reduce((s, it) => s + it.quantity, 0);
    return { items, add, remove, update, clear, total, count };
  },[items]);
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}
export function useCart(){ const ctx = useContext(CartContext); if(!ctx) throw new Error("useCart must be used within CartProvider"); return ctx; }
