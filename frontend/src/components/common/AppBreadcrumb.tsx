import React from 'react'
import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbItemProps {
  label: string
  to?: string
}

interface AppBreadcrumbProps {
  items: BreadcrumbItemProps[]
  className?: string
}

export default function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-xs sm:text-sm">
        {/* Prepend Home Page as default */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Trang chủ</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || !item.to ? (
                  <BreadcrumbPage className="font-medium text-foreground truncate max-w-xs sm:max-w-md">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.to} className="transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
