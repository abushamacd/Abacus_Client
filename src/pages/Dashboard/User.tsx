/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "antd/es/card/Card";
import Form from "../../components/Forms/Forms";
import FormInput from "../../components/Forms/FormInput";
import { Button, Row } from "antd";
import { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addUserSchema } from "../../schemas/user";
import { useSignUpMutation } from "../../redux/api/authApi";
import { toast } from "react-toastify";

type UserFormValues = {
  name: string;
  phone: string;
  address: string;
};

export const User = () => {
  const [signUp] = useSignUpMutation();

  const addUser: SubmitHandler<UserFormValues> = async (data: {
    name: string;
    phone: string;
    address: string;
  }) => {
    try {
      await signUp(data).unwrap();
      toast.success("Add user successfully");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };
  return (
    <div className="">
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title="Add New User"
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form submitHandler={addUser} resolver={yupResolver(addUserSchema)}>
            <div className="w-full flex md:flex-row flex-col items-start justify-between gap-5">
              <div className="w-full">
                <FormInput
                  name="name"
                  type="text"
                  size="middle"
                  label="Name"
                  required
                />
              </div>
              <div className="w-full">
                <FormInput
                  name="phone"
                  type="phone"
                  size="middle"
                  label="Phone"
                  required
                />
              </div>
              <div className="w-full">
                <FormInput
                  name="address"
                  type="text"
                  size="middle"
                  label="Address"
                  required
                />
              </div>
            </div>
            <Row justify="start" align="middle">
              <Button
                className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mt-4"
                size="large"
                htmlType="submit"
                type="primary"
                // block
              >
                Add User
              </Button>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};
