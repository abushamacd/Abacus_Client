/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Row } from "antd";
import text_logo from "../../assets/text_logo.png";
import FormInput from "../../components/Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../schemas/auth";
import { SubmitHandler } from "react-hook-form";
import Form from "../../components/Forms/Forms";

type FormValues = {
  phone: string;
  password: string;
};
export const Profile = () => {
  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    console.log(data);
    // try {
    //   const res = await signIn(data).unwrap();
    //   storeUserInfo({ accessToken: res?.accessToken });
    //   navigate(`/${path}`, { replace: true });
    //   toast("Sign in successfully!");
    // } catch (err: any) {
    //   toast.error(`${err.data?.message}`);
    // }
  };
  return (
    <div>
      <section className="w-full overflow-hidden dark:bg-bg_dark bg-white p-4 pb-0 rounded-md">
        <div className="flex flex-col">
          <img
            src={text_logo}
            alt="User Cover"
            className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[12rem] border-2 border-primary rounded-md p-2"
          />

          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex ">
            <img
              src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw3fHxwZW9wbGV8ZW58MHwwfHx8MTcxMTExMTM4N3ww&ixlib=rb-4.0.3"
              alt="User Profile"
              className="lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] w-[4rem] h-[4rem] outline outline-2 outline-offset-2 outline-primary relative lg:bottom-[3rem] md:bottom-[2rem] bottom-[.5rem] rounded-md "
            />

            <div className="">
              <h1 className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-4xl md:text-3xl ao">
                Samuel Abera
              </h1>
              <div className="flex items-center">
                <p className="md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                  Simultola,
                </p>
                <p className="md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                  Retailer
                </p>
              </div>
              <p className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                Chudanga
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex my-4">
        <div className="profile_update">
          <Card
            title="Personal Information"
            className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
          >
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

              <Row justify="center" align="middle">
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="large"
                  htmlType="submit"
                  type="primary"
                  block
                >
                  Sign In
                </Button>
              </Row>
            </Form>
          </Card>
        </div>
        <div className="password"></div>
      </div>
    </div>
  );
};
