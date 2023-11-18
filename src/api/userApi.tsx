import AuthLocalStorage from "../AuthLocalStorage";
import { ILogin } from '../interface/ILogin';
import { IRegister } from '../interface/IRegister';
import axios, { AxiosError } from "axios";
import Api from "./api";

export default class UserApi { 

    static isSignedIn(): boolean {
        return !!AuthLocalStorage.getToken();
    }

    login = async (userToLogin: ILogin) => {
        const response = await Api.post("Account/authenticate", userToLogin)
          .then((response) => {
            if (response.data.tokenString !== null) {
              AuthLocalStorage.setToken(response.data.tokenString);
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
               throw new Error(error.message);
            } 
          });

        return response;
      };

    register = async (registerForm: IRegister) => {
        const response = await Api.post("Account/register", registerForm);
        return response;
      };

    getUserById = async (id: any, role: any) => {
          const response = await Api.get("Account/users/" + id + "/" + role)
          .catch((error: AxiosError) => {
            throw new Error(error.message);
          });

          return response;
    };
  
    logout = () => {
        AuthLocalStorage.removeToken();
      };
}