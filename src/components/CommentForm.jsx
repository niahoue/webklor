import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { apiPost } from '../services/api';

/**
 * Formulaire pour ajouter un commentaire
 * @param {Object} props - Propriétés du composant 
 * @returns {JSX.Element}
 */
const CommentForm = ({ postId, parentCommentId = null, onCommentSubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Préparer les données à envoyer
      const commentData = {
        name: formData.name,
        email: formData.email,
        content: formData.content
      };
      
      // Ajouter parentCommentId seulement s'il existe
      if (parentCommentId) {
        commentData.parentCommentId = parentCommentId;
      }
      
      // Utiliser apiPost correctement (sans les options fetch)
      const response = await apiPost(`/api/blog/posts/${postId}/comments`, commentData);
      
      // Vérifier si la réponse contient une erreur
      if (!response.success) {
        throw new Error(response.message || 'Une erreur est survenue lors de l\'envoi du commentaire');
      }
      
      // Réinitialiser le formulaire en cas de succès
      setFormData({
        name: '',
        email: '',
        content: ''
      });
      
      setSuccess(true);
      
      // Notifier le parent que le commentaire a été soumis
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
      
      // Masquer le message de succès après 5 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi du commentaire:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'envoi du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mb-4">
      <Card.Body>
        <h4 className="mb-3">
          {parentCommentId ? 'Répondre' : 'Laisser un commentaire'}
        </h4>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Votre commentaire a été soumis et est en attente de modération.
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Votre nom"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Votre adresse email (ne sera pas publiée)"
            />
            <Form.Text className="text-muted">
              Votre adresse email ne sera pas publiée.
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Commentaire *</Form.Label>
            <Form.Control
              as="textarea"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              required
              disabled={isSubmitting}
              placeholder="Votre commentaire..."
            />
          </Form.Group>
          
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Envoi en cours...
              </>
            ) : (
              'Publier le commentaire'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired,
  parentCommentId: PropTypes.string,
  onCommentSubmitted: PropTypes.func
};

export default CommentForm;