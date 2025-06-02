import React from 'react';
import { TESTIMONIALS } from '../utils/constants';

const TestTestimonials = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test des Témoignages</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {TESTIMONIALS.slice(0, 4).map((testimonial) => (
          <div 
            key={testimonial.id} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
          >
            <h3>{testimonial.name}</h3>
            <p style={{ fontStyle: 'italic', color: '#666' }}>
              {testimonial.company}
            </p>
            <div style={{ 
              margin: '15px 0',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#333'
            }}>
              {testimonial.text}
            </div>
            <div>Note: {testimonial.rating}/5 ⭐</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestTestimonials;
