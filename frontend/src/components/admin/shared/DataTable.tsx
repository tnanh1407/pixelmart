import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ReactNode } from 'react'

export interface Column<T> {
  header: string
  headerClassName?: string
  render: (row: T, index: number) => ReactNode
  cellClassName?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  rowClassName?: (row: T) => string
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.headerClassName ?? 'px-6'}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={keyExtractor(row)}
              className={rowClassName?.(row)}
            >
              {columns.map((col, ci) => (
                <TableCell
                  key={ci}
                  className={col.cellClassName ?? 'px-6 py-4'}
                >
                  {col.render(row, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
