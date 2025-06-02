import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import LazyImage from './LazyImage';
import '../styles/admin.css';

/**
 * Layout pour les pages d'administration
 * Fournit un en-tête et un pied de page cohérents pour toutes les pages admin
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {JSX.Element} props.children - Les enfants du composant
 * @returns {JSX.Element}
 */
const AdminLayout = ({ children, title = "Administration" }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Fonction de déconnexion
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-dark text-white py-3 mb-4 shadow admin-header">
        <Container>
          <div className="d-flex justify-content-between align-items-center">            <div className="d-flex align-items-center">
              <LazyImage 
                src="/assets/images/logo.png" 
                alt="WebKlor" 
                height="40" 
                width="120"
                className="me-3 admin-logo" 
                onClick={() => navigate('/admin')}
                style={{ cursor: 'pointer' }}
                priority={true}
                sizes="120px"
              />
              <h4 className="mb-0">{title}</h4>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="profile-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div>
                  <div className="fw-bold">{currentUser?.name || 'Admin'}</div>
                  <small className="text-light-50">{currentUser?.email}</small>
                </div>
              </div>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleLogout}
                className="d-flex align-items-center logout-btn"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Déconnexion
              </Button>
            </div>
          </div>
        </Container>
      </header>
      
      <section className="py-4 bg-light admin-content">
        {children}
      </section>
    </>
  );
};

export default AdminLayout;
