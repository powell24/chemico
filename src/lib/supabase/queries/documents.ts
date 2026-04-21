import { createClient } from "@/lib/supabase/server"
import { withCache, CACHE_KEYS, TTL } from "@/lib/cache/redis"

export type Document = {
  id: string
  filename: string
  doc_type: "sds" | "msds" | "regulation" | "audit" | "training"
  status: "active" | "processing" | "archived"
  storage_path: string | null
  page_count: number | null
  created_at: string
  updated_at: string
  site: { id: string; name: string; city: string; state: string } | null
}

export type DocumentFilters = {
  doc_type?: string
  site_id?: string
  status?: string
  page?: number
  pageSize?: number
}

export type PaginatedDocuments = {
  data: Document[]
  total: number
  page: number
  totalPages: number
}

export async function getDocuments({
  doc_type,
  site_id,
  status,
  page = 1,
  pageSize = 12,
}: DocumentFilters = {}): Promise<PaginatedDocuments> {
  const supabase = await createClient()
  const offset = (page - 1) * pageSize

  let query = supabase
    .from("documents")
    .select("id, filename, doc_type, status, storage_path, page_count, created_at, updated_at, sites(id, name, city, state)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (doc_type) query = query.eq("doc_type", doc_type)
  if (site_id) query = query.eq("site_id", site_id)
  if (status) query = query.eq("status", status)

  const { data, count } = await query

  const documents = (data ?? []).map((d) => ({
    ...d,
    doc_type: d.doc_type as Document["doc_type"],
    status: d.status as Document["status"],
    site: Array.isArray(d.sites)
      ? (d.sites[0] as Document["site"] | undefined) ?? null
      : (d.sites as unknown as Document["site"]) ?? null,
  }))

  const total = count ?? 0
  return { data: documents, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function getDocumentList(): Promise<{ filename: string; doc_type: string; status: string; site: string | null }[]> {
  return withCache(CACHE_KEYS.documentList, TTL.documents, async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("documents")
      .select("filename, doc_type, status, sites(name)")
      .order("filename", { ascending: true })

    return (data ?? []).map((d) => ({
      filename: d.filename,
      doc_type: d.doc_type,
      status:   d.status,
      site: Array.isArray(d.sites) ? (d.sites[0] as { name: string } | undefined)?.name ?? null : (d.sites as { name: string } | null)?.name ?? null,
    }))
  })
}

export async function getSitesForFilter(): Promise<{ id: string; name: string }[]> {
  return withCache(CACHE_KEYS.sitesForFilter, TTL.documents, async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("sites")
      .select("id, name")
      .order("name", { ascending: true })
    return data ?? []
  })
}

export type DocumentCounts = {
  byType: Record<string, number>
  bySite: Record<string, number>
  byStatus: Record<string, number>
}

export async function getDocumentCounts(): Promise<DocumentCounts> {
  return withCache(CACHE_KEYS.documentCounts, TTL.documents, async () => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("documents")
      .select("doc_type, site_id, status")

    const byType:   Record<string, number> = {}
    const bySite:   Record<string, number> = {}
    const byStatus: Record<string, number> = {}

    for (const row of data ?? []) {
      byType[row.doc_type]  = (byType[row.doc_type]  ?? 0) + 1
      if (row.site_id) bySite[row.site_id] = (bySite[row.site_id] ?? 0) + 1
      byStatus[row.status]  = (byStatus[row.status]  ?? 0) + 1
    }

    return { byType, bySite, byStatus }
  })
}
