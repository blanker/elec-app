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
import { useMenuContext } from "@/context/menu-context";

const data = {
  user: {
    name: "你好",
    email: "m@example.com",
    avatar: "/avatar.jpg",
  },

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
  const {
    currentMenu,
    setCurrentMenu,
    menus,
  } = useMenuContext();

  const main = menus ? menus.filter((item) => item.section === 'main') : [];
  const secondary = menus ? menus.filter((item) => item.section === 'secondary') : []
  const documents = menus ? menus.filter((item) => item.section === 'documents') : []

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
        <NavMain items={main} />
        <NavDocuments items={documents} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
