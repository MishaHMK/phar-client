import './App.css';
import { ProductPage } from './components/ProductPage';
import { BrowserRouter, Route, Routes} from "react-router-dom";
import { ConfigProvider} from "antd";
import { NavBar } from './components/NavBar';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { CartPage } from './components/Cart';
import { OrderPage } from './components/OrdersPage';
import { ManagementPage } from './components/ManagementPage';
import  FooterContainer  from './components/Footer';

function App() {
  return (
    <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1d3057',
          },
          components: {
            Card: {
              headerBg: '#1d3057',
              colorTextHeading: 'white'
            }
          }
        }}>

    <div className="App">
    <BrowserRouter>
            <NavBar/>
            <div className="content">
            <Routes>
                   <Route path="" element={<Login/>} />
                   <Route path="register" element={<Register/>} />
                   <Route path="products" element={<ProductPage/>} />
                   <Route path="orders" element={<OrderPage/>} />
                   <Route path="carts" element={<CartPage/>} />
                   <Route path="management" element={<ManagementPage/>} />
            </Routes> 
            </div>
    </BrowserRouter>
    <FooterContainer/>
    </div>

</ConfigProvider>
  );
}

export default App;
