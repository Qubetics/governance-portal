import { Dec } from "@keplr-wallet/unit";
import { CHAIN_INFO } from "../Common/constants";
import { httpReqest } from "../Common/httpRequest";
import { useState, createContext, useEffect, ReactNode } from "react";
import { getBalance } from "../Common/Utility";

interface UserContextType {
  wallet: any | null;
  setWallet: React.Dispatch<React.SetStateAction<any | null>>;
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<any | null>>;
  isWallet: boolean;
  setIsWallet: React.Dispatch<React.SetStateAction<boolean>>;
  walletBalance: number | string | null;
  // setWalletBalance: React.Dispatch<React.SetStateAction<number | string | null>>;
  votingWidgetsData: any;
  setVotingWidgets: React.Dispatch<React.SetStateAction<any>>;
  walletType: string | null;
  setWalletType: React.Dispatch<React.SetStateAction<string | null>>;
  evmAddress: string | null;
  setEvmAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultValue: UserContextType = {
  wallet: null,
  setWallet: () => {},
  walletAddress: null,
  setWalletAddress: () => {},
  isWallet: false,
  setIsWallet: () => {},
  walletBalance: null,
  // setWalletBalance: () => { },
  votingWidgetsData: null,
  setVotingWidgets: () => {},
  walletType: null,
  setWalletType: () => {},
  evmAddress: null,
  setEvmAddress: () => {},
};

export const UserContext = createContext<UserContextType>(defaultValue);

interface ContextProps {
  children: ReactNode;
}

export function Context(props: ContextProps) {
  const [wallet, setWallet] = useState<any | null>(
    localStorage.getItem("wltConnected"),
  );
  const [isWallet, setIsWallet] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number | string>(0);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [votingWidgetsData, setVotingWidgets] = useState<any>(null);
  const [walletType, setWalletType] = useState<string | null>(
    localStorage.getItem("wltType"),
  );
  const [evmAddress, setEvmAddress] = useState<string | null>(
    localStorage.getItem("evmAddress"),
  );

  const fetchBalance = async (address: string) => {
    const balance = await getBalance(address);
    setWalletBalance(Number(balance));
  };

  useEffect(() => {
    const value = localStorage.getItem("wltConnected");
    const address = localStorage.getItem("wltAddress");
    const evmAdd = localStorage.getItem("evmAddress");

    if (address) {
      setWalletAddress(address);
      fetchBalance(address);
    }

    if (evmAdd) {
      setEvmAddress(evmAdd);
    }

    console.log("value:  ", value);

    if (value === "true") {
      setIsWallet(true);
    } else {
      setIsWallet(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const data = await httpReqest(
        `${CHAIN_INFO.rest}/cosmos/gov/v1/params/voting`,
        "GET",
        null,
      );
      if (!data?.error) {
        setVotingWidgets(data?.data);
      }
    })();
  }, []);

  const obj = {
    wallet,
    setWallet,
    isWallet,
    setIsWallet,
    walletBalance,
    walletAddress,
    setWalletAddress,
    votingWidgetsData,
    setVotingWidgets,
    walletType,
    setWalletType,
    evmAddress,
    setEvmAddress,
  };

  return (
    <UserContext.Provider value={obj}>{props.children}</UserContext.Provider>
  );
}
