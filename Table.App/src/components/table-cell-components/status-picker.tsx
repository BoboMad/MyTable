import { useGetPayments } from "@/pages/api/get-payment";
import { Combobox } from "../ui/combobox";
import { useGetStatuses } from "@/pages/api/get-statuses";
import { useFormContext, useWatch } from "react-hook-form";
import { useState } from "react";
import { Badge } from "../ui/badge";

interface StatusPickerProps {
  index: number;
  formPath: string;
  defaultValue: number;
  accessorKey:string;
}

export function StatusPicker({
  index,
  formPath,
  defaultValue,
  accessorKey
}: StatusPickerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { data: statuses = [] } = useGetStatuses({});
  const { setValue, getValues } = useFormContext();

  const options = statuses?.map((s) => ({
    value: s.id,
    label: s.name,
  }));

   const fieldName = `${formPath}.${index}.${String(accessorKey)}` as const;
   const watchedValue = useWatch({ name: fieldName });

  const currentStatus = statuses.find((s) => s.id === watchedValue);
  const statusName = currentStatus ? currentStatus.name : "Unknown";

  // Map statusId to Badge variant
  const getBadgeVariant = (statusId: number) => {
    switch (statusId) {
      case 1: // Pending
        return "warning";
      case 2: // Completed
        return "success";
      case 3: // Failed
        return "destructive";
      case 4: // Processing
        return "secondary";
      default:
        return "default";
    }
  };

  const handleChange = (newValue: number) => {
    setValue(`${formPath}.${index}.statusId`, newValue, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(`${formPath}.${index}.isEdited`, true, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  if (isEditing) {
    return (
      <Combobox
        options={options}
        value={defaultValue}
        onChange={handleChange}
        className="w-full"
      />
    );
  }

  return (
    <Badge
      variant={getBadgeVariant(watchedValue)}
      onClick={() => setIsEditing(true)}
      className="cursor-pointer"
    >
      {statusName}
    </Badge>
  );
}
