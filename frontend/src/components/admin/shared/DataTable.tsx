import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface Column<T> {
  header: string
  accessor?: keyof T | ((row: T) => string | number)
  sortable?: boolean
  headerClassName?: string
  render: (row: T, index: number) => ReactNode
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  rowClassName?: (row: T) => string
  onRowClick?: (row: T) => void
  selectedKeys?: Set<string>
  onSelectionChange?: (keys: Set<string>) => void
  isLoading?: boolean
  loadingRows?: number
  emptyMessage?: string
  emptyAction?: ReactNode
  className?: string
}

function SelectedCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="size-4 accent-primary"
    />
  )
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  rowClassName,
  onRowClick,
  selectedKeys,
  onSelectionChange,
  isLoading,
  loadingRows = 5,
  emptyMessage = 'Không có dữ liệu',
  emptyAction,
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<number | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const hasSelection = !!onSelectionChange
  const allSelected =
    hasSelection && data.length > 0 && data.every((r) => selectedKeys?.has(keyExtractor(r)))

  const handleSort = (colIndex: number) => {
    const col = columns[colIndex]
    if (!col.sortable) return
    if (sortColumn === colIndex) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(colIndex)
      setSortDirection('asc')
    }
  }

  const sortedData = useMemo(() => {
    if (sortColumn === null) return data
    const col = columns[sortColumn]
    if (!col.accessor) return data

    return [...data].sort((a, b) => {
      const aVal =
        typeof col.accessor === 'function'
          ? col.accessor(a)
          : (a[col.accessor as keyof T] as string | number)
      const bVal =
        typeof col.accessor === 'function'
          ? col.accessor(b)
          : (b[col.accessor as keyof T] as string | number)

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortDirection, columns])

  const SortIcon = ({ colIndex }: { colIndex: number }) => {
    if (sortColumn !== colIndex) return <ChevronsUpDown size={14} className="ml-1 opacity-40" />
    return sortDirection === 'asc' ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    )
  }

  const toggleAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(data.map((r) => keyExtractor(r))))
    }
  }

  const toggleRow = (key: string) => {
    if (!onSelectionChange || !selectedKeys) return
    const next = new Set(selectedKeys)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(next)
  }

  return (
    <div className={cn('w-full rounded-lg border border-border', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {hasSelection && (
              <TableHead className="w-10 px-4">
                <SelectedCheckbox checked={allSelected} onChange={toggleAll} />
              </TableHead>
            )}
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={cn(
                  'px-4',
                  col.sortable && 'cursor-pointer select-none',
                  col.headerClassName,
                )}
                onClick={() => handleSort(i)}
              >
                <span className="inline-flex items-center">
                  {col.header}
                  {col.sortable && <SortIcon colIndex={i} />}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {hasSelection && (
                    <TableCell className="px-4">
                      <Skeleton className="size-4 rounded" />
                    </TableCell>
                  )}
                  {columns.map((_, ci) => (
                    <TableCell key={ci} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : sortedData.length === 0
              ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (hasSelection ? 1 : 0)}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-muted-foreground">{emptyMessage}</p>
                      {emptyAction}
                    </div>
                  </TableCell>
                </TableRow>
              )
              : sortedData.map((row, index) => {
                  const key = keyExtractor(row)
                  return (
                    <TableRow
                      key={key}
                      className={cn(
                        onRowClick && 'cursor-pointer',
                        rowClassName?.(row),
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {hasSelection && (
                        <TableCell className="px-4">
                          <SelectedCheckbox
                            checked={selectedKeys?.has(key) ?? false}
                            onChange={() => toggleRow(key)}
                          />
                        </TableCell>
                      )}
                      {columns.map((col, ci) => (
                        <TableCell key={ci} className={cn('px-4 py-3', col.cellClassName)}>
                          {col.render(row, index)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
        </TableBody>
      </Table>
    </div>
  )
}
