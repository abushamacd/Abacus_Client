/* eslint-disable @typescript-eslint/no-unused-expressions */

import { DatePicker, DatePickerProps } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { getErrorMessageByPropertyName } from "../../utils/schema-validator";

type UMDatePikerProps = {
  onChange?: (valOne: Dayjs | null, valTwo: string) => void;
  name: string;
  label?: string;
  value?: Dayjs;
  size?: "large" | "small" | "middle";
  required?: boolean;
};

const FormDatePicker = ({
  name,
  label,
  onChange,
  size = "large",
  required,
}: UMDatePikerProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleOnChange: DatePickerProps["onChange"] = (date, dateString) => {
    onChange ? onChange(date, dateString as string) : null;
    setValue(name, date);
  };

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
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            className="bg-white text-mirage dark:bg-bg_dark dark:text-white focus-within:!border-primary hover:!border-primary disabled:text-mirage dark:disabled:text-white"
            defaultValue={dayjs(field.value) || Date.now()}
            size={size}
            onChange={handleOnChange}
            style={{ width: "100%" }}
          />
        )}
      />
      <small style={{ color: "red" }}>{errorMessage}</small>
    </>
  );
};

export default FormDatePicker;
