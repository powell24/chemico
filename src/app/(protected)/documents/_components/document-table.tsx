"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocumentDetailSheet } from "./document-detail-sheet"
import { PaginationControl } from "@/app/(protected)/dashboard/_components/pagination-control"
import type { Document, PaginatedDocuments } from "@/lib/supabase/queries/documents"

const TYPE_LABELS: Record<string, string> = {
  sds: "SDS", msds: "MSDS", sop: "SOP", regulation: "Regulation", regulatory: "Regulatory", audit: "Audit", training: "Training",
}

const TYPE_STYLES: Record<string, string> = {
  sds:        "bg-blue-100 text-blue-700 border-blue-200",
  msds:       "bg-indigo-100 text-indigo-700 border-indigo-200",
  sop:        "bg-cyan-100 text-cyan-700 border-cyan-200",
  regulation: "bg-purple-100 text-purple-700 border-purple-200",
  regulatory: "bg-purple-100 text-purple-700 border-purple-200",
  audit:      "bg-orange-100 text-orange-700 border-orange-200",
  training:   "bg-teal-100 text-teal-700 border-teal-200",
}

const STATUS_LABELS: Record<string, string> = {
  ready: "Ready", processing: "Processing", archived: "Archived",
}

const STATUS_STYLES: Record<string, string> = {
  ready:      "bg-green-100 text-green-700 border-green-200",
  processing: "bg-amber-100 text-amber-700 border-amber-200",
  archived:   "bg-gray-100 text-gray-600 border-gray-200",
}

interface DocumentTableProps {
  result: PaginatedDocuments
}

export function DocumentTable({ result }: DocumentTableProps) {
  const [selected, setSelected] = useState<Document | null>(null)
  const { data: documents, total, page, totalPages } = result

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="pl-6">Document</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead className="hidden lg:table-cell">Site</TableHead>
                <TableHead className="hidden lg:table-cell">Pages</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="cursor-pointer hover:bg-muted/50 text-sm"
                  onClick={() => setSelected(doc)}
                >
                  <TableCell className="pl-6">
                    <p className="font-medium truncate max-w-xs">{doc.filename}</p>
                    {doc.site && (
                      <p className="text-xs text-muted-foreground md:hidden">{doc.site.name}</p>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className={`text-xs ${TYPE_STYLES[doc.doc_type]}`}>
                      {TYPE_LABELS[doc.doc_type] ?? doc.doc_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {doc.site ? doc.site.name : <span className="italic">Company-wide</span>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                    {doc.page_count ?? "—"}
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge variant="outline" className={`text-xs ${STATUS_STYLES[doc.status]}`}>
                      {STATUS_LABELS[doc.status] ?? doc.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {documents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                    No documents found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">{total} documents</p>
              <PaginationControl page={page} totalPages={totalPages} paramKey="page" />
            </div>
          </div>
        </CardContent>
      </Card>

      <DocumentDetailSheet document={selected} onClose={() => setSelected(null)} />
    </>
  )
}
