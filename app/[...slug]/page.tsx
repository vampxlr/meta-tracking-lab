import { notFound } from "next/navigation"
import { PageContent } from "@/components/page-content"
import { pagesRegistry } from "@/content/pages-registry"

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

// Force dynamic rendering to avoid static generation issues with client components
export const dynamic = "force-dynamic"

export default async function DynamicPage({ params }: PageProps) {
  // Build the path from the slug array
  const { slug } = await params
  const path = "/" + slug.join("/")
  
  // Look up the page in the registry
  const pageData = pagesRegistry[path]

  // If page not found, return 404
  if (!pageData) {
    notFound()
  }

  return <PageContent pageData={pageData} />
}
