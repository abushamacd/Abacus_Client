/* eslint-disable no-extra-boolean-cast */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import text_logo from "../../../assets/text_logo.png";
import Loading from "../../../components/ui/Loading";
import { useGetUsersQuery } from "../../../redux/api/userApi";
import {
  useAppDispatch,
  useAppSelector,
  useDebounced,
} from "../../../redux/hooks";
import { Select } from "antd";
import { setView } from "../../../redux/features/siteSlice";

export const Invoice = () => {
  const dispatch = useAppDispatch();
  const { view } = useAppSelector((state) => state.site);

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

  const { data: usersData, isLoading: staffsLoading } = useGetUsersQuery({
    ...query,
  });
  // @ts-ignore
  const allUser: any = usersData?.users;

  const users: any[] = [];
  allUser?.forEach((user: any) => {
    users?.push({ label: `${user?.name}- ${user?.address} `, value: user?.id });
  });

  const onChange = (value: string) => {
    const selecteduser = allUser.filter((user: any) => user.id === value);
    dispatch(
      setView({
        data: selecteduser.length > 0 ? selecteduser : null,
        state: selecteduser.length > 0 && true,
      })
    );
  };

  const onSearch = (value: string) => {
    setSearchTerm(value);
    dispatch(setView({ data: null, state: false }));
  };

  const selectduser: any = view?.data;

  console.log(selectduser?.name);

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
          <div className="md:w-64 flex items-center justify-center mx-auto px-4">
            <Select
              allowClear
              className="w-full"
              showSearch
              placeholder="Search customer"
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={users}
            />
          </div>
          {/* user info */}
          <div className="mt-5"></div>
        </div>
      </section>
    </div>
  );
};
