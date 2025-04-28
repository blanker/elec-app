import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router";
import { useMenuContext } from "@/context/menu-context";
import { useShallow } from 'zustand/react/shallow'
import useUserStore from "@/store/useUserStore"

export function NavMain({
  items
}) {
  const navigate = useNavigate();
  const {
    currentMenu,
    setCurrentMenu,
    menus,
  } = useMenuContext();
  const { user: userInfo, login, error, loading } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      login: state.login,
      error: state.error,
      loading: state.loading,
    }))
  );

  return (
    (<SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="新建..."
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
              <IconCirclePlusFilled />
              <span>新建...</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline">
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.key ?? item.title} >
              <SidebarMenuButton
                tooltip={item.title}
                className={`cursor-pointer ${currentMenu === item.key ? 'bg-primary/10 text-primary font-medium' : ''}`}
                onClick={() => {
                  if (item.url) {
                    setCurrentMenu(item.key);
                    navigate(item.url);
                  }
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>)
  );
}
