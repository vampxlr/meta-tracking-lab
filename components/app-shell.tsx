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
  Plug
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
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        isActive 
          ? "bg-accent text-accent-foreground font-medium" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{item.title}</span>
      {isActive && (
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </Link>
  )
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Meta Tracking Lab</h1>
              <p className="text-[10px] text-muted-foreground">Debug & Validate Events</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-4">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search docs..."
                    className="pl-9"
                  />
                </div>
              </div>

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
        </div>

        <div className="border-t bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">
            Interactive tracking documentation for developers
          </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">Meta Tracking Lab</h1>
                  <p className="text-[10px] text-muted-foreground">Debug & Validate Events</p>
                </div>
              </div>
            </div>
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

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Meta Tracking Lab</h1>
            <p className="text-[10px] text-muted-foreground">Debug & Validate Events</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lg:pl-72">
        {/* Desktop Header */}
        <div className="hidden h-16 items-center justify-between border-b px-6 lg:flex">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Meta Tracking Lab</h1>
              <p className="text-[10px] text-muted-foreground">Debug & Validate Events</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              v0.1.0
            </Badge>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link href="/connect">
                <Plug className="h-4 w-4" />
                <span>Connection Test</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              <span>Docs</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
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
