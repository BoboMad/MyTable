import { useState } from "react";
import { Input } from "../ui/input";
import { useFormContext, useWatch } from "react-hook-form";
import { get } from "lodash";
import { cn } from "@/lib/utils";

interface EditableTextCellProps<TData> {
  defaultValue: string;
  rowId: string;
  accessorKey: keyof TData;
  rowData: TData;
  formPath: string;
}

export function EditableTextCell<TData>({
  defaultValue,
  rowId,
  accessorKey,
  rowData,
  formPath,
}: EditableTextCellProps<TData>) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    setValue,
    getValues,
    register,
    formState: { errors },
  } = useFormContext();

  const fieldName = `${formPath}.${rowId}.${String(accessorKey)}` as const;
  const watchedValue = useWatch({ name: fieldName });

  const handleBlur = () => {
    setIsEditing(false);
    const newValue = getValues(fieldName);
    if (newValue !== defaultValue) {
      // Get the current row state, fallback to an empty object
      const currentRow = getValues(`${formPath}.${rowId}`) || {};
      // Update the row, preserving all existing fields
      setValue(`${formPath}.${rowId}`, {
        ...rowData,
        ...currentRow,
        [accessorKey]: newValue,
      });
    }
  };

  if (isEditing) {
    return (
      <Input
        {...register(fieldName)}
        defaultValue={watchedValue ?? defaultValue}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleBlur();
          if (e.key === "Escape") {
            setValue(fieldName, defaultValue);
            setIsEditing(false);
          }
        }}
        autoFocus
        className="w-full"
      />
    );
  }

  return (
    <div
      className={cn("truncate px-2 cursor-text", errors && "border-red-500")}
      onClick={() => {
        setIsEditing(true);
      }}
    >
      {watchedValue ?? defaultValue}
    </div>
  );
}
