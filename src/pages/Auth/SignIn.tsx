/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Row } from "antd";
import { CustomHead } from "../../components/CustomHead";
import Form from "../../components/Forms/Forms";
import FormInput from "../../components/Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler } from "react-hook-form";
import { signInSchema } from "../../schemas/auth";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSignInMutation } from "../../redux/api/authApi";
import { storeUserInfo } from "../../services/auth.service";
import Loading from "../../components/ui/Loading";

type FormValues = {
  phone: string;
  password: string;
};

const SignIn = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const path = state?.path || import.meta.env.VITE_REDIRECT_URL;

  if (isLoading) {
    return <Loading />;
  }

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      const res = await signIn(data).unwrap();
      storeUserInfo({ accessToken: res?.accessToken });
      navigate(`/${path}`, { replace: true });
      toast("Sign in successfully!");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };
  return (
    <div>
      <CustomHead title="Sign In" />
      <div
        className={`box w-full before:w-full after:w-full bg-white dark:bg-bg_dark h-[420px] before:h-[420px] after:h-[420px]`}
      >
        <div className={`content bg-white dark:bg-bg_dark`}>
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-2xl ao text-center text-primary">
              Sign In
            </h3>
            <Form submitHandler={onSubmit} resolver={yupResolver(signInSchema)}>
              <div>
                <FormInput
                  name="phone"
                  type="phone"
                  size="large"
                  label="Phone"
                  required
                />
              </div>
              <div
                style={{
                  margin: "15px 0px",
                }}
              >
                <FormInput
                  name="password"
                  type="password"
                  size="large"
                  label="Password"
                  required
                />
              </div>

              <div className="text-sm mb-4 text-primary">
                <Link to={`/auth/reset`}>Forgot Password ?</Link>
              </div>

              <Row justify="center" align="middle">
                <Button
                  className="bg-primary text-mirage hover:!bg-secondary duration-300 transition-all"
                  size="large"
                  htmlType="submit"
                  type="primary"
                  block
                >
                  Sign In
                </Button>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
