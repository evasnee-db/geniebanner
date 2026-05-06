"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { DbIcon } from "@/components/ui/db-icon"
import {
  SidebarOpenIcon,
  SidebarClosedIcon,
  GenieCodeIcon,
  ChevronDownIcon,
  MenuIcon,
} from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { DatabricksLogo } from "./DatabricksLogo"
import { AppSwitcher } from "./AppSwitcher"

interface TopBarProps {
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
  onMobileMenuToggle?: () => void
  onToggleGenie?: () => void
  /** Show sparkle to open Genie Code — hidden on fullscreen Genie and OneChat shell routes (`AppShell`). */
  genieLauncherVisible?: boolean
  genieOpen?: boolean
  workspace?: string
  userInitial?: string
  className?: string
}

export function TopBar({
  sidebarOpen = true,
  onToggleSidebar,
  onMobileMenuToggle,
  onToggleGenie,
  genieLauncherVisible = true,
  genieOpen = false,
  workspace = "Production",
  userInitial = "N",
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-2 bg-secondary px-3",
        className
      )}
    >
      {/* Left: toggle + logo */}
      <div className="flex items-center gap-2">
        {/* Mobile: hamburger opens Sheet */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onMobileMenuToggle}
          aria-label="Open menu"
        >
          <MenuIcon size={16} className="text-muted-foreground" />
        </Button>
        {/* Desktop: collapse/expand — SidebarOpenIcon when open, SidebarExpandIcon when closed */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden md:flex"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen
            ? <SidebarOpenIcon className="h-4 w-4 text-muted-foreground" />
            : <SidebarClosedIcon className="h-4 w-4 text-muted-foreground" />
          }
        </Button>
        <Link href="/shell" prefetch={false}>
          <DatabricksLogo height={18} />
        </Link>
      </div>

      {/* Spacer so workspace / avatar stay right-aligned */}
      <div className="min-w-0 flex-1" aria-hidden />

      {/* Right: workspace selector + icon buttons + avatar */}
      {/* Figma: gap-1 (4px) between items */}
      <div className="flex items-center gap-1">
        {/* Figma: h-32px, px-12px, gap-4px, text-13px regular, chevron-16px */}
        <Button variant="ghost" size="sm" className="hidden md:flex gap-1 px-3">
          <span className="text-sm">{workspace}</span>
          <ChevronDownIcon size={16} className="text-muted-foreground" />
        </Button>

        {genieLauncherVisible ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Open Genie Code"
            onClick={onToggleGenie}
            className={cn(genieOpen && "bg-muted")}
          >
            <DbIcon icon={GenieCodeIcon} color="ai" size={16} />
          </Button>
        ) : null}

        <AppSwitcher />

        {/* Figma: 32px circle, bg-primary, text-white */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="ml-1 rounded-full bg-primary text-xs font-semibold text-primary-foreground hover:bg-blue-700 hover:text-primary-foreground"
          aria-label="User menu"
        >
          {userInitial}
        </Button>
      </div>
    </header>
  )
}
