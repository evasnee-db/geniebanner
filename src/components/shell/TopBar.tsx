"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DbIcon } from "@/components/ui/db-icon"
import {
  SidebarOpenIcon,
  SidebarClosedIcon,
  GenieCodeIcon,
  SearchIcon,
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

      {/* Center: search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center px-4">
        <div className="relative flex w-full max-w-[500px] items-center">
          <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            className="h-8 rounded bg-background border-border pl-9 pr-14 text-xs placeholder:text-muted-foreground"
            placeholder="Search data, notebooks, recents, and more..."
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-muted-foreground">
            <span>⌘</span>
            <span>P</span>
          </kbd>
        </div>
      </div>

      {/* Spacer on mobile so right section stays right-aligned */}
      <div className="flex-1 md:hidden" />

      {/* Right: workspace selector + icon buttons + avatar */}
      {/* Figma: gap-1 (4px) between items */}
      <div className="flex items-center gap-1">
        {/* Figma: h-32px, px-12px, gap-4px, text-13px regular, chevron-16px */}
        <Button variant="ghost" size="sm" className="hidden md:flex gap-1 px-3">
          <span className="text-sm">{workspace}</span>
          <ChevronDownIcon size={16} className="text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Open Genie Code"
          onClick={onToggleGenie}
          className={cn(genieOpen && "bg-muted")}
        >
          <DbIcon icon={GenieCodeIcon} color="ai" size={16} />
        </Button>

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
