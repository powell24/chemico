import { getAllDocuments, getSitesForFilter, getDocumentCounts } from "@/lib/supabase/queries/documents"
import { DocumentsShell } from "./_components/documents-shell"

export default async function DocumentsPage() {
  const [documents, sites, counts] = await Promise.all([
    getAllDocuments(),
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

      <DocumentsShell documents={documents} sites={sites} counts={counts} />
    </div>
  )
}
