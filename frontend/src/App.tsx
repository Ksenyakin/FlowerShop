import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './components/LoginForm'; // Пример страницы логина
import RegisterPage from './components/RegisterForm';
import ProfilePage from "./components/ProfilePage";
import UpdateUserPage from "./components/UpdateUserPage";
import ProductsPage from "./components/ProductsPage";
import ProductPage from "./components/ProductPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import ProductForm from "./pages/admin/ProductForm";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import DeliveryPage from "./pages/DeliveryPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import GuaranteePage from "./pages/GuaranteePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import PaymentPage from "./pages/PaymentPage";
import ContactPage from "./pages/ContactPage";
import OrdersPage from "./pages/OrdersPage";




const App: React.FC = () => {
    return (
        <Router>
            <div className="container"> {/* Ограничиваем ширину всего контента */}
                <Routes>
                    {/* Админские маршруты */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductsAdmin />} />
                    <Route path="/admin/products/new" element={<ProductForm />} />
                    <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                    <Route path="/admin/categories" element={<CategoriesAdmin />} />

                    <Route path="/" element={<WelcomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/update-user" element={<UpdateUserPage />} />
                    <Route path = "/products" element={<ProductsPage/>}/>
                    <Route path="/products/:id" element={<ProductPage/>} />
                    <Route path="/delivery" element={<DeliveryPage/>} />
                    <Route path="/cart" element={<CartPage/>} />
                    <Route path="/about" element={<AboutPage/>} />
                    <Route path="/warranty" element={<GuaranteePage/>} />
                    <Route path="/privacy" element={<PrivacyPolicyPage/>} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/contacts" element={<ContactPage />} />
                    <Route path="/orders" element={<OrdersPage />} />



                </Routes>
            </div>
        </Router>
    );
};

export default App;
