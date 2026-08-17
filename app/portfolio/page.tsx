'use client'

import { PageHeader } from '@/components/page-header'
import { PortfolioGrid } from '@/components/portfolio-grid'
import { useI18n } from '@/lib/i18n/provider'

export default function PortfolioPage() {
  const { t } = useI18n()
  return (
    <>
      <PageHeader title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
      <PortfolioGrid />
    </>
  )
}
