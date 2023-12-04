import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Rate } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IProduct } from '../interface/IProduct';
import ProductApi from "../api/productApi";
import AuthLocalStorage from "../AuthLocalStorage";
import { useUserStore } from '../stores/user.store';

export const EditProductModal: React.FC = () => { 

    let productService = new ProductApi();

    const [form] = Form.useForm();
    const [state, actions] = useUserStore();

    const token = AuthLocalStorage.getToken() as string;

    useEffect(() => {    
        updateModal();
    }, [state.productToEditId]);

    const updateModal = async () => {
            const result = await productService.getById(state.productToEditId);
            form.setFieldsValue({
                id: state.productToEditId,
                name: result.name,
                description: result.description,
                category: result.category,
                price: result.price,
                avaliable: result.avaliable
            });
        }

      const handleEditCancel = () => {
        actions.makeEditProductModalInvisible();
      }

      const handleSubmit = (values: any) => {
        actions.makeEditProductModalInvisible();

        const product : IProduct = 
        {
          name: values.name,
          description: values.description,
          category: values.category,
          price: values.price,
          avaliable: values.avaliable
        };

        productService.editProduct(state.productToEditId, product);
        state.productToEditId = 0;

     }
     
    return(  
        <Modal title="Edit Product"
           open={state.IsEditShown} 
           onCancel={handleEditCancel}
           footer={null}>
              <h3 style = {{marginBottom: 10}}></h3>
              <Form form = {form} onFinish={handleSubmit}>
                    <Form.Item
                        name="id">
                          <Input type="hidden"/>
                    </Form.Item> 

                   <Form.Item
                      name="name"
                      label="Name">
                       <Input/>
                   </Form.Item>

                  <Form.Item
                      name="description"
                      label="Description">
                       <Input/>
                  </Form.Item>

                  <Form.Item
                      name="category"
                      label="Category">
                      <Input/>
                  </Form.Item>

                  <Form.Item
                      name="price"
                      label="Price">
                      <Input/>
                  </Form.Item>

                  <Form.Item
                      name="avaliable"
                      label="Avaliable">
                      <Input/>
                  </Form.Item>
                  
                  <Form.Item shouldUpdate>
                     {() => (
                      <Button
                          type="primary"
                          style={{ background: "#52c41a", borderColor: "green" }}
                          htmlType="submit">
                          Edit
                      </Button>
                      )}
                  </Form.Item>
              </Form>
        </Modal>)
}


