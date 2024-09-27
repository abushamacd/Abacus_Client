/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import text_logo from "../../../assets/text_logo.png";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import { useDebounced } from "../../../redux/hooks";
import { Button, Input } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export const Invoice = () => {
  // Format the date to Bangladesh Standard Time (BST)
  const formattedDate = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const query: Record<string, any> = {};
  const [searchTerm, setSearchTerm] = useState<string>("Unknown");

  useEffect(() => {
    if (searchTerm === "") {
      setSearchTerm("Unknown");
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const resetFilters = () => {
    setSearchTerm("Unknown");
  };

  const { data: users, isLoading: staffsLoading } = useGetUsersQuery({
    ...query,
  });
  // @ts-ignore
  const user: any = users?.users;

  console.log(user);

  if (staffsLoading) {
    return <Loading />;
  }
  return (
    <div>
      <section className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <div className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2 rounded-md">
          {/* store info */}
          <div className="store_info p-2">
            <img
              src={text_logo}
              alt="User Cover"
              className="w-auto h-[2rem] md:h-[4rem] mx-auto"
            />
            <h4 className="text-center text-[.6rem] md:text-[1rem]">
              Notun Dorbespur, Meherpur.
            </h4>
            <p className="text-center text-[.6rem] md:text-[1rem]">
              {formattedDate}
            </p>
          </div>
          <div className="w-64 flex items-center justify-center mx-auto">
            <Input
              type="text"
              size="middle"
              className="bg-white text-mirage placeholder:text-mirage dark:placeholder:text-white dark:bg-black dark:text-white focus-within:!border-primary hover:!border-primary"
              placeholder="Search..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <div>
              {!!searchTerm && (
                <Button
                  onClick={resetFilters}
                  className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all ml-4"
                  size="middle"
                  htmlType="submit"
                  type="primary"
                  // block
                >
                  <ReloadOutlined />
                </Button>
              )}
            </div>
          </div>
          {/* user info */}
          <div className="mt-5"></div>
        </div>
      </section>
    </div>
  );
};
