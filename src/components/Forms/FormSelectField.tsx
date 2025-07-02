import { Select } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";
import { SelectOptions } from "../../types";

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  required?: boolean;
  mode?: "multiple" | "tags" | undefined;
  size?: "large" | "small" | "middle";
  value?: string | string[] | undefined;
  placeholder?: string;
  label?: string;
  defaultValue?: SelectOptions;
  handleChange?: (el: string) => void;
};

const FormSelectField = ({
  name,
  size = "large",
  placeholder = "select",
  options,
  label,
  defaultValue,
  required,
  mode = undefined,
}: SelectFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      <div className="mb-1">
        <span className="text-mirage dark:text-white">
          {label ? label : null}
        </span>
        {required ? (
          <span
            style={{
              color: "red",
              marginLeft: "2px",
            }}
          >
            *
          </span>
        ) : null}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            allowClear
            mode={mode}
            className="bg-bg text-mirage dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
            options={options}
            size={size}
            placeholder={placeholder}
            defaultValue={defaultValue}
            style={{ width: "100%" }}
            {...field}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormSelectField;
