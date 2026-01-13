import { 
  BookOpen, 
  Settings, 
  AlertTriangle, 
  AlertCircle, 
  ShoppingCart, 
  Activity,
  Lock,
  Search,
  FileCode,
  Database,
  ShieldCheck,
  Eye,
  RefreshCw,
  Tag,
  Layers,
  Cookie,
  Globe,
  CheckCircle,
  Layout,
  Server
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon?: any
  group: string
}

export const navItems: NavItem[] = [
  // Getting Started
  {
    title: "Overview",
    href: "/",
    icon: BookOpen,
    group: "Getting Started",
  },
  {
    title: "Setup Checklist",
    href: "/getting-started/setup-checklist",
    icon: CheckCircle,
    group: "Getting Started",
  },
  {
    title: "Demo Controls",
    href: "/getting-started/demo-controls",
    icon: Layout,
    group: "Getting Started",
  },

  // Core Problems
  {
    title: "Missing Events",
    href: "/problems/missing-events",
    icon: Eye,
    group: "Core Problems",
  },
  {
    title: "Duplicate Events",
    href: "/problems/duplicate-events",
    icon: Layers,
    group: "Core Problems",
  },
  {
    title: "Purchase Mismatch",
    href: "/problems/purchase-mismatch",
    icon: ShoppingCart,
    group: "Core Problems",
  },
  {
    title: "Low Match Quality",
    href: "/problems/low-match-quality",
    icon: Activity,
    group: "Core Problems",
  },
  {
    title: "Wrong Parameters",
    href: "/problems/wrong-parameters",
    icon: Tag,
    group: "Core Problems",
  },
  {
    title: "Event Order",
    href: "/problems/event-order",
    icon: RefreshCw,
    group: "Core Problems",
  },
  {
    title: "Missing Event ID",
    href: "/problems/missing-event-id",
    icon: FileCode,
    group: "Core Problems",
  },
  {
    title: "Dedup Misconfigured",
    href: "/problems/dedup-misconfigured",
    icon: Database,
    group: "Core Problems",
  },
  {
    title: "Cookie FBP Issues",
    href: "/problems/cookie-fbp-issues",
    icon: Cookie,
    group: "Core Problems",
  },
  {
    title: "AEM Domain Issues",
    href: "/problems/aem-domain-issues",
    icon: Globe,
    group: "Core Problems",
  },
  {
    title: "Testing & Debugging",
    href: "/problems/testing-debugging",
    icon: Search,
    group: "Core Problems",
  },
  {
    title: "CAPI Setup",
    href: "/problems/capi-setup",
    icon: Server,
    group: "Core Problems",
  },

  // Server-Side & Reliability
  {
    title: "First-Party Endpoint",
    href: "/server/first-party-endpoint",
    icon: Server,
    group: "Server-Side & Reliability",
  },
  {
    title: "Retry Queue",
    href: "/server/retry-queue",
    icon: RefreshCw,
    group: "Server-Side & Reliability",
  },
  {
    title: "Schema Guardrails",
    href: "/server/schema-guardrails",
    icon: ShieldCheck,
    group: "Server-Side & Reliability",
  },
  {
    title: "Security & Privacy",
    href: "/server/security-privacy",
    icon: Lock,
    group: "Server-Side & Reliability",
  },
]

export const navGroups = Array.from(new Set(navItems.map(item => item.group)))
