import { Input } from "antd";
import { useFormContext, Controller } from "react-hook-form";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";

interface IInput {
  name: string;
  type?: string;
  size?: "large" | "small" | "middle";
  value?: string | string[] | undefined;
  id?: string;
  placeholder?: string;
  validation?: object;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormInput = ({
  name,
  type,
  size = "large",
  value,
  placeholder,
  label,
  required,
  disabled,
}: IInput) => {
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
        render={({ field }) =>
          type === "password" ? (
            <Input.Password
              className="bg-bg text-mirage dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
              type={type}
              size={size}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
            />
          ) : (
            <Input
              className="bg-bg text-mirage dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
              disabled={disabled}
              type={type}
              size={size}
              placeholder={placeholder}
              {...field}
              value={value ? value : field.value}
            />
          )
        }
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormInput;
