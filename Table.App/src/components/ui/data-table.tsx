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
import { useRef, useState, useEffect } from "react";
import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    columnResizeMode: "onChange",
    enableColumnResizing: true,
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const updateWidth = () => {
      setContainerWidth(parent.offsetWidth - 20);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(parent);

    return () => observer.disconnect();
  }, []);

  const totalDefinedWidth = table
    .getAllColumns()
    .reduce((sum, column) => sum + column.getSize(), 0);
  const columnsWithAdjustedWidths = table.getAllColumns().map((column) => ({
    ...column,
    getSize: () => {
      if (containerWidth <= 0) return column.getSize();
      const scaleFactor = containerWidth / totalDefinedWidth;
      return column.getSize() * scaleFactor;
    },
  }));

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-md border">
      <div
        ref={parentRef}
        className="max-h-[600px] overflow-auto scrollbar-gutter-stable"
        style={{
          position: "relative",
        }}
      >
        <Table
          style={{
            tableLayout: "fixed",
            width: containerWidth || "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <TableHeader
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              background: "white",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const adjustedColumn = columnsWithAdjustedWidths.find(
                    (col) => col.id === header.column.id
                  );
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: adjustedColumn?.getSize() || header.getSize(),
                        boxSizing: "border-box",
                      }}
                      className="group relative"
                      data-column-id={header.column.id}
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
                        {header.column.getCanSort() && (
                          <span className="ml-2 text-sm">
                            {{
                              asc: <MoveUp className="w-4 h-4" />,
                              desc: <MoveDown className="w-4 h-4" />,
                              false: <MoveVertical className="w-4 h-4" />,
                            }[header.column.getIsSorted() as string] ?? null}
                          </span>
                        )}
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-1/2 h-1/2 w-1 bg-gray-500 cursor-col-resize select-none -translate-y-1/2"
                          style={{ opacity: 0.5 }}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {/* Body */}
          <TableBody
            style={{
              height: `${totalSize}px`,
              position: "relative",
            }}
          >
            {virtualItems.length ? (
              virtualItems.map((virtualRow: VirtualItem) => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                      width: "100%",
                      display: "table-row",
                      boxSizing: "border-box",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const adjustedColumn = columnsWithAdjustedWidths.find(
                        (col) => col.id === cell.column.id
                      );
                      return (
                        <TableCell
                          key={cell.id}
                          className="truncate px-2"
                          style={{
                            width:
                              adjustedColumn?.getSize() ||
                              cell.column.getSize(),
                            boxSizing: "border-box",
                            display: "table-cell",
                          }}
                          data-column-id={cell.column.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
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
    </div>
  );
}
