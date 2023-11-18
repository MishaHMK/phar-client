
import { Layout, Menu, Dropdown, Avatar, Badge, Button, Drawer } from "antd";
import { DownOutlined, UserOutlined, PlusCircleOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import Link from 'antd/es/typography/Link';
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import AuthLocalStorage from "../AuthLocalStorage";
import { useNavigate } from "react-router-dom"; 
import type { MenuProps } from 'antd';
import AuthorizeApi from "../api/authorizeApi";
import CartApi from "../api/cartApi";
import UserApi from "../api/userApi";
import { useUserStore } from '../stores/user.store';

const { Header, Footer } = Layout;

export const NavBar: React.FC = () => {
    const [name, setName] = useState<string>(); 
    const navigate = useNavigate();
    const signedIn = AuthorizeApi.isSignedIn();
    const userState = useRef(signedIn);
    const token = AuthLocalStorage.getToken() as string;
    const [state, actions] = useUserStore();
    const [count, setCount] = useState<number>(0);
    
    let userService = new UserApi();
    let cartService = new CartApi();

    useEffect(() => {
      fetchData();
    }, [userState.current, state.cartCount, signedIn, name]);

    useEffect(() => {
      fetchData();
    });

    useEffect(() => {  
      fetchData();
  }, []);

    const toProducts = () => {
        navigate("../products", { replace: true });
    } 

    const toCart = () => {
      navigate("../carts", { replace: true });
  } 

     const toOrders = () => {
       navigate("../orders", { replace: true });
  }   

    const logOut = () => {
      authService.logout();
      navigate("../", { replace: true });
    } 

    let authService = new AuthorizeApi();

    const fetchData = async () => {
      if(signedIn){
         const user: any = jwtDecode(token);
         var getUser = await userService.getUserById(user.NameIdentifier, user.Role);
         var userData = getUser.data;
         setName(userData.name);
         state.currentUserId = user.NameIdentifier;
         let count = await cartService.getCartCount(user.NameIdentifier);
         actions.addToCart(count.data-1);
         setCount(count.data);
       }
     };

    const logIn = () => {
      authService.logout();
      navigate("../", { replace: true });
    }; 

    const register = () => {
      navigate("../register", { replace: true });
    }; 

    const items: MenuProps['items'] = [
      {
        label: "Log Out",
        key: '3',
        icon: <UserOutlined />,
        onClick: logOut
      }
    ];

    const menuProps = {
      items
    };

    return (
      <div> 
      <Layout className="headerContainer">
          <Header className = "headerContainer">
          {signedIn && userState.current ? (
            
             <div style={{ display: 'flex'}} >
                  <h2 style={{paddingLeft: "1%", marginTop: "2px"}}>
                    <Link onClick={toProducts} style={{ color: "white", fontSize: "18px" }}>{"Products"}</Link>
                  </h2>
                  <h2 style={{paddingLeft: "5%", marginTop: "2px"}}>
                    <Link onClick={toOrders} style={{ color: "white", fontSize: "18px" }}>{"Orders"}</Link>
                  </h2>
                  <h2 style={{paddingLeft: "55%", marginTop: "8px"}}>
                      <ShoppingCartOutlined onClick={toCart} style={{color: "white", fontSize: "48px"}}>
                      </ShoppingCartOutlined>
                  </h2>
                  <h2 style={{paddingLeft: "1%", marginTop: "0px"}}>
                      { state.cartCount > 0 ? <div><span className="badge">{state.cartCount}</span></div> : <div></div> }
                  </h2>
                  <h3 style={{ marginLeft: "5%", marginTop: "2px", color: "white", fontSize: "20px"}}>
                      {"Welcome, "} {""}   
                      {name !== undefined
                      ? name?.length > 12
                      ? name.slice(0, 15) + "..."
                      : name + " "
                      : ""}
                      
                      <Dropdown menu={menuProps} overlayStyle={{color: "white"}}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <DownOutlined />
                                </a>
                      </Dropdown>
              </h3>
              </div>
              ) : (
              <div style={{ display: 'flex'}}>
                  <h3 style={{ marginLeft: "70%", marginTop: "2px", color: "white" }}>
                       <Link onClick={logIn} style={{ padding: "15px", fontSize: "18px" }}>{"Login"}</Link>
                       <Link onClick={register} style={{ padding: "15px", color: "white", fontSize: "18px" }}>{"Register"}</Link>
                   </h3>
              </div>
          )}
              </Header> 
       </Layout>
      </div>
    );
}