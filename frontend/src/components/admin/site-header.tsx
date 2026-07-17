import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  adminPathLabels,
  adminDetailLabels,
  adminDetailParentSegments,
} from "@/config/admin-routes"

export function SiteHeader() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  const breadcrumbs = pathnames.map((value, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`
    const parentSegment = pathnames[index - 1]

    let label: string
    if (adminDetailParentSegments.has(parentSegment)) {
      label = adminDetailLabels[parentSegment] || "Chi tiết"
    } else {
      label = adminPathLabels[value] || value
    }

    return { label, to, isLast: index === pathnames.length - 1 }
  })

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb >
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
      </div>
    </header>
  )
}
