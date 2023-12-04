import axios, { AxiosError } from "axios";

export default class OrderApi { 

    getUserCart = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44387/api/UserOrder/"+ id )
        .catch((error: AxiosError) => {
          throw new Error(error.message);
        });
        return response;
    };

    getAllPagedOrders = async (pageNumber?: number, pageSize?:number, orderStatus?:string, sort?: string, orderby?: string)  => 
    {
      const response = await axios.get("https://localhost:44387/api/UserOrder/pagedAllOrders", 
      { params: { 
          PageNumber: pageNumber,
          UserId: '',
          PageSize: pageSize,
          OrderStatus: orderStatus,
          Sort: sort,
          OrderBy: orderby
      }})
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
    };

    getPagedUserOrders= async (pageNumber?: number, userId?:string, pageSize?:number, orderStatus?:string, sort?: string, orderby?: string)  => 
    {
      const response = await axios.get("https://localhost:44387/api/UserOrder/pagedUserOrders",
       { params: { 
          PageNumber: pageNumber,
          UserId: userId,
          PageSize: pageSize,
          OrderStatus: orderStatus,
          Sort: sort,
          OrderBy: orderby
      }})
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
    };

    approveOrder = async (orderId?: number, status?:string)  => 
    {
      const response = await axios.patch("https://localhost:44387/api/UserOrder/Approve/" + orderId + "/" + status)
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
    };
}