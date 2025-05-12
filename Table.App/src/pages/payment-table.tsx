import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Payment } from "./types/types";
import { columns } from "./columns/payment-table-columns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";

// Generate 10,000 mock payments
const generateMockPayments = (count: number): Payment[] => {
  const statuses: Payment["status"][] = [
    "pending",
    "processing",
    "success",
    "failed",
  ];
  const descriptions = [
    "Monthly subscription",
    "Annual plan",
    "Enterprise package",
    "Premium features",
    "Business plan",
    "One-time purchase",
    "Trial extension",
    "Custom solution",
  ];
  const domains = ["example.com", "test.com", "demo.org", "sample.net"];

  return Array.from({ length: count }, (_, index) => {
    const id = `${index + 1}`;
    const amount = Math.floor(Math.random() * 951) + 50; // 50 to 1000
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const email = `user${Math.floor(Math.random() * 1000)}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`;
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    );
    const description =
      descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
      id,
      amount,
      status,
      email,
      createdAt,
      description,
    };
  });
};

const mockData: Payment[] = generateMockPayments(10000);

export function PaymentTable() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments Table</h1>
      <div className="flex gap-2">
        <Button className="mb-4">Add Payment</Button>
        <Button className="mb-4">Remove</Button>
        <Button className="mb-4">Save</Button>
      </div>
      <Combobox
        options={[
          { label: "Hej", value: 1 },
          { label: "Hej2", value: 2 },
          { label: "Hej3", value: 3 },
        ]}
      />
      <DataTable columns={columns} data={mockData} />
    </div>
  );
}
