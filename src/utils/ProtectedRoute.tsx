/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo, isLoggedIn } from "../services/auth.service";
import React, { useEffect, useState } from "react";
import Loading from "../components/ui/Loading";

const db_url = import.meta.env.VITE_REDIRECT_URL;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userLoggedIn = isLoggedIn();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname || `/${db_url}`;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //@ts-ignore
  const { role } = getUserInfo();

  useEffect(() => {
    if (!userLoggedIn) {
      navigate(`/${db_url}/signin`, { replace: true });
    } else {
      navigate(path, { replace: true });
    }
    setIsLoading(true);
  }, [userLoggedIn, role, isLoading, navigate, path]);

  if (!isLoading) {
    return <Loading />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
