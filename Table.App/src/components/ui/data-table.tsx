import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { MoveDown, MoveUp, MoveVertical } from "lucide-react";
import { useState } from "react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  return (
    <div className="rounded-md border">
      <Table>
        {/* Header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="group relative"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: <MoveUp className="w-4 h-4" />,
                      desc: <MoveDown className="w-4 h-4" />,
                      false: <MoveVertical className="w-4 h-4" />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>

                  {header.column.getCanResize() && (
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className:
                          "absolute top-0 right-0 h-3/4 w-1 bg-gray-500 cursor-col-resize select-none",
                        style: {
                          opacity: 0.5,
                        },
                      }}
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {/* Body */}
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
