import axios, { AxiosError } from "axios";

export default class OrderApi { 

    getUserCart = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44387/api/UserOrder/"+ id )
        .catch((error: AxiosError) => {
          throw new Error(error.message);
        });
        return response;
    };
}