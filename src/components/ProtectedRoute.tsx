import { Navigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { loading, sub } = useSubscription();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading subscription...</div>
      </div>
    );
  }
  
  const isAuthenticated = sub.status === 'active' || sub.status === 'trialing';
  
  return isAuthenticated ? children : <Navigate to="/pricing" replace />;
}
