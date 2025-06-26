import { useState, createContext, useEffect, ReactNode } from "react";
import { CHAIN_INFO } from "../Common/constants";
import { httpReqest } from "../Common/httpRequest";

interface UserContextType {
    wallet: any | null;
    setWallet: React.Dispatch<React.SetStateAction<any | null>>;
    walletAddress: string | null;
    setWalletAddress: React.Dispatch<React.SetStateAction<any | null>>;
    isWallet: boolean;
    setIsWallet: React.Dispatch<React.SetStateAction<boolean>>;
    walletBalance: number | string | null;
    setWalletBalance: React.Dispatch<React.SetStateAction<number | string | null>>;
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
    walletBalance: null,
    setWalletBalance: () => { },
    votingWidgetsData: null,
    setVotingWidgets: () => { },
};

export const UserContext = createContext<UserContextType>(defaultValue);

interface ContextProps {
    children: ReactNode;
}

export function Context(props: ContextProps) {
    const [wallet, setWallet] = useState<any | null>(null);
    const [isWallet, setIsWallet] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | string | null>(null);
    const [votingWidgetsData, setVotingWidgets] = useState<any>(null);

    useEffect(() => {

        const checkWallet = async () => {
            const window1: any = window
            if (!window1?.keplr) {
                setIsWallet(false);
            } else {
                setIsWallet(true);
            }
            const data = await httpReqest(`${CHAIN_INFO.rest}/cosmos/gov/v1/params/voting`, "GET", null);
            if (!data?.error) {
                setVotingWidgets(data?.data);
            }
        };

        setTimeout(() => {
            checkWallet();
        }, 1000)

    }, []);

    const obj = {
        wallet,
        setWallet,
        isWallet,
        setIsWallet,
        walletBalance,
        setWalletBalance,
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

