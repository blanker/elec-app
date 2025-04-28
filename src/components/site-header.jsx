import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"

import { ModeToggle } from "./mode-toggle";
import { useMenuContext } from "@/context/menu-context";
import { useShallow } from 'zustand/react/shallow'
import useUserStore from "@/store/useUserStore"

export function SiteHeader() {
  const navigate = useNavigate();
  const {
    currentMenu,
    setCurrentMenu,
    menus,
  } = useMenuContext();
  const { user, login, error, loading } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      login: state.login,
      error: state.error,
      loading: state.loading,
    }))
  );

  const title = menus ? menus.find(item => item.key === currentMenu)?.title : '';
  const isHome = currentMenu === 'home';

  return (
    (<header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => {
                  if (isHome) {
                    return;
                  }
                  setCurrentMenu('home');
                  navigate('/');
                }}>
                  首页
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isHome && <BreadcrumbSeparator />}
              {!isHome && <BreadcrumbItem>
                {title}
              </BreadcrumbItem>
              }
            </BreadcrumbList>
          </Breadcrumb>
        </h1>
        <div className="ml-auto flex items-center gap-2 cursor-pointer">
          <Badge variant="outline">{user?.tenant?.name ?? ''}</Badge>
          <ModeToggle />
        </div>
      </div>
    </header>)
  );
}
