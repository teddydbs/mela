'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { MemoryGame } from '@/components/games/memory-game';
import { isMemoryTheme } from '@/lib/data/memory';

interface PageProps {
  params: Promise<{ theme: string }>;
}

export default function MemoryThemePage({ params }: PageProps) {
  const { theme } = use(params);

  if (!isMemoryTheme(theme)) {
    notFound();
  }

  return <MemoryGame theme={theme} />;
}
