import { useGetPayments } from "@/pages/api/get-payment";
import { Combobox } from "../ui/combobox";
import { useGetStatuses } from "@/pages/api/get-statuses";
import { useFormContext, useWatch } from "react-hook-form";
import { ReactNode, useState } from "react";
import { Badge } from "../ui/badge";
import { get } from "lodash";

interface StatusPickerProps {
  index: number;
  formPath: string;
  defaultValue: number;
  accessorKey: string;
}

export function StatusPicker({
  index,
  formPath,
  defaultValue,
  accessorKey,
}: StatusPickerProps) {
  const { data: statuses = [] } = useGetStatuses({});
  const {
    setValue,
    getValues,
    formState: { dirtyFields },
  } = useFormContext();

  //   const options = statuses?.map((s) => ({
  //     value: s.id,
  //     label: s.name,
  //   }));

  const fieldName = `${formPath}.${index}.${String(accessorKey)}` as const;
  const watchedValue = useWatch({ name: fieldName });

  const getBadgeVariant = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "warning";
      case 2:
        return "secondary";
      case 3:
        return "success";
      case 4:
        return "destructive";
      default:
        return "default";
    }
  };

  const options = statuses?.map((s) => ({
    value: s.id,
    label: (
      <Badge variant={getBadgeVariant(s.id)} className="w-fit">
        {s.name}
      </Badge>
    ) as ReactNode,
  }));

  const currentStatus = statuses.find((s) => s.id === watchedValue);
  const statusName = currentStatus ? currentStatus.name : "Unknown";

  const handleChange = (newValue: number) => {
    const stateValue = getValues(fieldName);

    if (newValue !== stateValue) {
      setValue(fieldName, newValue, { shouldDirty: true, shouldTouch: true });
      setValue(`${formPath}.${index}.isEdited`, true, {
        shouldDirty: true,
        shouldTouch: true,
      });
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

  return (
    <Combobox
      options={options}
      value={watchedValue}
      onChange={handleChange}
      className="w-full"
    />
  );
}
