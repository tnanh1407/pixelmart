import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const pathMap: Record<string, string> = {
  admin: "Dashboard",
  users: "Người dùng",
  products: "Sản phẩm",
  stores: "Cửa hàng",
  categories: "Danh mục",
  banners: "Banner",
}

export function SiteHeader() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`
    const parentSegment = pathnames[index - 1]
    let label = pathMap[value] || value

    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      if (parentSegment === "categories") label = "Chi tiết danh mục"
      else if (parentSegment === "banners") label = "Chi tiết banner"
      else if (parentSegment === "stores") label = "Chi tiết cửa hàng"
      else label = "Chi tiết"
    }

    return { label, to, isLast: index === pathnames.length - 1 }
  })

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.to}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {breadcrumb.isLast ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Xem trang chủ</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
