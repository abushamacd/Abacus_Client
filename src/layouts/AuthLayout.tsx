import icon_logo from "../assets/icon_logo.png";
import { Link, Outlet } from "react-router-dom";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage";
import { useEffect, useState } from "react";

export const AuthLayout = () => {
  const initialTheme = getFromLocalStorage("theme") !== "dark";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [globalTheme, _setGlobalTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !globalTheme);
    document.documentElement.style.backgroundColor = `${
      globalTheme ? "#ffffff" : "#051114"
    }`;
    setToLocalStorage("theme", globalTheme ? "light" : "dark");
  }, [globalTheme]);
  return (
    <div className="bg-white dark:bg-bg_dark">
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
