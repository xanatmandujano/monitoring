import React, { useEffect, useState } from "react";
//Redux
import { useGetBranchesStatusQuery } from "../../store/api/branchesStatusApi";
//Components
import GeneralNotification from "../../components/AlarmNotification/GeneralNotification";

const DevicesStatusNotification = () => {
  const { data } = useGetBranchesStatusQuery(
    { branchName: "" },
    {
      pollingInterval: 600000,
      refetchOnMountOrArgChange: true,
    }
  );
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (data && !data.result.allOnline) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  }, [data]);

  return (
    <>
      <GeneralNotification
        hideToast={() => setShowToast(false)}
        toastShow={showToast}
        header="Advertencia"
        data="Hay sucursales sin conexión"
      />
    </>
  );
};

export default DevicesStatusNotification;
