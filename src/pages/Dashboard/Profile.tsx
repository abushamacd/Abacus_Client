/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Row, Spin } from "antd";
import text_logo from "../../assets/text_logo.png";
import FormInput from "../../components/Forms/FormInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "../../schemas/auth";
import { SubmitHandler } from "react-hook-form";
import Form from "../../components/Forms/Forms";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUploadPhotoMutation,
} from "../../redux/api/userApi";
import Loading from "../../components/ui/Loading";
import { toast } from "react-toastify";
import { useChangePasswordMutation } from "../../redux/api/authApi";
import Dropzone from "react-dropzone";

type FormValues = {
  name: string;
  phone: string;
  email: string | null;
  address: string;
};

export const Profile = () => {
  const { data, isLoading: userLoading } = useGetUserProfileQuery({});
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [
    uploadPhoto,
    {
      isLoading: imageUploadIsLoading,
      data: imageUploadData,
      // reset: imageUploadReset,
    },
  ] = useUploadPhotoMutation();

  const res: any = data;
  // @ts-ignore
  const photoUrl: string = imageUploadData?.url;

  const defaultValues = {
    name: res?.response?.name || "",
    phone: res?.response?.phone || "",
    email: res?.response?.email || null,
    address: res?.response?.address || "",
  };

  const updateProfile: SubmitHandler<FormValues> = async (data: any) => {
    try {
      await updateUserProfile(data).unwrap();
      toast("Update user successfully!");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  const updatePassword: SubmitHandler<FormValues> = async (data: any) => {
    console.log(data);
    try {
      await changePassword(data).unwrap();
      toast("Password changed successfully!");
    } catch (err: any) {
      toast.error(`${err.data?.message}`);
    }
  };

  if (userLoading) {
    return <Loading />;
  }

  const handleImgUpload = (image: any) => {
    const formData = new FormData();
    formData.append("images", image[0] as Blob);
    uploadPhoto(formData);
  };

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
            <div className="cursor-pointer">
              {imageUploadIsLoading ? (
                <Spin size="large" />
              ) : (
                <Dropzone
                  onDrop={(acceptedFiles) => handleImgUpload(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div
                        {...getRootProps()}
                        className="lg:w-[12rem] lg:h-[12rem] md:w-[10rem] md:h-[10rem] w-[4rem] h-[4rem] outline outline-2 outline-offset-2 outline-primary relative lg:bottom-[3rem] md:bottom-[2rem] bottom-[.5rem] rounded-md flex justify-center items-center"
                      >
                        <input {...getInputProps()} />
                        <img
                          src={(photoUrl && photoUrl) || res?.response?.url}
                          alt="User Profile"
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </section>
                  )}
                </Dropzone>
              )}
            </div>

            <div className="">
              <h1 className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-4xl md:text-3xl ao capitalize">
                {res?.response?.name}
              </h1>
              <p className="w-full md:px-4 md:pt-3  px-2  text-gray-800 dark:text-white lg:text-base md:text-xl text-xs">
                {res?.response?.role}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex lg:flex-row flex-col my-4 gap-6">
        <div className="profile_update lg:w-1/2">
          <Card
            title="Personal Information"
            className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
          >
            <Form submitHandler={updateProfile} defaultValues={defaultValues}>
              <div>
                <FormInput name="name" type="text" size="middle" label="Name" />
              </div>
              <div
                style={{
                  margin: "15px 0px",
                }}
              >
                <FormInput
                  name="phone"
                  type="phone"
                  size="middle"
                  label="Phone"
                />
              </div>
              <div
                style={{
                  margin: "15px 0px",
                }}
              >
                <FormInput
                  name="email"
                  type="email"
                  size="middle"
                  label="Email"
                />
              </div>
              <div
                style={{
                  margin: "15px 0px",
                }}
              >
                <FormInput
                  name="address"
                  type="text"
                  size="middle"
                  label="Address"
                />
              </div>
              <Row justify="start" align="middle">
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="large"
                  htmlType="submit"
                  type="primary"
                  // block
                >
                  Update Profile
                </Button>
              </Row>
            </Form>
          </Card>
        </div>
        <div className="password lg:w-1/2">
          <Card
            title="Change Password"
            className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
          >
            <Form
              submitHandler={updatePassword}
              resolver={yupResolver(passwordSchema)}
            >
              <div>
                <FormInput
                  name="oldPassword"
                  type="password"
                  size="middle"
                  label="Old Password"
                  required
                />
              </div>
              <div
                style={{
                  margin: "15px 0px",
                }}
              >
                <FormInput
                  name="newPassword"
                  type="password"
                  size="middle"
                  label="New Password"
                  required
                />
              </div>

              <Row justify="start" align="middle">
                <Button
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
                  size="large"
                  htmlType="submit"
                  type="primary"
                  // block
                >
                  Change Password
                </Button>
              </Row>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};
