import React, {useState, useEffect} from 'react';
import { Button, Card, List, Pagination, Select } from 'antd';
import { format } from 'date-fns'
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from "jwt-decode";
import OrderApi from "../api/orderApi";
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

export const OrderPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    const pageSize = 3;
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderBy, setOrderBy] = useState("");
    const [userId, setUserId] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [orders, setOrders] = useState([]);

    let orderService = new OrderApi();
    
    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    const handleSelect = (value : any) => {
        setSelectedStatus(value);
    };

    useEffect(() => {  
        fetchData();
    }, [currentPage, sortItem, orderBy, selectedStatus]);


    const fetchData = async () => {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.NameIdentifier);
        var repsonse = await orderService.getUserCart(decoded.NameIdentifier);
        setOrders(repsonse.data);
    };

    const calculateTotalPrice = (orderDetail : any) => {
        var number = 0;
        orderDetail.orderDetail.map((item : any) => {
            number += (item.quantity * item.unitPrice);
        });
        return number.toFixed(2); 
    };


    const items = orders.map((order: any) => ({
        key: order.id,
        children: (
          <div>
            {order.orderDetail.map((item: any) => (
             <div>
                <br></br> 
                <b>{item.product.name}</b>
                {' x ' + item.quantity + ' = ' 
                + item.unitPrice * item.quantity + ' '
                + '( ' + item.unitPrice + ' )'}
            </div>
            ))}
          </div>
        ),
      }));

    return (
        <div style = {{marginTop: "3%", marginBottom: "3%"}}> 
            
            <h1 style = {{marginBottom: "2%"}}>{"My Orders"}</h1>
            <Select
                    style={{ width: 150 }}
                    onChange={handleSelect}
                    options={[
                        { value: null, label: 'All' }
                    ]}
                    defaultValue = "All"
             />
            <br></br>
            <br></br>
            <br></br>
            <List
                grid={{ column: 1 }}
                dataSource={orders}
                renderItem={(item : any) => (
                <List.Item>
                    <Card 
                            title =
                            { 
                                <h4 style={{fontSize: '20px'}}>Order №{item.id}</h4>
                            }
                            extra={(item.isApproved == true) ? 
                                <h4 style={{color: '#21bb4b'}}>{"Pending"}</h4> : 
                                <h4 style={{color: '#CC0000'}}>{"Cancelled"}</h4> } 
                            bordered = {true}
                            style = {{boxShadow:'10px 5px 5px grey', width: '800px', marginLeft: '23%'}}>
                         <b style = {{fontSize: '16px'}}>Order Date {format(new Date(item.orderDate), ' — dd.MM.yyyy HH:mm')}</b>  
                         <br></br>  
                         <b style = {{fontSize: '16px'}}>{`Total Price — ${calculateTotalPrice(item)}`}</b> 
                         <br></br>      
                         <br></br>   
                        <Collapse >
                            <Collapse.Panel header={<b>{`Details`}</b>} key={item.id.toString()}>
                                {items.find((i) => i.key === item.id)?.children}
                            </Collapse.Panel>
                        </Collapse>
                    </Card>
                </List.Item>
            )}
            />

            <Pagination
                pageSize={pageSize}
                current={currentPage}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "10px" }}
            />
            <br></br>
            <br></br>
          
       </div>
    );
 };

