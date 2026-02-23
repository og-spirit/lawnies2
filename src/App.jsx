import LandingPage from './components/LandingPage.jsx';
import PaymentPage from './components/PaymentPage.jsx';
import SignupPage from './components/SignupPage.jsx';

export default function App() {
  const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';

  if (normalizedPath === '/signup') {
    return <SignupPage />;
  }

  if (normalizedPath === '/payment') {
    return <PaymentPage />;
  }

  return <LandingPage />;
}
