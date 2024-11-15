import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductListPage from './ProductListPage';

export function Login() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/myproducts');
    }
  }, [isSignedIn, navigate]);

  return (
    <header>
      <SignedOut>
        <SignIn path="/login" routing="path" />
      </SignedOut>
      <SignedIn>
        <ProductListPage />
      </SignedIn>
    </header>
  );
}
