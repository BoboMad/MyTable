import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { memo } from "react";

interface MarkForDeleteCheckboxProps {
  formPath: string;
  index: number;
  checked: boolean;
}

export const MarkForDeleteCheckbox = ({ formPath, index, checked }: MarkForDeleteCheckboxProps) => {
    const { setValue, getValues } = useFormContext();
    const fieldName = `${formPath}.${index}.isDeleted` as const;
    const watchedValue = getValues(fieldName);

    return (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={watchedValue}
          onCheckedChange={(value) => {
            setValue(fieldName, value, { shouldDirty: value ? true : false });
          }}
          aria-label="Mark row as deleted"
        />
      </div>
    );
  };
