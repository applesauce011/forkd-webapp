import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchPageClient } from '@/components/search/SearchPageClient'

export const metadata: Metadata = { title: "Search | Fork'd" }

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageClient />
    </Suspense>
  )
}
