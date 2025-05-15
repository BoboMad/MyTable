import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { Payment } from "../types/types";
import { EditableTextCell } from "@/components/table-cell-components/editable-text";
import { EditableNumberCell } from "@/components/table-cell-components/editable-number";
import { MarkForDeleteCheckbox } from "@/components/ui/mark-for-deletion-checkbox";
import { Trash2 } from "lucide-react";
import { StatusPicker } from "@/components/table-cell-components/status-picker";
import { DatePickerCell } from "@/components/table-cell-components/date-picker-cell";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center w-full">
        <Trash2 className="w-4 h-4" />
      </div>
    ),
    cell: ({ row }) => (
      <MarkForDeleteCheckbox
        formPath="payments"
        index={row.index}
        checked={row.getIsSelected()}
      />
    ),
    minSize: 50,
    size: 50,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    minSize: 50,
    size: 50,
    cell: ({ row }) => {
      if (row.original.id < 0) {
        return <div className="min-w-[20px]" />;
      } else {
        return (
          <div className="flex items-center justify-center">
            {row.original.id}
          </div>
        );
      }
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    minSize: 100,
    size: 150,
    maxSize: 200,
    cell: ({ row }) => (
      <EditableTextCell
        defaultValue={row.original.email}
        index={row.index}
        accessorKey="email"
        rowData={row.original}
        formPath="payments"
      />
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    minSize: 100,
    size: 100,
    cell: ({ row }) => (
      <EditableNumberCell
        defaultValue={row.original.amount}
        accessorKey="amount"
        rowData={row.original}
        index={row.index}
        formPath="payments"
      />
    ),
  },
  {
    accessorKey: "statusId",
    header: "Status",
    minSize: 100,
    cell: ({ row, cell }) => (
      <StatusPicker
        index={row.index}
        defaultValue={row.original.statusId}
        accessorKey="statusId"
        formPath="payments"
      />
    ),
  },
  {
    accessorKey: "creationDate",
    header: "Created At",
    minSize: 125,
    cell: ({ row }) => {
      return (
        <DatePickerCell
          defaultValue={row.original.creationDate}
          index={row.index}
          accessorKey="creationDate"
          rowData={row.original}
          formPath="payments"
        />
      );
    },
  },
  {
    accessorKey: "expirationDate",
    header: "Expires",
    minSize: 125,
    cell: ({ row }) => {
      return (
        <DatePickerCell
          defaultValue={row.original.expirationDate}
          index={row.index}
          accessorKey="expirationDate"
          rowData={row.original}
          formPath="payments"
        />
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    minSize: 150,
    cell: ({ row }) => (
      <EditableTextCell
        defaultValue={row.original.description}
        index={row.index}
        accessorKey="description"
        rowData={row.original}
        formPath="payments"
      />
    ),
  },
];
