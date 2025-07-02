/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useActivationMutation } from "../../redux/api/authApi";

const db_url = import.meta.env.VITE_REDIRECT_URL;

export const Activation = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { token } = params;
  const [activation, { isSuccess }] = useActivationMutation();

  useEffect(() => {
    const onSubmit = async (token: any) => {
      try {
        await activation(token).unwrap();
        toast.success("Activation successfully. Now sign in");
        navigate(`/${db_url}/signin`, { replace: true });
      } catch (err: any) {
        toast.error(`${err.data?.message}`);
      }
    };
    onSubmit(token);
  }, [token]);

  if (isSuccess) {
    return (
      <div className="text-primary flex justify-center items-center flex-col gap-3">
        <BsCheckCircle size="50" className=" text-primary" />
        <h1 className="verifying text-4xl">Verified</h1>
      </div>
    );
  }
  return (
    <>
      <div className="text-primary flex justify-center items-center !flex-col gap-3">
        <div className="loading_container">
          <div className="top">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square">
                      <div className="square"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square">
                      <div className="square"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="left">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square">
                      <div className="square"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="square">
              <div className="square">
                <div className="square">
                  <div className="square">
                    <div className="square">
                      <div className="square"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="verifying text-4xl">Verifying...</h1>
      </div>
    </>
  );
};
