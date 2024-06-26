import React, {useState, useEffect} from 'react';
import { Card, List, Pagination, Select } from 'antd';
import { format } from 'date-fns'
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from "jwt-decode";
import OrderApi from "../api/orderApi";
import { Collapse } from 'antd';

export const OrderPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    const pageSize = 5;
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderBy, setOrderBy] = useState("");
    const [userId, setUserId] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [status, setStatus] = useState("");
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
        var repsonseSec = await orderService.getPagedUserOrders(currentPage, decoded.NameIdentifier, pageSize, status, sortItem, orderBy);
        setOrders(repsonseSec.data.pagedList);
        settotalItems(repsonseSec.data.totalItems);
        console.log(repsonseSec.data.pagedList);
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
        items: (
          <div>
            {order.orderDetail.map((item: any) => (
             <div key={item.id}>
                <br></br> 
                <b>{item.product.name}</b>
                {' x ' + item.quantity + ' = ' 
                + item.unitPrice * item.quantity + ' '
                + '( ' + item.unitPrice +  ' per item   )'}
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
                        { value: "", label: 'All' }
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
                            extra={ 
                                    (() => {
                                      switch (item.orderStatus) {
                                        case 'Accepted':
                                          return <h4 style={{color: '#21bb4b'}}>Accepted</h4>;
                                        case 'Pending':
                                          return <h4 style={{color: '#FFFF00'}}>Pending</h4>;
                                        case 'Cancelled':
                                          return <h4 style={{color: '#CC0000'}}>Cancelled</h4>;
                                        default:
                                          return null; 
                                      }
                                    })()
                            }    
                            bordered = {true}
                            style = {{boxShadow:'10px 5px 5px grey', width: '800px', marginLeft: '23%'}}>
                         <b style = {{fontSize: '16px'}}>Order Date {format(new Date(item.orderDate), ' — dd.MM.yyyy HH:mm')}</b>  
                         <br></br>  
                         <b style = {{fontSize: '16px'}}>{`Total Price — ${calculateTotalPrice(item)}`}</b> 
                         <br></br>      
                         <br></br>   
                        <Collapse >
                            <Collapse.Panel header={<b>{`Details`}</b>} key={item.id.toString()}>
                                {items.find((i) => i.key === item.id)?.items}
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

