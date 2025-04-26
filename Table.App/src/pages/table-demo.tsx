import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Payment } from "./types/types";
import { columns } from "./columns/table-demo-columns";
import { Checkbox } from "@/components/ui/checkbox";

const mockData: Payment[] = [
  {
    id: "1",
    amount: 100,
    status: "pending",
    email: "john@example.com",
    createdAt: new Date("2024-01-01"),
    description: "Monthly subscription",
  },
  {
    id: "2",
    amount: 200,
    status: "processing",
    email: "sarah@example.com",
    createdAt: new Date("2024-01-02"),
    description: "Annual plan",
  },
  {
    id: "3",
    amount: 300,
    status: "success",
    email: "mike@example.com",
    createdAt: new Date("2024-01-03"),
    description: "Enterprise package",
  },
  {
    id: "4",
    amount: 150,
    status: "failed",
    email: "lisa@example.com",
    createdAt: new Date("2024-01-04"),
    description: "Premium features",
  },
  {
    id: "5",
    amount: 250,
    status: "success",
    email: "david@example.com",
    createdAt: new Date("2024-01-05"),
    description: "Business plan",
  },
];

export function TableDemo() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments Table</h1>
      <DataTable columns={columns} data={mockData} />

      <Checkbox />
    </div>
  );
}
