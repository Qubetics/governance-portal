import { format } from "date-fns";
import toast from "react-hot-toast";

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
    if (diff <= 0) return '0s';

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
    return '0s';
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
      throw new Error("value is empty.")
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
  return `${data.substring(0, startLen)}...${data.substring(data?.length - endLen, data?.length)}`;
};


export const flooreDecimals = (value: number, place : number = 5) => {
  const flooredValue = Math.floor(value * 100000) / 100000;
  return flooredValue.toFixed(place);
};
