import React, { useState } from 'react';
import { Rate, Button, message } from 'antd';
import './ContactSection.css';

const ContactSection = () => {
  const [testimonials, setTestimonials] = useState([
    {
      quote: "En tant qu'entreprise en ligne, nous avons été déplacés dans ce qui nous recommande.",
      author: "Responsable IT",
      rating: 2,
    },
    {
      quote: "Grâce à votre plateforme, je ne signifie pas de comprendre les informations, mais on est aussi responsables de l'entreprise et de l'application.",
      author: "Questionnaire indépendant",
      rating: 5,
    },
    {
      quote: "Une solution intuitive, bien précise pour le nouveau travailleur. Promettez ?",
      author: "Expert en digitalisation",
      rating: 5,
    }
  ]);

  const [newTestimonial, setNewTestimonial] = useState({
    quote: '',
    author: '',
    rating: 3,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setNewTestimonial(prev => ({ ...prev, rating: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTestimonial.quote || !newTestimonial.author) {
      message.warning('Veuillez remplir tous les champs');
      return;
    }
    setTestimonials([...testimonials, newTestimonial]);
    setNewTestimonial({
      quote: '',
      author: '',
      rating: 3,
    });
    message.success('Merci pour votre avis!');
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title">Nos Clients Satisfaits</h2>
        
        <div className="testimonials-container">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-quote">"{testimonial.quote}"</div>
              <div className="testimonial-author">{testimonial.author}</div>
              <Rate 
                disabled 
                defaultValue={testimonial.rating} 
                className="testimonial-rating" 
              />
            </div>
          ))}
        </div>

        <div className="add-testimonial">
          <h3>Donnez votre avis</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                name="quote"
                value={newTestimonial.quote}
                onChange={handleInputChange}
                placeholder="Votre témoignage..."
                rows={3}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="author"
                  value={newTestimonial.author}
                  onChange={handleInputChange}
                  placeholder="Votre nom/prénom"
                  required
                />
              </div>
              <div className="form-group">
                <Rate 
                  value={newTestimonial.rating} 
                  onChange={handleRatingChange}
                  className="rating-input"
                />
              </div>
            </div>
            <Button 
              type="primary" 
              htmlType="submit"
              className="submit-button"
            >
              Soumettre votre avis
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;