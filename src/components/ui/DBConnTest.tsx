/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";
import { useTestSBSyncQuery } from "../../redux/api/dbsync";
import Loading from "./Loading";
import { toast } from "react-toastify";

export const DBConnTest = () => {
  const { isLoading, refetch } = useTestSBSyncQuery({ enabled: false });

  if (isLoading) {
    return <Loading />;
  }

  const handleTestConnection = async () => {
    const result = await refetch(); // Manually trigger API call

    const connResult: any = result.data; // Access the fetched data
    if (connResult?.statusCode === 200) {
      toast.success("All databases connected successfully");
    } else {
      toast.error("❌ Error during database connection");
    }
  };
  return (
    <Button
      onClick={() => handleTestConnection()}
      className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
      size="middle"
      type="primary"
      // block
    >
      Test Connection
    </Button>
  );
};
