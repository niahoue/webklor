import { Component } from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

/**
 * Composant de gestion d'erreur global pour l'application
 * Capture les erreurs JavaScript et affiche une interface utilisateur de secours
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Met à jour l'état pour afficher l'interface de secours lors du prochain rendu
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Capture les détails de l'erreur
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Ici on pourrait logger l'erreur vers un service externe
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Oops ! Une erreur est survenue</Alert.Heading>
            <p>
              Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
            </p>
            <hr />
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-danger" 
                onClick={this.handleReload}
              >
                Recharger la page
              </Button>
              <Button 
                variant="danger" 
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </div>
          </Alert>
          
          {process.env.MODE === 'development' && (
            <details className="mt-4">
              <summary>Détails de l'erreur (développement)</summary>
              <pre className="mt-2 p-3 bg-light border rounded">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </Container>
      );
    }

    // Si aucune erreur, rendre les enfants normalement
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
