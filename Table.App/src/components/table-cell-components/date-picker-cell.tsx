import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { get } from "lodash";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DatePickerCellProps<TData> {
  defaultValue: string | Date;
  index: number;
  accessorKey: keyof TData;
  rowData: TData;
  formPath: string;
}

export function DatePickerCell<TData>({
  defaultValue,
  index,
  accessorKey,
  rowData,
  formPath,
}: DatePickerCellProps<TData>) {
  const [open, setOpen] = useState(false);
  const {
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const fieldName = `${formPath}.${index}.${String(accessorKey)}` as const;
  const watchedValue = useWatch({ name: fieldName });

  const handleSelect = (selectedDate: Date | undefined) => {
    setOpen(false);

    if (!selectedDate) return;

    const normalizedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0,
        0
      )
    );

    const newValue = normalizedDate.toISOString();
    const stateValue = getValues(fieldName);
    debugger;
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

  const hasError = !!get(errors, fieldName);

  const displayValue = watchedValue
    ? format(new Date(watchedValue), "yyyy-MM-dd")
    : format(defaultValue, "yyyy-MM-dd");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-left font-normal min-h-[38px] truncate px-2",
            !watchedValue && "text-muted-foreground",
            hasError && "border border-red-500"
          )}
          onClick={() => setOpen(true)}
        >
          {watchedValue ? displayValue : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={watchedValue ? new Date(watchedValue) : undefined}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
