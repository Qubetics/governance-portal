import { format } from "date-fns";
import toast from "react-hot-toast";
import { CHAIN_INFO } from "../constants";
import { httpReqest } from "../httpRequest";
import { Dec } from "@keplr-wallet/unit";

export function calculateElapsedTimePercentage(startTime: any, endTime: any) {
  try {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();

    const totalDuration = end - start;
    const elapsedTime = now - start;

    let percentageElapsed = (elapsedTime / totalDuration) * 100;
    percentageElapsed = Math.max(0, Math.min(100, percentageElapsed));

    return percentageElapsed;
  } catch (error) {
    // console.log("Error while calculateElapsedTimePercentage : ", error);
    return 0;
  }
}

export function formatDate(isoString: string) {
  try {
    const date = new Date(isoString);
    const formattedDate = format(date, "MMMM do yyyy, HH:mm");

    return formattedDate;
  } catch (error) {
    // console.log("error while formating date", error);
    return "";
  }
}

export function calculateDaysRemaining(startDate: any, endDate: any) {
  try {
    // Parse the dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMillis = Number(end) - Number(start);

    // Convert the difference to days
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysRemaining = Math.ceil(differenceInMillis / millisecondsPerDay);

    return daysRemaining > 0 ? daysRemaining : 0;
  } catch (error) {
    // console.log("error while calculating date remaining : ", error);
    return 0;
  }
}

export function calculateTimeRemaining(startDate: any, endDate: any) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end.getTime() - start.getTime();
    if (diff <= 0) return "0s";

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));

    if (days >= 1) {
      return `${days}d`;
    }

    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  } catch {
    return "0s";
  }
}

export function copyToClipBoard(content: string) {
  try {
    window.navigator.clipboard.writeText(content);
    toast.success("Copied.");
    return true;
  } catch (error) {
    // console.log("error while copying to clipboard ", error);
    return false;
  }
}

export const noExponent = function (num: number | string) {
  try {
    if (!num) {
      throw new Error("value is empty.");
    }
    const data = String(num).split(/[eE]/);
    if (data.length === 1) return data[0];
    let z = "";
    const sign = Number(num) < 0 ? "-" : "";
    const str = data[0].replace(".", "");
    let mag = Number(data[1]) + 1;
    if (mag < 0) {
      z = `${sign}0.`;
      while (mag++) z += "0";
      return z + str.replace(/^\-/, "");
    }
    mag -= str.length;
    while (mag--) z += "0";
    return str + z;
  } catch (error) {
    // console.log("Exponent error", error);
    return "0";
  }
};

export function convertSeconds(seconds: number) {
  const secondsInADay = 24 * 60 * 60;
  const days = seconds / secondsInADay;

  if (days < 1) {
    const hours = seconds / (60 * 60);
    return `${hours} hours`;
  } else {
    return `${days} days`;
  }
}

export const formatString = (data = "", startLen = 10, endLen = 10) => {
  return `${data.substring(0, startLen)}...${data.substring(
    data?.length - endLen,
    data?.length
  )}`;
};

export const flooreDecimals = (value: number, place: number = 5) => {
  const flooredValue = Math.floor(value * 100000) / 100000;
  return flooredValue.toFixed(place);
};

export const getBalance = async (address: string) => {
  try {
    if (address) {
      const uri = `${CHAIN_INFO.rest}/cosmos/bank/v1beta1/balances/${address}?pagination.limit=1000`;
      const data = await httpReqest(uri, "GET", null);

      if (data) {
        const balance = data?.data?.balances.find(
          (balance: any) =>
            balance.denom ===
            (CHAIN_INFO?.stakeCurrency?.coinDenom ?? "").toLowerCase()
        );
        const decimal = CHAIN_INFO.currencies.find(
          (currency) =>
            currency.coinMinimalDenom ===
            CHAIN_INFO.stakeCurrency?.coinMinimalDenom
        )?.coinDecimals;

        if (balance) {
          const amount = new Dec(balance?.amount, Number(decimal ?? 0));
          return `${amount.toString(Number(decimal)) ?? 0}`;
          // setWalletBalance(`${amount.toString(Number(decimal))}`);
        } else {
          // setWalletBalance(0);
          return "0";
        }
      } else {
        return "0";
        // setWalletBalance(0);
      }
    }
  } catch (error) {
    console.log("error while fetching balance from keplr : ", error);
    return "0";
    // setWalletBalance(0);
  }
};

export async function ensureKeplrConnected() {
  const window1: any = window;

  if (!window1.keplr) {
    return { connected: false, reason: "Keplr not installed" };
  }

  try {
    const key = await window1.keplr.getKey(CHAIN_INFO?.chainId ?? "");
    localStorage.setItem("wltConnected", "true");
    if (key?.bech32Address) {
      return {
        connected: true,
        address: key.bech32Address,
      };
    }
  } catch (error) {
    console.log("Kplr not connected ...... ", error);
    localStorage.setItem("wltConnected", "false");
  }

  return { connected: false, reason: "Unknown error" };
}

// async function checkKeplrConnection() {
//   const window1: any = window;
//   if (!window1.keplr) {
//     console.log("Keplr not found.");
//     return { connected: false, message: "Keplr not installed" };
//   }

//   try {
//     await window1.keplr.enable(CHAIN_INFO?.chainId ?? "");

//     const offlineSigner = window1.getOfflineSigner(CHAIN_INFO?.chainId ?? "");
//     const accounts = await offlineSigner.getAccounts();

//     if (accounts?.length === 0) {
//       return { connected: false, message: "No account connected" };
//     }
//     const key = await window1.keplr.getKey(CHAIN_INFO?.chainId ?? "");

//     if (key && key.bech32Address) {
//       // setWalletAddress(key?.bech32Address ?? "");
//       return key?.bech32Address ?? "";
//     }

//     // return { connected: false, message: "Could not verify address" };
//     return "";
//   } catch (error) {
//     // return { connected: false, message: "User rejected or wrong chain" };
//     return "";
//   }
// }
