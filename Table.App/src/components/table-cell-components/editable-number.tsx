import { useState } from "react";
import { Input } from "../ui/input";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import { get } from "lodash";
import { stat } from "fs";
import { parse } from "path";

interface EditableNumberCellProps<TData> {
  defaultValue: number;
  index: number;
  accessorKey: keyof TData;
  rowData: TData;
  formPath: string;
}

export function EditableNumberCell<TData>({
  defaultValue,
  index,
  accessorKey,
  rowData,
  formPath,
}: EditableNumberCellProps<TData>) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    setValue,
    getValues,
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const fieldName = `${formPath}.${index}.${String(accessorKey)}` as const;
  const watchedValue = useWatch({ name: fieldName });

  const handleBlur = (newValue: number) => {
    setIsEditing(false);
    const stateValue = getValues(fieldName);

    if (newValue !== stateValue) {
      setValue(fieldName, newValue, { shouldDirty: true });
      setValue(`${formPath}.${index}.isEdited`, true, { shouldDirty: true });
    }
    if (newValue === defaultValue) {
      debugger;
      const rowDirtyFields = get(dirtyFields, `${formPath}.${index}`, {});
      const isRowDirty = Object.keys(rowDirtyFields).some(
        (key) =>
          key !== "isEdited" &&
          key !== String(accessorKey) &&
          key !== "isNew" &&
          key !== "isDeleted"
      );

      if (!isRowDirty) {
        setValue(`${formPath}.${index}.isEdited`, false, {
          shouldDirty: false,
        });
      }
    }
  };

  const hasError = !!get(errors, fieldName);

  if (isEditing) {
    return (
      <Input
        {...register(fieldName)}
        type="number"
        step="0.01"
        defaultValue={defaultValue}
        onBlur={(e) => handleBlur(parseFloat(e.target.value) || 0)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") handleBlur(parseFloat(e.target.value) || 0);
          if (e.key === "Escape") setIsEditing(false);
        }}
        autoFocus
        className="w-full text-right no-spinner"
      />
    );
  }

  return (
    <div
      className={cn(
        "truncate px-2 cursor-text text-right min-h-[38px] flex items-center justify-end",
        hasError && "border border-red-500"
      )}
      onClick={() => {
        setIsEditing(true);
      }}
    >
      {watchedValue || defaultValue}
    </div>
  );
}
