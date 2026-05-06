"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { PrototypeAnnotationsProvider } from "@/contexts/PrototypeAnnotationsContext"
import { DemoExperienceBarProvider, useDemoExperienceBarChrome } from "@/contexts/DemoExperienceBarContext"
import { AppSwitcherLaunchProvider } from "@/contexts/AppSwitcherLaunchContext"
import { useGcPaneBuildShellOptional } from "@/contexts/GcPaneBuildShellContext"
import { TopBar } from "./TopBar"
import { Sidebar } from "./Sidebar"
import { GenieCodePanel } from "./GenieCodePanel"
import { GenieCodeFullscreenExperience } from "./GenieCodeFullscreenExperience"
import { GenieCodeSidebarNav } from "./genie-code-sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface AppShellProps {
  activeItem?: string
  onNavigate?: (id: string) => void
  workspace?: string
  userInitial?: string
  /** Renders above the Databricks title bar (full viewport width). */
  aboveChrome?: React.ReactNode
  /** Genie chat: compact sidebar with workspace shortcuts + chat history. */
  sidebarVariant?: "default" | "genie-chat" | "genie-code"
  genieChatTitle?: string
  genieChatHomeHref?: string
  /** Genie Code fills the main column; right rail panel is hidden. */
  genieFullscreen?: boolean
  genieFullscreenInitialMessage?: string
  onGenieFullscreenClose?: () => void
  /** When `sidebarVariant="genie-code"`, which thread row is active. */
  genieCodeActiveThreadId?: string
  onGenieCodeThreadSelect?: (id: string) => void
  /** Prepended row for build-ask → Genie Code launch (optional). */
  genieCodeLaunchThreadRow?: {
    id: string
    title: string
    subtitle: string
    time: string
    plus: string
    minus: string
    files: string
    dot?: boolean
  }
  /** Thinking + answer copy for the synthetic launch thread (build-ask Code). */
  genieFullscreenLaunchNarrative?: { thinking: string; answer: string }

  /**
   * GC-pane prototype: Build from the workspace hero opens the right Genie Code rail instead of `/genie`.
   * Requires `GcPaneBuildShellProvider` above `AppShell`.
   */
  integrateGcPaneBuildSidePane?: boolean
  children: React.ReactNode
  className?: string
  mainClassName?: string
}

