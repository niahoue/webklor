import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Spinner, Alert } from 'react-bootstrap';
import CommentForm from './CommentForm';

/**
 * Composant affichant un commentaire individuel avec ses réponses
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element}
 */
const CommentItem = ({ comment, postId, onCommentSubmitted }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">{comment.name}</h5>
          <small className="text-muted">{formatDate(comment.createdAt)}</small>
        </div>
        
        <p className="mb-3">{comment.content}</p>
        
        <div className="d-flex align-items-center">
          <Button 
            variant="link" 
            className="p-0 text-decoration-none"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            {showReplyForm ? 'Annuler la réponse' : 'Répondre'}
          </Button>
        </div>
        
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm 
              postId={postId} 
              parentCommentId={comment._id}
              onCommentSubmitted={() => {
                setShowReplyForm(false);
                if (onCommentSubmitted) onCommentSubmitted();
              }}
            />
          </div>
        )}
        
        {/* Afficher les réponses s'il y en a */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies mt-3 ms-4 border-start ps-3">
            {comment.replies.map((reply) => (
              <div key={reply._id} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{reply.name}</h6>
                  <small className="text-muted">{formatDate(reply.createdAt)}</small>
                </div>
                <p className="mb-2">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

/**
 * Composant affichant la section des commentaires d'un article
 * @param {Object} props - Propriétés du composant
 * @returns {JSX.Element}
 */
const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les commentaires
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/blog/posts/${postId}/comments`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors du chargement des commentaires');
      }
      
      const data = await response.json();
      setComments(data.data);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };
  
  // Charger les commentaires au montage du composant
  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  return (
    <section className="comments-section mt-5 pt-4 border-top">
      <h3 className="mb-4">Commentaires ({comments.length})</h3>
      
      <CommentForm postId={postId} onCommentSubmitted={fetchComments} />
      
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des commentaires...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : comments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-muted">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
        </div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              postId={postId}
              onCommentSubmitted={fetchComments}
            />
          ))}
        </div>
      )}
    </section>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  onCommentSubmitted: PropTypes.func
};

Comments.propTypes = {
  postId: PropTypes.string.isRequired
};

export default Comments;
