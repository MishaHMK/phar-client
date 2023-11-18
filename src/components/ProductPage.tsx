import React, {useState, useEffect} from 'react';
import { Card, List, Pagination, Input, Space, Select, Button, Tooltip, FloatButton } from 'antd';
import { EditOutlined, UpOutlined, DownOutlined, PlusOutlined,
    PlusCircleOutlined, DeleteOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import AuthorizeApi from "../api/authorizeApi";
import AuthLocalStorage from '../AuthLocalStorage';
import ProductApi from "../api/productApi";
import UserApi from "../api/userApi";
import CartApi from "../api/cartApi";
import { IListElement } from '../interface/IListElement';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';
import { useUserStore } from '../stores/user.store';
import { jwtDecode } from "jwt-decode";

const pageSize = 6;
const { Search } = Input;

export const ProductPage: React.FC = () => {
    const token = AuthLocalStorage.getToken() as string;
    const signedIn = AuthorizeApi.isSignedIn();
    let productService = new ProductApi();
    let cartService = new CartApi();
    let userService = new UserApi();

    const [totalItems, settotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCat, setSelectedCat] = useState("");
    const [searchName, setSearchName] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const [sortItem, setSortItem] = useState("");
    const [products, setProducts] = useState(Array());
    const [state, actions] = useUserStore();
    const [itemChangeFlag, setItemChangeFlag] = useState(false);
    const [currentRole, setCurrentRole] = useState<any>();

    useEffect(() => {  
        fetchData();
        setItemChangeFlag(false);
    }, [state.cartCount, state.IsEditShown, state.IsCreateShown, currentPage, searchName, orderBy, selectedCat, itemChangeFlag]);

    useEffect(() => {  
        fetchData();
    }, []);

    const fetchData = async () => {
        let response = await productService.getPagedProducts(currentPage, pageSize, searchName, selectedCat, sortItem, orderBy);

        setProducts(response.data.pagedList);
        settotalItems(response.data.totalItems);
        if(signedIn){
            const user: any = jwtDecode(token);
            setCurrentRole(user.Role);
            let count = await cartService.getCartCount(user.NameIdentifier);
            actions.addToCart(count.data-1);
          }
    };
        

    const handleChange = (page : any) => {
        setCurrentPage(page);
    };

    const onSearch = (value: string) => {
        setSearchName(value);
    };

    const handleSelect = async (value : any) => {
        setSelectedCat(value);   
    };

    const sortNameByAsc = () => {
        setSortItem("name");
        setOrderBy("ascend");
    };

    const sortNameByDesc = () => {
        setSortItem("name");
        setOrderBy("descend");
    };

    const openEditProductModal  = (productId: any) => {
        state.productToEditId = productId;
        actions.makeEditProductModalVisible();
        setItemChangeFlag(true);
    };  

    const addToCart  = async (productId: any) => {
         const user: any = jwtDecode(token);
         cartService.addToCart(user.NameIdentifier, productId);
         let count = await cartService.getCartCount(user.NameIdentifier);
         actions.addToCart(count);
    };  

    const deleteProduct  = async (productId: any) => {
        productService.deleteProduct(productId);
        fetchData();
        let response = await productService.getPagedProducts(currentPage, pageSize, searchName, selectedCat, sortItem, orderBy);
        setProducts(response.data.pagedList);
        settotalItems(response.data.totalItems);
        setItemChangeFlag(true);
    };  

    const openCreateProductModal  = () => {
        actions.makeCreateProductModalVisible();
        setItemChangeFlag(true);
    };  

    const categories: IListElement[] = [
        {label: "Any", value: "Any"},
        {label: "Lozenge", value: "Lozenge"},
        {label: "Reliever", value: "Reliever"},
        {label: "Supplement", value: "Supplement"},
        {label: "Sedative", value: "Sedative"},
        {label: "Water", value: "Water"}
    ]

    return (
        <div>
            <FloatButton icon={<PlusOutlined />} 
            type="primary" style={{ right: 24 }} key="add" 
            onClick={() => openCreateProductModal()} />

            <AddProductModal></AddProductModal>
            <EditProductModal></EditProductModal>
            
            <div style = {{marginTop: "3%", marginBottom: "3%"}}> 
            <h2 style = {{marginBottom: "2%"}}>{}</h2>

            <Space direction="horizontal">

            <Button onClick={sortNameByAsc}><UpOutlined /></Button>
            <Button onClick={sortNameByDesc}><DownOutlined /></Button>

               <Search
                    placeholder={"Search"}
                    allowClear
                    enterButton
                    size="large"
                    onSearch={onSearch}
                />

                <Select
                    style={{ width: 140 }}  
                    onChange={handleSelect}
                    defaultValue = {"Category"}
                    options = {categories.map((sp : any) => ({ label: sp.label, value: sp.value }))}
                />

            </Space>

            <br></br>
            <br></br>
            <br></br>

            <List
                grid={{ gutter: 20, column: 3 }}
                dataSource={products}  
                style={{ marginLeft: 20, marginRight: 20 }}
                renderItem={(item : any) => (
                <List.Item>
                    {
                        <Card 
                              title = {item.name}
                              bordered = {true}
                              style = {{boxShadow: '10px 5px 5px grey'}}
                              actions={[
                                <Tooltip placement="top" title={"Edit"}>
                                     {currentRole === 'Admin' && (
                                        <EditOutlined key="edit" onClick={() => openEditProductModal(item.id)} />
                                     )}                                  
                                </Tooltip>,
                                <Tooltip placement="top" title={"Add"}>
                                    <PlusCircleOutlined key="edit" onClick={() => 
                                        addToCart(item.id)}/>                                    
                                </Tooltip>,
                                <Tooltip placement="top" title={"Delete"}>
                                    {currentRole === 'Admin' && (
                                         <DeleteOutlined key="delete" onClick={() => deleteProduct(item.id)} />
                                     )}   
                                </Tooltip>
                            ]}>
                        
                            <i>{item.description}</i>
                            <br></br>
                            <br></br>
                            <b>Price: </b><i>{item.price}</i> UAH
                            <br></br>
                            <b>Quantity: </b><i>{item.avaliable}</i>
                            <br></br>
                        </Card>
                    }
                </List.Item>
            )}
            />

            <Pagination
                pageSize={pageSize}
                current={currentPage}
                total={totalItems}
                onChange={handleChange}
                style={{ bottom: "0px" }}
            />
       </div>    
    </div>  
    );
 };

