import { LtoR } from "../../../components/dbsync/LtoR";
import { Marge } from "../../../components/dbsync/Marge";
import { RtoL } from "../../../components/dbsync/RtoL";

export const DBSync = () => {
  return (
    <div>
      <LtoR />
      <div className="h-6"></div>
      <RtoL />
      <div className="h-6"></div>
      <Marge />
    </div>
  );
};
