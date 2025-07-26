import React from 'react';
import './ContactPage.css';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">Contact Me</h1>
      <p className="text-lg text-center">
        You can reach me at <a href="mailto:email@example.com" className="text-blue-500 hover:underline">email@example.com</a>.
      </p>
    </div>
  );
};

export default ContactPage;