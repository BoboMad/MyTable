import { DataTable } from "@/components/ui/data-table";
import { Payment } from "./types/types";
import { columns } from "./columns/payment-table-columns";
import { Button } from "@/components/ui/button";
import { FilePlus2, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { useGetPayments } from "./api/get-payment";
import { useCreatePayments } from "./api/create-payment";
import { useUpdatePayments } from "./api/update-payment";
import { useDeletePayments } from "./api/delete-payment";
import { toast } from "sonner";
import { queryClient } from "@/lib/react-query";
import { Spinner } from "@/components/ui/spinner";

const paymentSchema = z
  .object({
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
  })
  .refine(
    (data) => {
      const creationDate = new Date(data.creationDate);
      const expirationDate = new Date(data.expirationDate);
      return expirationDate >= creationDate;
    },
    {
      message: "Expiration date cannot be before creation date",
      path: ["expirationDate"], // Error will appear on expirationDate field
    }
  );

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
    reset,
  } = form;

  const { data: payments = [], refetch } = useGetPayments({});

  const { mutate: createPayments, isPending: isCreating } = useCreatePayments(
    {}
  );
  const { mutate: updatePayments, isPending: isUpdating } = useUpdatePayments(
    {}
  );
  const { mutate: deletePayments, isPending: isDeleting } = useDeletePayments(
    {}
  );

  const { fields, prepend } = useFieldArray({
    control,
    name: "payments",
    keyName: "fieldId",
  });
  const watchedPayments = useWatch({ control, name: "payments" }) || fields;

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
  }, [payments]);

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const rows = data.payments.filter((row) => !(row.isNew && row.isDeleted));

    const addedRows = rows.filter((row) => row.isNew && !row.isDeleted);

    const editedRows = rows.filter(
      (row) => row.isEdited && !row.isDeleted && !row.isNew
    );

    const deletedRowIds = rows
      .filter((row) => row.isDeleted && !row.isNew)
      .map((row) => row.id);

    console.log(editedRows);
    const hasChanges =
      addedRows.length > 0 || editedRows.length > 0 || deletedRowIds.length > 0;

    try {
      if (hasChanges) {
        const mutationPromises = [];

        if (addedRows.length > 0) {
          mutationPromises.push(createPayments(addedRows));
        }

        if (editedRows.length > 0) {
          mutationPromises.push(updatePayments(editedRows));
        }

        if (deletedRowIds.length > 0) {
          mutationPromises.push(deletePayments(deletedRowIds));
        }
        await Promise.all(mutationPromises);
        await queryClient.invalidateQueries({ queryKey: ["Payments"] });
        refetch();
      } else {
        form.reset({ payments: rows });
      }
      toast.success("Payments saved successfully!");
    } catch (error) {
      toast.error("Failed to save payments. Please try again.");
      console.error("Error saving payments:", error);
    }
  };

  const hasDirtyRows = watchedPayments?.some(
    (row) =>
      (row.isNew && !row.isDeleted) || // New row
      (row.isEdited && !row.isDeleted && !row.isNew) || // Edited row
      (row.isDeleted && !row.isNew) // Marked for deletion
  );

  const isLoading = isCreating || isDeleting || isUpdating;

  if (!payments || payments.length === 0) {
    return <div>Loading...</div>;
  }

  console.log("form", form.watch());
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payments Table</h1>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-2">
            <Button className="mb-4" type="button" onClick={handleAddRow}>
              <FilePlus2 /> Add Payment
            </Button>

            <Button
              className="mb-4"
              type="submit"
              disabled={!hasDirtyRows || isLoading}
            >
              <>
                {isLoading ? <Spinner /> : <Save />}
                Save
              </>
            </Button>
          </div>
          <DataTable columns={columns} data={fields} />
        </form>
      </Form>
    </div>
  );
}
