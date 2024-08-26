import icon_logo from "../assets/icon_logo.png";
import { Link, Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="bg-white dark:bg-bg_dark ">
      <div className="h-screen flex flex-col lg:flex-row justify-evenly items-center">
        <div className="w-1/2 md:w-2/4 lg:w-1/4">
          <Link to="/">
            <img
              src={icon_logo}
              width={100}
              height={100}
              className="w-auto"
              alt="logo"
            />
          </Link>
        </div>

        <div className="w-[80%] md:w-1/2 lg:w-1/4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
