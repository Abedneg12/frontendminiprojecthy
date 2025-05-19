'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function SearchBar({ className = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = useState(searchParams?.get('search') || '');
  const [query] = useDebounce(text, 500);

  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());

    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    router.push(`/?${params.toString()}`);
  }, [query, router, searchParams]);

  return (
    <input
      type="text"
      placeholder="Search events..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}