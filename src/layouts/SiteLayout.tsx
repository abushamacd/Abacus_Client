import icon_logo from "../assets/icon_logo.png";
import { Link, Outlet } from "react-router-dom";
import { getFromLocalStorage, setToLocalStorage } from "../utils/local-storage";
import { useEffect, useState } from "react";

const SiteLayout = () => {
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
    <>
      <div className="flex flex-col md:justify-evenly justify-center gap-5 items-center h-screen bg-white dark:bg-bg_dark">
        <div className="w-72">
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
        <div className="">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SiteLayout;
