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
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getUserFromLocalStorage } from "@/lib/storage/user"

const navMain = [
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
        title: "Tour",
        url: "/dashboard/packages",
      },
      {
        title: "Rundown",
        url: "/dashboard/packages/rundown",
      },
      {
        title: "Estimasi & Pengeluaran",
        url: "/dashboard/packages/costs",
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
    title: "Tenant",
    url: "/dashboard/tenant",
    icon: Users2,
    // isActive: true,
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
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar: string
  }>({
    name: 'Guest',
    email: '',
    avatar: '/dashboard/avatars/shadcn.jpg',
  })

  React.useEffect(() => {
    const fetchUser = async () => {
      const stored = await getUserFromLocalStorage()
      if (stored) {
        setUser({
          name: stored.fullName || stored.username,
          email: stored.email ?? "",
          avatar: stored.profilePhotoUrl,
        })
      }
    }
    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
