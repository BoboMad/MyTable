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
import { useForm, useFieldArray } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { useGetPayments } from "./api/get-payment";

const paymentSchema = z.object({
  id: z.number().int(),
  email: z.string().email("Invalid email format"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive")
    .refine((value) => /^\d+(\.\d{1,2})?$/.test(value.toString()), {
      message: "Amount can have at most 2 decimal places",
    }),
  statusId: z.number(),
  creationDate: z.string().datetime(),
  expirationDate: z.string().datetime(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be 200 characters or less"),
  isNew: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isEdited: z.boolean().optional(),
});

const formSchema = z.object({
  payments: z.array(paymentSchema),
});

export function PaymentTable() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors },
    setValue,
    getValues,
    reset,
    watch,
  } = form;

  const { data: payments = [] } = useGetPayments({});

  useEffect(() => {
    if (payments) {
      reset({
        payments: payments.map((payment: Payment) => ({
          ...payment,
          amount: Number(payment.amount.toFixed(2)),
          creationDate: new Date(payment.creationDate).toISOString(),
          expirationDate: new Date(payment.expirationDate).toISOString(),
          isNew: false,
          isDeleted: false,
          isEdited: false,
        })),
      });
    }
  }, []);

  const { fields, append, remove, update, prepend } = useFieldArray({
    control,
    name: "payments",
    keyName: "fieldId",
  });

  console.log("errors", errors);

  const handleAddRow = () => {
    const newRow: z.infer<typeof paymentSchema> = {
      id: -(payments.length + 1),
      email: "",
      amount: 0,
      statusId: 1,
      creationDate: new Date().toISOString(),
      expirationDate: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      description: "",
      isNew: true,
      isDeleted: false,
      isEdited: false,
    };

    prepend(newRow);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const rows = data.payments;

    const addedRows = rows.filter((row) => row.isNew && !row.isDeleted);
    const editedRows = rows.filter(
      (row) => row.isEdited && !row.isDeleted && !row.isNew
    );
    const deletedRows = rows.filter((row) => row.isDeleted);

    console.log("Added:", addedRows);
    console.log("Edited:", editedRows);
    console.log("Deleted:", deletedRows);
  };

  if (!payments || payments.length === 0) {
    return <div>Loading...</div>; // Or display a loading indicator
  }

  console.log(form.watch());
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments Table</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Button className="mb-4" type="button" onClick={handleAddRow}>
              <FilePlus2 /> Add Payment
            </Button>

            <Button className="mb-4" type="button">
              <Trash2 /> Remove
            </Button>

            <Button className="mb-4" type="submit">
              <Save /> Save
            </Button>
          </div>
          <DataTable columns={columns} data={fields} />
        </form>
      </Form>
    </div>
  );
}
