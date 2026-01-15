"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Search,
  FileText,
  Github,
  ExternalLink,
  Plug,
  Server
} from "lucide-react"
import { navItems, navGroups, NavItem } from "@/content/nav"

interface AppShellProps {
  children: React.ReactNode
}

function SidebarLink({ item, isActive }: { item: NavItem, isActive: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 relative group",
        isActive 
          ? "bg-[#00ff41]/10 text-[#00ff41] font-medium border border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.3)]" 
          : "text-[#8b949e] hover:text-[#00ff41] hover:bg-[#00ff41]/5 border border-transparent hover:border-[#00ff41]/20 hover:shadow-[0_0_10px_rgba(0,255,65,0.2)]"
      )}
    >
      {Icon && <Icon className={cn(
        "h-4 w-4 transition-all duration-300",
        isActive ? "text-[#00ff41]" : "group-hover:text-[#00ff41]"
      )} />}
      <span className="flex-1 font-mono">{item.title}</span>
      {isActive && (
        <div className="h-2 w-2 rounded-full bg-[#00ff41] animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
      )}
    </Link>
  )
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<NavItem[]>([])
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)

  // Handle search
  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = navItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.href.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-[#00ff41]/20 glass-strong lg:flex">
        <Link href="/" className="flex h-16 items-center border-b border-[#00ff41]/20 px-6 hover:bg-[#00ff41]/5 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff41]/20 to-[#00d9ff]/20 border border-[#00ff41]/30 group-hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-300">
              <FileText className="h-5 w-5 text-[#00ff41] group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-[#00ff41] text-shimmer">Meta Tracking Lab</h1>
              <p className="text-[10px] text-[#8b949e] font-mono">Debug & Validate Events</p>
            </div>
          </div>
        </Link>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className={cn(
                    "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-300",
                    isSearchFocused ? "text-[#00ff41]" : "text-[#8b949e]"
                  )} />
                  <Input
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className={cn(
                      "pl-9 font-mono text-sm border-[#00ff41]/20 bg-[#0d1117] focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/30 transition-all duration-300",
                      isSearchFocused && "shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                    )}
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass-strong border border-[#00ff41]/20 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                      {searchResults.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setSearchQuery("")
                              setSearchResults([])
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#00ff41]/10 border-b border-[#00ff41]/10 last:border-0 transition-colors"
                          >
                            {Icon && <Icon className="h-4 w-4 text-[#00ff41]" />}
                            <div className="flex-1">
                              <p className="text-sm font-mono text-[#e8f4f8]">{item.title}</p>
                              <p className="text-xs text-[#8b949e]">{item.group}</p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {(searchResults.length > 0 ? 
                navGroups.filter(group => searchResults.some(item => item.group === group)) : 
                navGroups
              ).map((group) => (
                <div key={group} className="mb-6">
                  <p className="mb-2 px-3 text-xs font-mono font-semibold uppercase tracking-wider text-[#8b949e]">
                    {group}
                  </p>
                  <div className="space-y-1">
                    {navItems
                      .filter((item) => 
                        item.group === group && 
                        (searchResults.length === 0 || searchResults.includes(item))
                      )
                      .map((item) => (
                        <SidebarLink
                          key={item.href}
                          item={item}
                          isActive={pathname === item.href}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t border-[#00ff41]/20 glass p-4">
          <p className="text-xs text-[#8b949e] font-mono">
            <span className="text-[#00ff41]">●</span> Interactive Meta tracking guide
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-[#00ff41]/20 glass-strong px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden shadow-[0_4px_20px_rgba(0,255,65,0.1)]">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-[#00ff41]/10 hover:text-[#00ff41]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 glass-strong border-[#00ff41]/20">
            <Link href="/" className="flex h-16 items-center border-b border-[#00ff41]/20 px-6 hover:bg-[#00ff41]/5 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff41]/20 to-[#00d9ff]/20 border border-[#00ff41]/30">
                  <FileText className="h-4 w-4 text-[#00ff41]" />
                </div>
                <div>
                  <h1 className="font-mono font-bold text-[#00ff41]">Meta Tracking Lab</h1>
                  <p className="text-[10px] text-[#8b949e] font-mono">Debug & Validate Events</p>
                </div>
              </div>
            </Link>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="space-y-1 p-4">
                {navGroups.map((group) => (
                  <div key={group} className="mb-6">
                    <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group}
                    </p>
                    <div className="space-y-0.5">
                      {navItems
                        .filter((item) => item.group === group)
                        .map((item) => (
                          <SidebarLink
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff41]/20 to-[#00d9ff]/20 border border-[#00ff41]/30">
            <FileText className="h-4 w-4 text-[#00ff41]" />
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold text-[#00ff41]">Meta Tracking Lab</h1>
            <p className="text-[10px] text-[#8b949e] font-mono">Debug & Validate Events</p>
          </div>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="lg:pl-72">
        {/* Desktop Header */}
        <div className="hidden h-16 items-center justify-between border-b border-[#00ff41]/20 glass-strong px-6 lg:flex shadow-[0_4px_20px_rgba(0,255,65,0.1)] relative overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/0 via-[#00ff41]/5 to-[#00ff41]/0 animate-pulse-slow opacity-50"></div>
          
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group relative z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff41]/20 to-[#00d9ff]/20 border border-[#00ff41]/30 group-hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all duration-300 group-hover:scale-110">
              <FileText className="h-5 w-5 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="font-mono font-bold text-[#00ff41] text-shimmer">Meta Tracking Lab</h1>
              <p className="text-[10px] text-[#8b949e] font-mono">Debug & Validate Events</p>
            </div>
          </Link>

          <div className="flex items-center gap-3 relative z-10">
            <Badge variant="outline" className="text-xs font-mono border-[#00ff41]/30 text-[#00ff41] bg-[#00ff41]/5">
              v0.1.0
            </Badge>
            <Separator orientation="vertical" className="h-6 bg-[#00ff41]/20" />
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-[#00ff41]/10 hover:text-[#00ff41] font-mono transition-all duration-300" asChild>
              <Link href="/connect">
                <Plug className="h-4 w-4" />
                <span>Connect</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-[#00d9ff]/10 hover:text-[#00d9ff] font-mono transition-all duration-300" asChild>
              <Link href="/capi-test">
                <Server className="h-4 w-4" />
                <span>CAPI Test</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-[#00ff41]/10 hover:text-[#00ff41] font-mono transition-all duration-300" asChild>
              <a href="https://github.com/vampxlr/meta-tracking-lab" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
