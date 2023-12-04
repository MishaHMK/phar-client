import React, {useState, useEffect} from 'react';
import { Button, Card, List, Pagination, Select, Table, Flex } from 'antd';
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from "jwt-decode";
import OrderApi from "../api/orderApi";
import { Collapse } from 'antd';
import type { ColumnsType } from 'antd/es/table';
const { Panel } = Collapse;
export const ManagementPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    //const pageSize = 5;
    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [orderBy, setOrderBy] = useState("");
    const [userId, setUserId] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [status, setStatus] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [orders, setOrders] = useState([]);

    let orderService = new OrderApi();
    
    const handleChange = (page : any) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    };

    const handleSelect = async (orderId : any, value: any) => {
      await orderService.approveOrder(orderId, value);
      fetchData();
    };

    useEffect(() => {  
        fetchData();
    }, [currentPage, sortItem, orderBy, selectedStatus]); 

    const fetchData = async () => {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.NameIdentifier);
        var repsonseSec = await orderService.getAllPagedOrders(currentPage, pageSize, status, sortItem, orderBy);
        setOrders(repsonseSec.data.pagedList);
        settotalItems(repsonseSec.data.totalItems);
    };

    interface DataType {
        id: number,
        orderDate: string;
        orderDetails: string;
        orderStatus: string;
      }

    const columns: ColumnsType<DataType> = [
        {
          title: "№",
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: "Order Date",
          dataIndex: 'orderDate',
          width: '10%'
        },
        {
          title: "Order Details",
          dataIndex: 'orderDetail',
          width: '30%',
          render: (orderDetail) => (
            <Collapse>
              <Panel header="Order Details" key="1">
                <ul>
                  {orderDetail.map((item: any) => (
                    <li key={item.id}>
                      {item.product.name} - Quantity: х{item.quantity} - Unit Price: {item.unitPrice} UAH
                    </li>
                  ))}
                </ul>
              </Panel>
            </Collapse>)
        },
        {
          title: "Total Price",
          dataIndex: 'totalPrice',
          width: '10%'
        },
        {
          title: "Select Status",
          width: '20%',
          dataIndex: 'orderStatus',
          render: (orderStatus: string, record: DataType) => (
            <Select
                defaultValue={orderStatus}
                style={{ width: 120 }}
                onChange={(value) => handleSelect(record.id, value)}
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Accepted', label: 'Accepted' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
            />
          )
        },
      ]

    const items = orders.map((order: any) => ({
        key: order.id,
        items: (
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
        <div>
        <br></br>
        <br></br>
        <Table
                style = {{fontSize: "20px"}}
                columns={columns}
                dataSource={orders}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalItems,
                  onChange: handleChange,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
              }}>
        </Table>
   </div>    
    );
 };

