"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Product } from "./types";
import toast from "react-hot-toast";

type CartItem = { product: Product; qty: number };
type State = { items: CartItem[] };

type Action =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

const CartContext = createContext<{
  state: State;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const qty = action.qty ?? 1;
      const existing = state.items.find(i => i.product.id === action.product.id);
      let items: CartItem[];
      if (existing) {
        items = state.items.map(i =>
          i.product.id === action.product.id ? { ...i, qty: i.qty + qty } : i
        );
        toast.success("Updated quantity");
      } else {
        items = [...state.items, { product: action.product, qty }];
        toast.success("Added to cart");
      }
      return { items };
    }
    case "REMOVE": {
      const items = state.items.filter(i => i.product.id != action.id);
      toast("Removed item");
      return { items };
    }
    case "SET_QTY": {
      const items = state.items.map(i =>
        i.product.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
      );
      return { items };
    }
    case "CLEAR":
      toast("Cart cleared");
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [persisted, setPersisted] = useLocalStorage<State>("butterbee.cart", { items: [] });
  const [state, dispatch] = useReducer(reducer, persisted);

  // persist on every change
  if (JSON.stringify(state) !== JSON.stringify(persisted)) {
    setPersisted(state);
  }

  const value = useMemo(() => {
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const total = state.items.reduce((s, i) => s + i.qty * i.product.price, 0);
    return {
      state,
      add: (p: Product, qty?: number) => dispatch({ type: "ADD", product: p, qty }),
      remove: (id: string) => dispatch({ type: "REMOVE", id }),
      setQty: (id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }),
      clear: () => dispatch({ type: "CLEAR" }),
      count,
      total
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