function AppShellInner({
  activeItem,
  onNavigate,
  workspace,
  userInitial,
  aboveChrome,
  sidebarVariant = "default",
  genieChatTitle = "New chat",
  genieChatHomeHref,
  genieFullscreen = false,
  genieFullscreenInitialMessage = "",
  onGenieFullscreenClose,
  genieCodeActiveThreadId,
  onGenieCodeThreadSelect,
  genieCodeLaunchThreadRow,
  genieFullscreenLaunchNarrative,
  integrateGcPaneBuildSidePane = false,
  children,
  className,
  mainClassName,
}: AppShellProps) {
  const gcPaneBuildCtx = useGcPaneBuildShellOptional()
  const gcPaneIntegrated = Boolean(integrateGcPaneBuildSidePane && gcPaneBuildCtx)

  const demoBar = useDemoExperienceBarChrome()
  const experienceBarVisible = Boolean(demoBar?.open && aboveChrome != null)
  const pathname = usePathname() ?? ""
  const normalizedPath = pathname.replace(/\/$/, "") || "/"
  const isOneChatShellExperience =
    normalizedPath === "/shell/onechat" || normalizedPath.startsWith("/shell/onechat/")
  const genieLauncherVisible = !genieFullscreen && !isOneChatShellExperience

  const [sidebarOpen, setSidebarOpen] = React.useState(true)   // desktop inline
  const [mobileOpen, setMobileOpen]   = React.useState(false)  // mobile sheet
  const [genieOpen, setGenieOpen] = React.useState(false) // genie code panel (non–GC-pane shells)
  const [genieCodeRailOpen, setGenieCodeRailOpen] = React.useState(true)

  const geniePanelOpen = gcPaneIntegrated ? gcPaneBuildCtx!.panelOpen : genieOpen
  const setGeniePanelOpen = React.useCallback(
    (next: boolean | ((prev: boolean) => boolean)) => {
      if (gcPaneIntegrated) {
        gcPaneBuildCtx!.setPanelOpen(next)
      } else {
        setGenieOpen(next)
      }
    },
    [gcPaneBuildCtx, gcPaneIntegrated],
  )
  const toggleGeniePanel = React.useCallback(() => {
    setGeniePanelOpen((v) => !v)
  }, [setGeniePanelOpen])

  const closeFullscreenGenie = React.useCallback(() => {
    onGenieFullscreenClose?.()
  }, [onGenieFullscreenClose])

  const toggleGenieCodeRail = React.useCallback(() => {
    setGenieCodeRailOpen((v) => !v)
  }, [])

  const dualGenieShell = genieFullscreen && sidebarVariant === "genie-code"
  const workspaceSidebarVariant =
    sidebarVariant === "genie-code" ? "default" : sidebarVariant

  return (
    <PrototypeAnnotationsProvider>
    <div className={cn("flex h-dvh flex-col overflow-hidden bg-secondary", className)}>
      {experienceBarVisible && (
        <div
          data-shell-experience-bar
          className="relative z-[110] w-full shrink-0 bg-background"
        >
          {aboveChrome}
        </div>
      )}

      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        onToggleGenie={genieFullscreen ? closeFullscreenGenie : toggleGeniePanel}
        genieLauncherVisible={genieLauncherVisible}
        genieOpen={genieFullscreen || geniePanelOpen}
        workspace={workspace}
        userInitial={userInitial}
      />

      {/* Mobile sidebar — Sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className={cn(
            "overflow-hidden border-r-0 bg-secondary p-0",
            dualGenieShell
              ? "flex w-[min(100vw,520px)] max-w-[520px] flex-col"
              : "w-[220px]",
          )}
        >
          {dualGenieShell ? (
            <>
              <div className="flex max-h-[50vh] min-h-0 shrink-0 flex-col overflow-y-auto border-b border-border">
                <Sidebar
                  open
                  activeItem={activeItem}
                  variant="default"
                  className="w-full min-w-0 max-w-none"
                  genieChatTitle={genieChatTitle}
                  genieChatHomeHref={genieChatHomeHref}
                  onNavigate={(id) => {
                    setMobileOpen(false)
                    onNavigate?.(id)
                  }}
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col border-t border-border/80">
                <GenieCodeSidebarNav
                  open={genieCodeRailOpen}
                  onToggleRail={toggleGenieCodeRail}
                  className="min-h-0 w-full max-w-none flex-1"
                  activeThreadId={genieCodeActiveThreadId}
                  launchThread={genieCodeLaunchThreadRow}
                  onSelectThread={onGenieCodeThreadSelect}
                />
              </div>
            </>
          ) : (
            <Sidebar
              open
              activeItem={activeItem}
              variant={workspaceSidebarVariant}
              genieChatTitle={genieChatTitle}
              genieChatHomeHref={genieChatHomeHref}
              onNavigate={(id) => {
                setMobileOpen(false)
                onNavigate?.(id)
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 overflow-hidden">
        {dualGenieShell ? (
          <div className="hidden h-full min-h-0 shrink-0 md:flex">
            <Sidebar
              open={sidebarOpen}
              activeItem={activeItem}
              variant="default"
              className="border-r border-border/80"
              genieChatTitle={genieChatTitle}
              genieChatHomeHref={genieChatHomeHref}
              onNavigate={onNavigate}
            />
            <GenieCodeSidebarNav
              open={genieCodeRailOpen}
              onToggleRail={toggleGenieCodeRail}
              activeThreadId={genieCodeActiveThreadId}
              launchThread={genieCodeLaunchThreadRow}
              onSelectThread={onGenieCodeThreadSelect}
            />
          </div>
        ) : (
          <div className="hidden md:contents">
            <Sidebar
              open={sidebarOpen}
              activeItem={activeItem}
              variant={workspaceSidebarVariant}
              genieChatTitle={genieChatTitle}
              genieChatHomeHref={genieChatHomeHref}
              onNavigate={onNavigate}
            />
          </div>
        )}

        <main
          className={cn(
            genieFullscreen
              ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
              : "flex-1 overflow-y-auto rounded-md border border-border bg-background mb-2",
            !genieFullscreen && geniePanelOpen ? "mr-1" : !genieFullscreen && "mr-2",
            !genieFullscreen && !sidebarOpen && "ml-2",
            mainClassName,
          )}
        >
          {genieFullscreen ? (
            <GenieCodeFullscreenExperience
              initialMessage={genieFullscreenInitialMessage}
              onClose={closeFullscreenGenie}
              className="rounded-none border-0"
              activeThreadId={genieCodeActiveThreadId}
              launchNarrative={genieFullscreenLaunchNarrative}
            />
          ) : (
            children
          )}
        </main>

        {!genieFullscreen && geniePanelOpen && (
          <GenieCodePanel
            open={geniePanelOpen}
            onClose={() => setGeniePanelOpen(false)}
            appearance={gcPaneIntegrated ? "gc-pane" : "default"}
            pendingUserMessage={gcPaneIntegrated ? gcPaneBuildCtx!.pendingUserMessage : null}
            onPendingUserMessageConsumed={
              gcPaneIntegrated ? gcPaneBuildCtx!.consumePendingUserMessage : undefined
            }
            className={cn(
              "rounded-md border border-border mb-2 mr-2",
              gcPaneIntegrated && "shadow-[var(--shadow-db-sm)]",
            )}
          />
        )}
      </div>
    </div>
    </PrototypeAnnotationsProvider>
  )
}

export function AppShell(props: AppShellProps) {
  return (
    <DemoExperienceBarProvider>
      <AppSwitcherLaunchProvider>
        <AppShellInner {...props} />
      </AppSwitcherLaunchProvider>
    </DemoExperienceBarProvider>
  )
}
