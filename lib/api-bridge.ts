import axios from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
})

type CustomAxiosError<T =any> = {
    response?:{
        data:T;
        status:number,
        headers:Record<string, string>
    };
    request?:any;
    message:string;
    code:string
}

interface c<T> {
    status: boolean;
    data: T;
}

export const get = async (url: string, token: string ) => {
    try {
        let headers : any = {
            "Authorization": `Bearer ${token}` || '',
        }
        let result = await axiosInstance.get(url, { headers })
        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as CustomAxiosError <{message: string, code:Number}>;
        if (err.response) {
            console.log(err.response.data.message);
            return {
                status: false,
                message: `${err.code}: something wrong`
            }
        }
        console.log(err.response);
        return{status: false, message: `Something were wrong: ${error}`};
    }
}

export const post = async (url: string, data: string | FormData, token: string | undefined) => {
    try {
        const typed : string = (typeof data == 'string') ? "application/json" : "multipart/form-data"
        let headers : any = {
            "Authorization": `Bearer ${token}` || '',
            "Content-Type": typed
        }
        let result = await axiosInstance.post(url, data, { headers })
        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as CustomAxiosError <{message: string, code:Number}>;
        if (err.response) {
            console.log(err.response.data.message);
            return {
                status: false,
                message: `${err.response.data.message}`
            }
        }
        console.log(err.response);
        return{status: false, message: `Something were wrong: ${error}`};
    }
}

export const put = async (url: string, data: string | FormData, token: string) => {
    try {
        const type: string = (typeof data == 'string') ? "application/json" : "multipart/form-data"
        let result = await axiosInstance.put(url, data, {
            headers: {
                "Authorization": `Bearer ${token}` || '',
                "Content-Type": type
            }
        })
        return {
            status: true,
            data: result.data
        }
    } catch (error) {
        const err = error as CustomAxiosError<{ message: string, code: number }>
        if (err.response) {
            console.log(err.response.data.message);
            return {
                status: false,
                message: `${err.code}: something wrong`
            }
        }
        console.log(err.response);
        return {
            status: false,
            message: `Something were wrong`
        }
    }
 } 

export const drop = async (url: string, token: string) => {
    try {
        let result = await axiosInstance.delete(url, {
            headers: {
                "Authorization": `Bearer ${token}` || '',
            }
        })
        return {
            status: true,
            data: result.data
        }
    }
    catch (error) {
        const err = error as CustomAxiosError<{message : string, code: number}>
        if (err.response) {
            console.log(err.response.data.message);
            return {
                status: false,
                message : `${err.code} : something wrong`
            }
        }
        console.log(err.response);
        return {
            status: false,
            mmessage: `Something were wrong`
        }
    }
}