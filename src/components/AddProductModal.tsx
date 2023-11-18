import {useEffect} from "react"
import React, { useState } from 'react';
import { Modal, Form, Input, Button, Rate } from "antd";
import { useForm } from "antd/lib/form/Form";
import { IProduct } from '../interface/IProduct';
import ProductApi from "../api/productApi";
import AuthLocalStorage from "../AuthLocalStorage";
import { useUserStore } from '../stores/user.store';

export const AddProductModal: React.FC = () => { 

    let productService = new ProductApi();

    const [addForm] = useForm();
    const [state, actions] = useUserStore();

    const token = AuthLocalStorage.getToken() as string;

    useEffect(() => {    
    }, [state.productToEditId]);

    const updateModal = async () => {
        addForm.setFieldsValue({
            name: ' ',
            description: ' ',
            category: ' ',
            price: ' ',
            avaliable: ' '
        });
    }

      const handleCreateCancel = () => {
        actions.makeCreateProductModalInvisible();
        updateModal();
      }

      const handleSubmit = (values: any) => {
        actions.makeCreateProductModalInvisible();

        const product : IProduct = 
        {
          name: values.name,
          description: values.description,
          category: values.category,
          price: values.price,
          avaliable: values.avaliable
        };

        productService.createProduct(product);
        updateModal();
     }
     
    return(  
        <Modal title="Create Product"
           open={state.IsCreateShown} 
           onCancel={handleCreateCancel}
           footer={null}>
              <h3 style = {{marginBottom: 10}}></h3>
              <Form form = {addForm} onFinish={handleSubmit}>
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
                          Create
                      </Button>
                      )}
                  </Form.Item>
              </Form>
        </Modal>)
}


