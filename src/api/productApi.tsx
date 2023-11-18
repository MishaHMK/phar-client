import axios, { AxiosError } from "axios";
import { IProduct } from "../interface/IProduct";

export default class ProductApi { 

    getById = async (id: string | undefined) => {
        const response = await axios.get("https://localhost:44387/api/Products/" + id)
        .catch((error: AxiosError) => {
          throw new Error(error.message);
        });
        return response.data;
    };

    editProduct = async (id: any, Product : any)  => {
      const response = await axios.put("https://localhost:44387/api/Products/Edit/" + id, Product)
      .catch((error: AxiosError) => {
          throw new Error(error.message);
      }); 

      return response;
    };

    createProduct = async (createProduct: IProduct) => {
      await axios.post("https://localhost:44387/api/Products/create", createProduct)
       .catch((error: AxiosError) => {
           throw new Error(error.message);
         }); 
    };

    deleteProduct = async (id: number| undefined)  => {
      await axios.delete("https://localhost:44387/api/Products/Delete/" + id)
      .catch((error: AxiosError) => {
          throw new Error(error.message);
      }); 
    }

    getPagedProducts= async (pageNumber?: number, pageSize?:number, searchName?:string, category?:string, sort?: string, orderby?: string)  => 
    {
      const response = await axios.get("https://localhost:44387/api/Products/pagedProd", { params: { 
          PageNumber: pageNumber,
          PageSize: pageSize,
          SearchName: searchName,
          Category: category,
          Sort: sort,
          OrderBy: orderby
      }})
      .catch((error: AxiosError) => {
        throw new Error(error.message);
      });

      return response;
  };
}