import { Dec } from "@keplr-wallet/unit";
import { CHAIN_INFO } from "../Common/constants";
import { httpReqest } from "../Common/httpRequest";
import { useState, createContext, useEffect, ReactNode } from "react";

interface UserContextType {
    wallet: any | null;
    setWallet: React.Dispatch<React.SetStateAction<any | null>>;
    walletAddress: string | null;
    setWalletAddress: React.Dispatch<React.SetStateAction<any | null>>;
    isWallet: boolean;
    setIsWallet: React.Dispatch<React.SetStateAction<boolean>>;
    // walletBalance: number | string | null;
    // setWalletBalance: React.Dispatch<React.SetStateAction<number | string | null>>;
    votingWidgetsData: any;
    setVotingWidgets: React.Dispatch<React.SetStateAction<any>>;
}

const defaultValue: UserContextType = {
    wallet: null,
    setWallet: () => { },
    walletAddress: null,
    setWalletAddress: () => { },
    isWallet: false,
    setIsWallet: () => { },
    // walletBalance: null,
    // setWalletBalance: () => { },
    votingWidgetsData: null,
    setVotingWidgets: () => { },
};

export const UserContext = createContext<UserContextType>(defaultValue);

interface ContextProps {
    children: ReactNode;
}

export function Context(props: ContextProps) {
    const [wallet, setWallet] = useState<any | null>(localStorage.getItem("wltConnected"));
    const [isWallet, setIsWallet] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [votingWidgetsData, setVotingWidgets] = useState<any>(null);

    useEffect(() => {

        const value = localStorage.getItem("wltConnected");
        const address = localStorage.getItem("wltAddress");

        if (address) {
            setWalletAddress(address)
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
            const data = await httpReqest(`${CHAIN_INFO.rest}/cosmos/gov/v1/params/voting`, "GET", null);
            if (!data?.error) {
                setVotingWidgets(data?.data);
            }
        })()
    }, []);

    const obj = {
        wallet,
        setWallet,
        isWallet,
        setIsWallet,
        walletAddress,
        setWalletAddress,
        votingWidgetsData,
        setVotingWidgets,
    }

    return (
        <UserContext.Provider value={obj}>
            {props.children}
        </UserContext.Provider>
    );
}

