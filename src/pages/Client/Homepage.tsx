import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../services/auth.service";
import { Button } from "antd";
import { CustomHead } from "../../components/CustomHead";

const db_url = import.meta.env.VITE_REDIRECT_URL;

const Homepage = () => {
  const userLoggedIn = isLoggedIn();
  const navigate = useNavigate();

  return (
    <div>
      <CustomHead title="Welcome" />
      <div className="text-center text-mirage dark:text-white">
        <h2 className="md:text-7xl text-3xl mb-4 text-primary ao p-4">
          Welcome to <span className="italic ao">Allardan</span>
        </h2>
        <p className="text-light_text dark:text-dark_text text-xl">
          Have a good day 😊
        </p>
        <div className="flex justify-center mt-5">
          {userLoggedIn ? (
            <Button
              onClick={() => {
                navigate(`/${db_url}`, { replace: true });
              }}
              className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mb-5"
              size="middle"
              htmlType="submit"
              type="primary"
            >
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigate(`/${db_url}/signin`, { replace: true });
              }}
              className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all mb-5"
              size="middle"
              htmlType="submit"
              type="primary"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
