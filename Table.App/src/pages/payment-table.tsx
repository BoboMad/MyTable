import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Payment } from "./types/types";
import { columns } from "./columns/payment-table-columns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { FilePlus2, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useGetPayments } from "./api/get-payment";

const paymentSchema = z.object({
  email: z.string().email("Invalid email format"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive"),
  status: z.enum(["pending", "processing", "success", "failed"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  creationDate: z.string().datetime(),
  expirationDate: z.string().datetime(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be 200 characters or less"),
});

const formSchema = z.object({
  payments: z.record(z.string(), paymentSchema),
});

type FormData = z.infer<typeof formSchema>;

export function PaymentTable() {
  const { data: payments = [] } = useGetPayments({});

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payments: payments.reduce((acc, payment) => {
        acc[payment.id] = payment;
        return acc;
      }, {}),
    },
  });

  const {
    handleSubmit,
    formState: { dirtyFields },
  } = form;

  const hasChanges = Object.keys(dirtyFields.payments || {}).length > 0;

  const onSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    const changedPayments = Object.entries(dirtyFields.payments || {}).map(
      ([id]) => data.payments[id]
    );
    console.log("Submit only changed payments:", changedPayments);
  };

  console.log("errors", form.formState.errors);

  console.log(form.watch());

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments Table</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Button className="mb-4" type="button">
              <FilePlus2 /> Add Payment
            </Button>

            <Button className="mb-4" type="button">
              <Trash2 /> Remove
            </Button>

            <Button className="mb-4" type="submit" disabled={!hasChanges}>
              <Save /> Save
            </Button>
          </div>
          <DataTable columns={columns} data={payments} />
        </form>
      </Form>
    </div>
  );
}
