"use client"

import { useState, useMemo } from "react"
import { DocumentFilters } from "./document-filters"
import { DocumentTable } from "./document-table"
import type { Document, DocumentCounts } from "@/lib/supabase/queries/documents"

const PAGE_SIZE = 12

interface DocumentsShellProps {
  documents: Document[]
  sites: { id: string; name: string }[]
  counts: DocumentCounts
}

export function DocumentsShell({ documents, sites, counts }: DocumentsShellProps) {
  const [docType, setDocType] = useState("")
  const [siteId, setSiteId] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => documents.filter((d) => {
    if (docType && d.doc_type !== docType) return false
    if (siteId && d.site?.id !== siteId) return false
    if (status && d.status !== status) return false
    return true
  }), [documents, docType, siteId, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFilter(key: "docType" | "siteId" | "status", value: string) {
    const v = value === "all" ? "" : value
    if (key === "docType") setDocType(v)
    if (key === "siteId") setSiteId(v)
    if (key === "status") setStatus(v)
    setPage(1)
  }

  return (
    <>
      <DocumentFilters
        sites={sites}
        counts={counts}
        currentType={docType}
        currentSiteId={siteId}
        currentStatus={status}
        onTypeChange={(v) => handleFilter("docType", v)}
        onSiteChange={(v) => handleFilter("siteId", v)}
        onStatusChange={(v) => handleFilter("status", v)}
      />
      <DocumentTable
        documents={paginated}
        total={filtered.length}
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  )
}
