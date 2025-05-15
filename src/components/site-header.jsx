import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

import { ModeToggle } from "./mode-toggle";
import { useMenuContext } from "@/context/menu-context";
import { useShallow } from 'zustand/react/shallow'
import useUserStore from "@/store/useUserStore"

export function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentMenu,
    setCurrentMenu,
    menus,
  } = useMenuContext();
  const { user, login, error, loading, switchTenant} = useUserStore(
    useShallow((state) => ({
      user: state.user,
      login: state.login,
      error: state.error,
      loading: state.loading,
      switchTenant: state.switchTenant,
    }))
  );

  const title = menus ? menus.find(item => item.key === currentMenu)?.title : '';
  const isHome = currentMenu === 'home';

  // 处理租户切换
  const handleTenantChange =async (tenantId) => {
    // 这里需要添加切换租户的逻辑，可能需要调用store中的方法
    console.log('切换到租户:', tenantId);
    // 假设useUserStore中有switchTenant方法
    if (await switchTenant(tenantId)) {
      // 切换成功后，可能需要重新加载数据或者更新UI
      console.log('租户切换成功', location);
      // location.reload();
      // 刷新当前页面
      window.location.reload();
    }
  };
// 添加全局loading遮罩层组件
const LoadingOverlay = () => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      style={{ pointerEvents: 'all' }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};



  return (
    <>
    {loading && <LoadingOverlay />}
    <header
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
              {user?.tenants?.length > 1 ?
               (<>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      {user?.tenant?.name || '选择租户'}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user?.tenants?.map((tenant) => (
                      <DropdownMenuItem 
                        key={tenant.tenant_id}
                        className={tenant.tenant_id === user?.tenant?.tenant_id ? "bg-muted" : ""}
                        onClick={() => handleTenantChange(tenant.tenant_id)}
                      >
                        {tenant.tenant_name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
               </>)
               :
               (<Badge variant="outline">{user?.tenant?.name ?? ''}</Badge>)
              }
          <ModeToggle />
        </div>
      </div>
    </header>
    </>
  );
}
