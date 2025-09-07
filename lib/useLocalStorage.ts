import { useEffect, useState } from "react";
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => { try { const raw = typeof window!=='undefined'?localStorage.getItem(key):null; if(raw) setValue(JSON.parse(raw)); } catch{} }, [key]);
  useEffect(() => { try { if (typeof window!=='undefined') localStorage.setItem(key, JSON.stringify(value)); } catch{} }, [key, value]);
  return [value, setValue] as const;
}
