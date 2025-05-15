import { useState } from "react";
import { Input } from "../ui/input";
import { useFormContext, useWatch } from "react-hook-form";
import { get, trim } from "lodash";
import { cn } from "@/lib/utils";

interface EditableTextCellProps<TData> {
  defaultValue: string;
  index: number;
  accessorKey: keyof TData;
  rowData: TData;
  formPath: string;
}

export function EditableTextCell<TData>({
  defaultValue,
  index,
  accessorKey,
  rowData,
  formPath,
}: EditableTextCellProps<TData>) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    setValue,
    getValues,
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const fieldName = `${formPath}.${index}.${String(accessorKey)}` as const;
  const watchedValue = useWatch({ name: fieldName });

  const handleBlur = (newValue: string) => {
    setIsEditing(false);
    const stateValue = getValues(fieldName);

    if (newValue !== stateValue) {
      setValue(fieldName, newValue, { shouldDirty: true });
      setValue(`${formPath}.${index}.isEdited`, true, { shouldDirty: true });
    }
    if (newValue === defaultValue) {
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
  if (isEditing) {
    return (
      <Input
        {...register(fieldName)}
        type="text"
        defaultValue={defaultValue}
        onChange={() => {}}
        onBlur={(e) => handleBlur(e.target.value.trim())}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") handleBlur(e.target.value.trim());
          if (e.key === "Escape") setIsEditing(false);
        }}
        autoFocus
        className="w-full"
      />
    );
  }

  const hasError = !!get(errors, fieldName);

  return (
    <div
      className={cn(
        "truncate px-2 cursor-text min-h-[38px] flex items-center",
        hasError && "border border-red-500"
      )}
      onClick={() => {
        setIsEditing(true);
      }}
    >
      {watchedValue ?? defaultValue}
    </div>
  );
}
