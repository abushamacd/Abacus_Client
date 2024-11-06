/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../services/auth.service";
import React, { useEffect, useState } from "react";
import Loading from "../components/ui/Loading";
import { toast } from "react-toastify";

const db_url = import.meta.env.VITE_REDIRECT_URL;

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //@ts-ignore
  const { role } = getUserInfo();

  useEffect(() => {
    if (role !== "Owner") {
      toast.error(`You have no permission to visit this page`);
      navigate(`/${db_url}`, { replace: true });
    }
    setIsLoading(true);
  }, [navigate, role]);

  if (!isLoading) {
    return <Loading />;
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
