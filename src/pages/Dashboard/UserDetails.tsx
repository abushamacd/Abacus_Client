/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import { useGetUserQuery } from "../../redux/api/userApi";
import text_logo from "../../assets/text_logo.png";
import { Spin } from "antd";
import Dropzone from "react-dropzone";

export const UserDetails = () => {
  const params = useParams();

  const { data: userData, isLoading: loading } = useGetUserQuery(params?.id);

  const user: any = userData;

  console.log(user);

  if (loading) {
    return <Loading />;
  }

  const handleImgUpload = (image: any) => {
    const formData = new FormData();
    formData.append("images", image[0] as Blob);
    // uploadPhoto(formData);
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
              {/* {imageUploadIsLoading ? (
                <Spin size="large" />
              ) : ( */}
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
                        // src={(photoUrl && photoUrl) || res?.response?.url}
                        alt="User Profile"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
              {/* )} */}
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
    </div>
  );
};
