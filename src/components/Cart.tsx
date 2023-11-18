import React, {useState, useEffect} from 'react';
import AuthorizeApi from "../api/authorizeApi";
import AuthLocalStorage from '../AuthLocalStorage';
import ProductApi from "../api/productApi";
import UserApi from "../api/userApi";
import CartApi from "../api/cartApi";
import type { ColumnsType } from 'antd/es/table';
import { useUserStore } from '../stores/user.store';
import { jwtDecode } from "jwt-decode";
import { Table, Button, Flex} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

export const CartPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    const signedIn = AuthorizeApi.isSignedIn();
    let productService = new ProductApi();
    let cartService = new CartApi();
    let userService = new UserApi();

    const [totalItems, settotalItems] = useState(0);
    const [state, actions] = useUserStore();
    const [itemChangeFlag, setItemChangeFlag] = useState(false);
    const [cart, setCart] = useState(Array());
    const [totalCount, setTotalCount] = useState<number>(0);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {  
        fetchData();
        setItemChangeFlag(false);
    }, [state.cartCount, state.IsEditShown, state.IsCreateShown, itemChangeFlag]);

    useEffect(() => {  
        fetchData();
    }, []);

    const fetchData = async () => {
        if(signedIn){
            const user: any = jwtDecode(token);
            setUserId(user.NameIdentifier);
            let response = await cartService.getUserCart(user.NameIdentifier);
            var count = 0;

            const newArray: DataType[] = response.data.cartDetails.map((item : any) => {
                return {
                    id: item.productId,
                    drugName: item.product.name,
                    category: item.product.category,
                    unitPrice: item.unitPrice + ' x ' + item.quantity,
                    totalPrice: item.unitPrice * item.quantity
                };
              });

            setCart(newArray);

            response.data.cartDetails.map((item : any) => { 
                var price = item.unitPrice * item.quantity
                count += price;
            });

            setTotalCount(count);  
          }
    };

    const handleAdd = async (productId : any) => {
        const user: any = jwtDecode(token);
        await cartService.addToCart(user.NameIdentifier, productId);
        fetchData();
    };

    const handleRemove = async (productId : any) => {
        const user: any = jwtDecode(token);
        await cartService.deleteProduct(user.NameIdentifier, productId);
        fetchData();
    };

    const handleCheckout = async (productId : any) => {
        const user: any = jwtDecode(token);
        await cartService.doCheckout(user.NameIdentifier);
        fetchData();
    };

    interface DataType {
        id: number,
        drugName: string;
        category: string;
        unitPrice: string;
        totalPrice: string;
      }

      const columns: ColumnsType<DataType> = [
        {
          title: "Drug",
          dataIndex: 'drugName',
          width: '15%'
        },
        {
          title: "Category",
          dataIndex: 'category',
          width: '15%'
        },
        {
          title: "Unit Price",
          dataIndex: 'unitPrice',
          width: '15%'
        },
        {
          title: "Total Price",
          dataIndex: 'totalPrice',
          width: '20%'
        },
        {
          title: "Action",
          width: '20%',
          dataIndex: 'id',
          render: (id: number) => (
            <Flex gap="small" vertical>
                <Flex gap="small" wrap="wrap">
                    <Button onClick={async () => await handleAdd(id)}
                        type="primary"
                        icon={<PlusOutlined />}
                    />
                    <Button onClick={async () => await handleRemove(id)}
                        type="primary"
                        icon={<MinusOutlined />}
                    />
                </Flex>
            </Flex>
          )
        },
      ]
  

    return (
        <div>
            <br></br>
            <br></br>
            <Table
                    style = {{fontSize: "20px"}}
                    columns={columns}
                    dataSource={cart}
                    pagination = {false}>
            </Table>
            <h2>Total Count: {totalCount}</h2>
            <Button onClick={async () => await handleCheckout(userId)}
                        type="primary"> 
            Checkout
            </Button>
       </div>    
    );
 };

