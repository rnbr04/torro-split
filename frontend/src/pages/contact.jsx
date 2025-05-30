import React, { useState } from 'react';
import BackgroundAnimation from '../components/backgroundAnimation';
import Button from '../components/button';
import Nav from '../components/nav';
import teamLogo from '../assets/gadget_labs.svg';
import './contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
      });
      const [showDialog, setShowDialog] = useState(false);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Simulating successful form submission
        console.log('Form submitted:', formData);
        setShowDialog(true);
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      };
    
      const handleCloseDialog = () => {
        setShowDialog(false);
      };

  return (
    <>
    <Nav/>
    <BackgroundAnimation 
      imageUrl={teamLogo}
      opacity={0.1}
      animationDuration={90} /*render speed*/
      patternSize={120}
    >
    <div className="contact-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <h2 className="form-title">Contact Us</h2>
        
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            placeholder="Your Name"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
            placeholder="Your Email"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message (Optional)</label>
          <textarea 
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="form-input form-textarea"
            rows="4"
          />
        </div>
        
        <Button 
        btntype="submit" 
        btnclasses="submit-button" 
        btntext="Send Message"/>
      </form>

      {showDialog && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h3 id='popup-header'>Message Sent Successfully</h3>
            <p>Thank you for your message. We'll get back to you soon.</p>
            <Button 
            btnclick={handleCloseDialog} 
            btnclasses="dialog-close-button"
            btntext="OK"/>
          </div>
        </div>
      )}
    </div>
    </BackgroundAnimation>
    </>
  );
};

export default Contact;