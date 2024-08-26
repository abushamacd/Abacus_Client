import { Row } from "antd";
import error from "../assets/not_found.svg";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
      }}
    >
      <Link to={`/`}>
        <img className="h-screen w-screen" src={error} alt="page not found" />
      </Link>
    </Row>
  );
};
