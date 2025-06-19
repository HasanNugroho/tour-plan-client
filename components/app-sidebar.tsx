"use client"

import * as React from "react"
import {
  AudioWaveform,
  Building2,
  ClipboardList,
  Command,
  FileText,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  Package,
  PieChart,
  ReceiptText,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/dashboard/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Paket Tour",
      url: "/dashboard/packages",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "Daftar Paket",
          url: "/dashboard/packages",
        },
        {
          title: "Buat Paket Baru",
          url: "/dashboard/packages/create",
        },
      ],
    },
    {
      title: "Tour Riil",
      url: "/dashboard/tours",
      icon: Map,
      items: [
        {
          title: "Daftar Tour",
          url: "/dashboard/tours",
        },
        {
          title: "Buat Tour dari Template",
          url: "/dashboard/tours/create",
        },
      ],
    },
    {
      title: "Mitra / Vendor",
      url: "/dashboard/partners",
      icon: Building2,
      items: [
        {
          title: "Daftar Mitra",
          url: "/dashboard/partners",
        },
        {
          title: "Tambah Mitra",
          url: "/dashboard/partners/create",
        },
      ],
    },
    {
      title: "Rundown",
      url: "/dashboard/rundown",
      icon: ClipboardList,
      items: [
        {
          title: "Rundown Paket",
          url: "/dashboard/packages/rundown",
        },
        {
          title: "Rundown Tour",
          url: "/dashboard/tours/rundown",
        },
      ],
    },
    {
      title: "Estimasi & Pengeluaran",
      url: "/dashboard/costs",
      icon: ReceiptText,
      items: [
        {
          title: "Estimasi Biaya",
          url: "/dashboard/packages/costs",
        },
        {
          title: "Pengeluaran Riil",
          url: "/dashboard/tours/expenses",
        },
      ],
    },
    {
      title: "Laporan",
      url: "/dashboard/reports",
      icon: FileText,
      items: [
        {
          title: "Export PDF",
          url: "/dashboard/reports/export",
        },
        {
          title: "Perbandingan Biaya",
          url: "/dashboard/reports/compare",
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Akun & Tim",
          url: "/dashboard/settings/team",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
