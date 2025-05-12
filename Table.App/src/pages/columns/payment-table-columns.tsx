import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { Payment } from "../types/types";

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
  },
  {
    accessorKey: "email",
    header: "Email",
    minSize: 100,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    minSize: 100,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    minSize: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"];
      return (
        <div>
          <Badge
            className="min-w-24"
            variant={
              status === "success"
                ? "success"
                : status === "processing"
                ? "warning"
                : status === "pending"
                ? "outline"
                : "destructive"
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    minSize: 125,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return <div>{format(date, "PPP")}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    minSize: 175,
  },
];
