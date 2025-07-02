/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/authApi";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { CustomHead } from "../../components/CustomHead";
import Form from "../../components/Forms/Forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../../schemas/auth";
import { Button, Row } from "antd";
import FormInput from "../../components/Forms/FormInput";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const db_url = import.meta.env.VITE_REDIRECT_URL;

export const ResetPassword = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { token } = params;
  const [resetPassword] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    if (data.password === data.confirmPassword) {
      delete data["confirmPassword"];
      try {
        await resetPassword({
          token,
          data: data,
        }).unwrap();
        toast.success("Password changed Successfully");
        navigate(`/${db_url}/signin`, { replace: true });
      } catch (err: any) {
        toast.error(`${err.data?.message}`);
      }
    } else {
      toast.error(`Password not match`);
    }
  };

  return (
    <div>
      <div>
        <CustomHead title="Reset Password" />
        <div
          className={`box w-full before:w-full after:w-full bg-white dark:bg-bg_dark h-[350px] before:h-[350px] after:h-[350px]`}
        >
          <div className={`content bg-white dark:bg-bg_dark`}>
            <div className="py-6 px-6 lg:px-8">
              <h3 className="mb-4 text-2xl ao text-center text-primary">
                Reset Password
              </h3>
              <Form
                submitHandler={onSubmit}
                resolver={yupResolver(resetPasswordSchema)}
              >
                <div className="my-[10px]">
                  <FormInput
                    name="password"
                    type="password"
                    placeholder="Type your password"
                    label="New Password"
                    required
                  />
                </div>
                <div className="my-[10px]">
                  <FormInput
                    name="confirmPassword"
                    type="password"
                    placeholder="Type your password"
                    label="Confirm Password"
                    required
                  />
                </div>

                <Row justify="center" align="middle">
                  <Button
                    className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                    size="middle"
                    htmlType="submit"
                    type="primary"
                    block
                  >
                    Reset Password
                  </Button>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
