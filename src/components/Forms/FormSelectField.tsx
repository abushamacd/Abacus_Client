/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";
import { SelectOptions } from "../../types";

type SelectFieldProps = {
  options: SelectOptions[];
  name: string;
  required?: boolean;
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
  value,
  placeholder = "select",
  options,
  label,
  defaultValue,
  required,
}: SelectFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = getErrorMessageByPropertyName(errors, name);

  return (
    <>
      <h1 className="mb-1 text-light_text dark:text-dark_text font-medium text-sm">
        {label ? label : null}
        {required && label ? (
          <span
            style={{
              color: "red",
              marginLeft: "2px",
            }}
          >
            *
          </span>
        ) : null}
      </h1>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            className="bg-bg text-mirage dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
            options={options}
            size={size}
            placeholder={placeholder}
            defaultValue={
              defaultValue ? defaultValue : { label: "Select", value: "Select" }
            }
            style={{ width: "100%" }}
            {...field}
          />
          //   <select
          //     // @ts-ignore
          //     size={size}
          //     // @ts-ignore
          //     onChange={handleChange ? handleChange : onChange}
          //     options={options}
          //     value={value}
          //     style={{ width: "100%" }}
          //     placeholder={placeholder}
          //     className="w-full bg-dark_text dark:text-dark_bg rounded-md border border-light_primary dark:border-dark_primary focus:ring-2 focus:ring-light_primary dark:focus:ring-dark_primary focus:border-light_primary dark:focus:border-dark_primary text-base outline-none px-3 leading-8 transition-colors duration-300 ease-in-out py-[6px]"
          //   >
          //     {options?.map((option: any, index: any) => (
          //       <option key={index} value={option.value}>
          //         {option?.label}
          //       </option>
          //     ))}
          //   </select>
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormSelectField;
