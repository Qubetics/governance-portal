import axios from "axios";

export const httpReqest = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH', data: any) => {
    try {
        const fetchRes = await axios(url, {
            method,
            data,
        });
        return {
            error: false,
            status: 200,
            data: fetchRes?.data
        }

    } catch (error: any) {
        console.log("Error : ", error?.response?.data?.message);

        const status = error?.response?.status;
        return {
            error: true,
            status: status,
            data: error?.response?.data?.message ?? error?.message ?? null,
        }
    }
}