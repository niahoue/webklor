import React from 'react';
import { Card } from 'react-bootstrap';

const TestCard = () => {
  const testimonial = {
    name: "Marie A kouassi",
    company: "Boutique Élégance",
    sector: "E-commerce",
    text: "WebKlor a transformé notre présence en ligne avec un site e-commerce qui reflète parfaitement l'élégance de notre marque. Les ventes ont augmenté de 40% dès le premier mois après le lancement!"
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
      <h2>Test Card Témoignage</h2>
      
      {/* Version ultra simple */}
      <Card style={{ marginBottom: '20px' }}>
        <Card.Body>
          <h5>{testimonial.name}</h5>
          <p style={{ fontSize: '14px', color: '#666' }}>{testimonial.company}</p>
          
          {/* Test 1: Texte simple */}
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8f9fa', 
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}>
            <strong>Test 1 - Texte direct :</strong>
            <p>{testimonial.text}</p>
          </div>
          
          {/* Test 2: Avec styles inline complets */}
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#333',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflow: 'visible',
            textOverflow: 'clip',
            display: 'block',
            height: 'auto',
            maxHeight: 'none',
            minHeight: 'auto'
          }}>
            <strong>Test 2 - Avec styles :</strong><br/>
            "{testimonial.text}"
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TestCard;
