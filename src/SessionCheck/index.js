import { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../Context/store";
import { useIdleTimer } from "react-idle-timer";

const SessionCheck = () => {
  const { setWallet, setWalletAddress } = useContext(UserContext);

  const logoutAction = () => {
    localStorage.clear();
    setWalletAddress("");
    setWallet("false");
    toast.error("Session Expired, Please login again!");
  };

  const onIdle = () => {
    logoutAction();
  };

  const onActive = () => {};

  useIdleTimer({
    onIdle,
    onActive,
    timeout: 6000000,
    throttle: 1000,
  });
  return <></>;
};

export default SessionCheck;
