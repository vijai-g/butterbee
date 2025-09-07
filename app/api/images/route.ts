import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const revalidate = 60;

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'images');
    const all = fs.readdirSync(dir).filter(f => /\.(png|jpe?g|svg|webp|gif)$/i.test(f));
    return NextResponse.json(all.map(f => `/images/${f}`));
  } catch {
    return NextResponse.json([]);
  }
}
