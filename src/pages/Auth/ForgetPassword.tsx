/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { CustomHead } from "../../components/CustomHead";
import Form from "../../components/Forms/Forms";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "../../components/Forms/FormInput";
import { Button, Row } from "antd";
import { SubmitHandler } from "react-hook-form";
import { forgetPasswordSchema } from "../../schemas/auth";
import { toast } from "react-toastify";
import { useForgetPasswordMutation } from "../../redux/api/authApi";

type FormValues = {
  email: string;
};

export const ForgetPassword = () => {
  const db_url = import.meta.env.VITE_REDIRECT_URL;

  const [forgetPassword] = useForgetPasswordMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      await forgetPassword(data).unwrap();
      toast.success("Send reset token in you email successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };
  return (
    <div>
      <CustomHead title="Forget Password" />
      <div
        className={`box w-full before:w-full after:w-full bg-white dark:bg-bg_dark h-[280px] before:h-[280px] after:h-[280px]`}
      >
        <div className={`content bg-white dark:bg-bg_dark`}>
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-2xl ao text-center text-primary">
              Forget Password
            </h3>
            <Form
              submitHandler={onSubmit}
              resolver={yupResolver(forgetPasswordSchema)}
            >
              <div>
                <FormInput
                  name="email"
                  type="email"
                  size="large"
                  label="Email"
                  required
                />
              </div>

              <div className="text-sm mb-4 text-primary">
                <Link to={`/${db_url}/signin`}>Remember Password ?</Link>
              </div>

              <Row justify="center" align="middle">
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="middle"
                  htmlType="submit"
                  type="primary"
                  block
                >
                  Forget Password
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
