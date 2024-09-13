/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import Loading from "../../../components/ui/Loading";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../../redux/api/userApi";
import text_logo from "../../../assets/text_logo.png";
import { Button, Card, Col, Row } from "antd";
import Form from "../../../components/Forms/Forms";
import FormInput from "../../../components/Forms/FormInput";
import { SubmitHandler } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-toastify";

type FormValues = {
  name: string;
  phone: string;
  email: string | null;
  address: string;
};

export const UserDetails = () => {
  const params = useParams();
  const [isEdit, setIsEdit] = useState(true);
  const [updateUser] = useUpdateUserMutation();

  const { data: userData, isLoading: loading } = useGetUserQuery(params?.id);

  const user: any = userData;

  const defaultValues = {
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || null,
    address: user?.address || "",
  };

  const updateProfile: SubmitHandler<FormValues> = async (data: any) => {
    try {
      await updateUser({ id: params?.id, body: data }).unwrap();
      toast("Update user successfully!");
    } catch (err: any) {
      console.log(err);
      toast.error(`${err.data?.message}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 pb-0 rounded-md">
        <div className="flex flex-col">
          <img
            src={text_logo}
            alt="User Cover"
            className="w-full xl:h-[20rem] lg:h-[18rem] md:h-[12rem] border-2 border-primary rounded-md p-2"
          />

          <div className="sm:w-[80%] xs:w-[90%] mx-auto flex ">
            <div className="">
              <section>
                <div className="lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] w-[4rem] h-[4rem] outline outline-2 outline-offset-2 outline-primary relative lg:bottom-[3rem] md:bottom-[2rem] bottom-[.5rem] rounded-md flex justify-center items-center">
                  <img
                    src={user?.url}
                    alt="User Profile"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </section>
            </div>

            <div className="">
              <h1 className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-4xl md:text-3xl ao">
                {user?.name}
              </h1>
              <p className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* datails */}
      <div className="profile_update my-4">
        <Card
          title={
            <div className="flex gap-2 items-center">
              <span className="">Personal Information</span>
              <span onClick={() => setIsEdit(!isEdit)} className="">
                {isEdit ? (
                  <FaEdit className={`text-xl text-primary`} />
                ) : (
                  <MdOutlineCancel className={`text-xl text-primary`} />
                )}
              </span>
            </div>
          }
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          <Form submitHandler={updateProfile} defaultValues={defaultValues}>
            <Row className="!mx-0" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="name"
                  type="text"
                  size="middle"
                  label="Name"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="phone"
                  type="phone"
                  size="middle"
                  label="Phone"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="email"
                  type="email"
                  size="middle"
                  label="Email"
                  disabled={isEdit}
                />
              </Col>
              <Col
                className="gutter-row"
                sm={24}
                md={8}
                style={{
                  marginBottom: "15px",
                  paddingLeft: "0px",
                }}
              >
                <FormInput
                  name="address"
                  type="text"
                  size="middle"
                  label="Address"
                  disabled={isEdit}
                />
              </Col>
            </Row>
            <Row justify="start" align="middle">
              {!isEdit && (
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="large"
                  htmlType="submit"
                  type="primary"
                  // block
                >
                  Update Profile
                </Button>
              )}
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};
