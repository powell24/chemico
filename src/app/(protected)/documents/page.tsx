import { getDocuments, getSitesForFilter, getDocumentCounts } from "@/lib/supabase/queries/documents"
import { DocumentTable } from "./_components/document-table"
import { DocumentFilters } from "./_components/document-filters"

interface Props {
  searchParams: Promise<{ doc_type?: string; site_id?: string; status?: string; page?: string }>
}

export default async function DocumentsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const [result, sites, counts] = await Promise.all([
    getDocuments({
      doc_type: params.doc_type,
      site_id: params.site_id,
      status: params.status,
      page,
      pageSize: 12,
    }),
    getSitesForFilter(),
    getDocumentCounts(),
  ])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-primary">Document Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and manage SDS sheets, SOPs, regulatory docs, and audits
        </p>
      </div>

      <DocumentFilters
        sites={sites}
        counts={counts}
        currentType={params.doc_type ?? ""}
        currentSiteId={params.site_id ?? ""}
        currentStatus={params.status ?? ""}
      />

      <DocumentTable result={result} />
    </div>
  )
}
