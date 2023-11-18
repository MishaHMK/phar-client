import axios, { AxiosError } from "axios";

export default class CartApi { 

    getUserCart = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44387/api/Cart/User/"+ id )
        .catch((error: AxiosError) => {
          throw new Error(error.message);
        });
        return response;
    };

    getCartCount = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44387/api/Cart/count/" + id )
        .catch((error: AxiosError) => {
          throw new Error(error.message);
        });
        return response;
    };

    addToCart = async (userId: any, prodId : any)  => {
      await axios.post("https://localhost:44387/api/Cart/add/" + userId + "/" + prodId)
      .catch((error: AxiosError) => {
          throw new Error(error.message);
      }); 
    };

    deleteProduct = async (userId: any, prodId : any)  => {
      await axios.delete("https://localhost:44387/api/Cart/Delete/" + userId + "/" + prodId)
      .catch((error: AxiosError) => {
          throw new Error(error.message);
      }); 
    };

    doCheckout = async (userId: any) => {
      await axios.post("https://localhost:44387/api/Cart/checkout/" + userId)
       .catch((error: AxiosError) => {
           throw new Error(error.message);
         }); 
    };
}