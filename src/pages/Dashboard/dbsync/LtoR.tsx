/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card } from "antd";
import { useTestSBSyncQuery } from "../../../redux/api/dbsync";
import Loading from "../../../components/ui/Loading";
import { toast } from "react-toastify";

export const LtoR = () => {
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
    <div className="">
      <div className="dark:bg-bg_dark bg-white p-4 rounded-md">
        <Card
          title=<div className="flex justify-between items-center">
            <p>Database Sync Local to Remote</p>
            <Button
              onClick={() => handleTestConnection()}
              className="bg-primary hover:!bg-primary text-mirage !bg-opacity-[.8] duration-300 transition-all"
              size="middle"
              type="primary"
              // block
            >
              Test Connection
            </Button>
          </div>
          className="dark:bg-bg_dark bg-white text-mirage dark:text-white !border-secondary border-2"
        >
          tetst
        </Card>
      </div>
    </div>
  );
};
