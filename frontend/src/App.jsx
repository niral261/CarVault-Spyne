import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/Login.jsx';
import ProductListPage from './pages/ProductListPage';  
import CreateProductPage from './pages/CreateProductPage'; 
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import Header from './components/Header.jsx';
import UpdateProductPage from './pages/UpdateProductPage.jsx';
import { useSession } from '@clerk/clerk-react';

function App() {
  const { isSignedIn } = useSession();

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={isSignedIn ? "/myproducts" : "/login"} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myproducts" element={<><Header /><ProductListPage /></>} />
          <Route path="/create-product" element={<><Header /><CreateProductPage /></>} /> 
          <Route path="/product-detail/:id" element={<><Header /><ProductDetailPage /></>} />
          <Route path="/update-product/:id" element={<><Header /><UpdateProductPage /></>} />       
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
