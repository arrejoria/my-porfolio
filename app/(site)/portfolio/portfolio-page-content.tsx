'use client'

import { PageHeader } from '@/components/page-header'
import { PortfolioGrid } from '@/components/portfolio-grid'
import { useI18n } from '@/lib/i18n/provider'
import type { ProjectDoc } from '@/lib/payload/types'

export function PortfolioPageContent({ projects }: { projects: ProjectDoc[] }) {
  const { t } = useI18n()
  return (
    <>
      <PageHeader title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
      <PortfolioGrid projects={projects} />
    </>
  )
}
