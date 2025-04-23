import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useShallow } from 'zustand/react/shallow'
import useUserStore from "@/store/useUserStore"

const data = {
  user: {
    name: "你好",
    email: "m@example.com",
    avatar: "/avatar.jpg",
  },
  navMain: [
    {
      key: 'home',
      title: "首页",
      url: "/",
      icon: IconDashboard,
    },
    {
      key: 'declaration', // isActiv
      title: "需求响应申报",
      url: "/declaration",
      icon: IconListDetails,
    },
    {
      key: 'response',
      title: "响应评估结果公示",
      url: "/response",
      icon: IconChartBar,
    },
    {
      key: 'report',
      title: "待推出...",
      url: "#",
      icon: IconFolder,
    },
    {
      key: 'accounts',
      title: "商户列表",
      url: "/accounts",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      key: 'setting',
      title: "设置",
      url: "#",
      icon: IconSettings,
    },
    {
      key: 'help',
      title: "获取帮助",
      url: "#",
      icon: IconHelp,
    },
    {
      key: 'search',
      title: "搜索",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      key: 'database',
      name: "待推出...",
      url: "#",
      icon: IconDatabase,
    },
    {
      key: 'report',
      name: "待推出...",
      url: "#",
      icon: IconReport,
    },
    {
      key: 'word',
      name: "待推出...",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { user: userInfo, login, error, loading } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      login: state.login,
      error: state.error,
      loading: state.loading,
    }))
  );

  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">电</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
